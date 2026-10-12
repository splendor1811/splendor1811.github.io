import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { liveQuery } from "dexie";
import type { Session } from "@supabase/supabase-js";
import { db, eraseUserCache, switchPersonalDatabase } from "@/lib/db";
import { createCloudSnapshot, readCloudSnapshot, supabase, updateCloudSnapshot, type CloudSnapshot } from "@/lib/supabase";
import { parsePersonalSnapshot, readPersonalSnapshot, replacePersonalSnapshot } from "@/lib/personal-snapshot";

type SyncStatus = "local" | "loading" | "synced" | "pending" | "syncing" | "offline" | "conflict";
interface SyncMeta { revision: number; dirty: boolean }
interface AuthState {
  userId: string | null;
  email: string | null;
  configured: boolean;
  ready: boolean;
  syncStatus: SyncStatus;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: (discardUnsynced?: boolean) => Promise<void>;
  retry: () => void;
  useCloudCopy: () => Promise<void>;
  keepDeviceCopy: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);
export function useAuth(): AuthState {
  const state = useContext(AuthContext);
  if (!state) throw new Error("AuthProvider is missing");
  return state;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [loadedIdentity, setLoadedIdentity] = useState<string | null | undefined>(supabase ? undefined : null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(supabase ? "loading" : "local");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const conflictRef = useRef<CloudSnapshot | null>(null);
  const syncNowRef = useRef<(() => Promise<boolean>) | null>(null);
  const resolveRef = useRef<{ cloud: () => Promise<void>; device: () => Promise<void> } | null>(null);
  const statusRef = useRef<SyncStatus>(syncStatus);
  statusRef.current = syncStatus;
  const setStatus = (next: SyncStatus) => { statusRef.current = next; setSyncStatus(next); };

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      if (active) { setSession(next); setAuthReady(true); }
    });
    void supabase.auth.getSession().then(({ data, error: authError }) => {
      if (!active) return;
      if (authError) setError(authError.message);
      setSession(data.session);
      setAuthReady(true);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const userId = session?.user.id ?? null;
  useEffect(() => {
    if (!authReady) return;
    if (!userId) {
      switchPersonalDatabase(null);
      syncNowRef.current = null;
      resolveRef.current = null;
      conflictRef.current = null;
      setLoadedIdentity(null);
      setStatus("local");
      setError(null);
      return;
    }

    let cancelled = false;
    let subscription: { unsubscribe: () => void } | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let revision = 0;
    let lastSynced = "";
    let generation = 0;
    let activeSync: Promise<boolean> | null = null;
    switchPersonalDatabase(userId);
    const accountDb = db;
    setLoadedIdentity(undefined);
    setStatus("loading");
    setError(null);

    const persistMeta = (dirty: boolean) => accountDb.settings.put({ key: "cloud-sync", value: { revision, dirty } satisfies SyncMeta });
    const schedule = (delay = 650) => {
      clearTimeout(timer);
      timer = setTimeout(() => { void syncNow(); }, delay);
    };
    const syncNow = async (): Promise<boolean> => {
      if (activeSync) return activeSync;
      if (cancelled || conflictRef.current || !revision) return false;
      const task = (async () => {
        try {
          const startGeneration = generation;
          const snapshot = await readPersonalSnapshot(accountDb);
          if (cancelled) return false;
          const serialized = JSON.stringify(snapshot);
          if (serialized === lastSynced) {
            await persistMeta(false);
            setStatus("synced");
            return true;
          }
          setStatus("syncing");
          const updated = await updateCloudSnapshot(userId, revision, snapshot);
          if (cancelled) return false;
          if (!updated) {
            const latest = await readCloudSnapshot(userId);
            if (cancelled) return false;
            if (latest && JSON.stringify(latest.data) === serialized) {
              revision = latest.revision;
              lastSynced = serialized;
            } else {
              conflictRef.current = latest;
              setStatus("conflict");
              return false;
            }
          } else {
            revision = updated.revision;
            lastSynced = serialized;
          }
          const stillDirty = generation !== startGeneration;
          await persistMeta(stillDirty);
          if (cancelled) return false;
          setStatus(stillDirty ? "pending" : "synced");
          if (stillDirty) schedule();
          return !stillDirty;
        } catch (cause) {
          if (cancelled) return false;
          setError(cause instanceof Error ? cause.message : "Cloud sync failed");
          setStatus("offline");
          schedule(10_000);
          return false;
        } finally {
          activeSync = null;
        }
      })();
      activeSync = task;
      return task;
    };
    syncNowRef.current = syncNow;

    resolveRef.current = {
      cloud: async () => {
        const latest = await readCloudSnapshot(userId);
        if (!latest) throw new Error("Cloud copy is unavailable");
        lastSynced = JSON.stringify(latest.data);
        if (cancelled) return;
        await replacePersonalSnapshot(parsePersonalSnapshot(latest.data), accountDb);
        revision = latest.revision;
        conflictRef.current = null;
        await persistMeta(false);
        setError(null);
        setStatus("synced");
      },
      device: async () => {
        const latest = await readCloudSnapshot(userId);
        if (!latest) throw new Error("Cloud copy is unavailable");
        if (cancelled) return;
        revision = latest.revision;
        conflictRef.current = null;
        generation++;
        await persistMeta(true);
        await syncNow();
      },
    };

    const boot = async () => {
      try {
        const remote = await readCloudSnapshot(userId);
        if (cancelled) return;
        const meta = (await accountDb.settings.get("cloud-sync"))?.value as SyncMeta | undefined;
        if (cancelled) return;
        if (remote) {
          revision = remote.revision;
          lastSynced = JSON.stringify(remote.data);
          const deviceCopy = await readPersonalSnapshot(accountDb);
          if (cancelled) return;
          const deviceSerialized = JSON.stringify(deviceCopy);
          const deviceHasData = Object.values(deviceCopy).some(rows => rows.length > 0);
          const unexpectedDifference = deviceHasData && deviceSerialized !== lastSynced && (!meta || !meta.dirty);
          if ((meta?.dirty && meta.revision !== remote.revision) || unexpectedDifference) {
            conflictRef.current = remote;
            setStatus("conflict");
          } else if (!meta?.dirty) {
            await replacePersonalSnapshot(parsePersonalSnapshot(remote.data), accountDb);
            await persistMeta(false);
            setStatus("synced");
          } else {
            setStatus("pending");
          }
        } else {
          const created = await createCloudSnapshot(userId, await readPersonalSnapshot(accountDb));
          revision = created.revision;
          lastSynced = JSON.stringify(created.data);
          await persistMeta(false);
          setStatus("synced");
        }
        if (cancelled) return;
        let first = true;
        subscription = liveQuery(() => readPersonalSnapshot(accountDb)).subscribe({
          next: snapshot => {
            if (cancelled) return;
            if (first) { first = false; if (!meta?.dirty && JSON.stringify(snapshot) === lastSynced) return; }
            if (JSON.stringify(snapshot) === lastSynced) return;
            generation++;
            void persistMeta(true);
            if (!conflictRef.current) { setStatus("pending"); schedule(); }
          },
          error: cause => setError(String(cause)),
        });
        setLoadedIdentity(userId);
        if (meta?.dirty && !conflictRef.current) schedule(0);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Could not load your account");
          setStatus("offline");
          setLoadedIdentity(undefined);
        }
      }
    };
    void boot();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      subscription?.unsubscribe();
      syncNowRef.current = null;
      resolveRef.current = null;
    };
  }, [authReady, userId, retryCount]);

  async function signIn() {
    if (!supabase) throw new Error("Account sign-in is not configured yet");
    const redirect = new URL(import.meta.env.BASE_URL, location.origin).toString();
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: redirect } });
    if (authError) throw authError;
  }

  async function signOut(discardUnsynced = false) {
    if (!supabase || !userId) return;
    if (!discardUnsynced && loadedIdentity !== userId) throw new Error("Wait for your account data to finish loading before signing out.");
    if (!discardUnsynced && ["offline", "conflict", "pending", "syncing"].includes(statusRef.current)) {
      const saved = await syncNowRef.current?.();
      if (!saved || statusRef.current !== "synced") throw new Error("Resolve or finish cloud sync before signing out, so changes are not lost.");
    }
    const oldUserId = userId;
    const { error: authError } = await supabase.auth.signOut();
    if (authError) throw authError;
    switchPersonalDatabase(null);
    await eraseUserCache(oldUserId);
  }

  const value: AuthState = {
    userId, email: session?.user.email ?? null, configured: !!supabase, ready: authReady && loadedIdentity === userId,
    syncStatus, error, signIn, signOut, retry: () => setRetryCount(count => count + 1),
    useCloudCopy: async () => { await resolveRef.current?.cloud(); },
    keepDeviceCopy: async () => { await resolveRef.current?.device(); },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
