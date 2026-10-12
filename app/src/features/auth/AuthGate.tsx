import { useState } from "react";
import { Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { useAuth } from "./AuthProvider";
import { App } from "@/App";

export function AuthGate() {
  const auth = useAuth();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  if (auth.ready && auth.syncStatus !== "conflict") return <App key={auth.userId ?? "guest"} />;

  async function resolve(action: () => Promise<void>) {
    setBusy(true);
    setActionError(null);
    try { await action(); } catch (cause) { setActionError(cause instanceof Error ? cause.message : String(cause)); }
    finally { setBusy(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-background p-6">
    <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-7 shadow-subtle">
      {auth.syncStatus === "conflict" ? <>
        <ShieldAlert className="text-accent" size={27} />
        <h1 className="mt-4 font-display text-2xl font-semibold">Two copies of your progress</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">This device has unsynced changes, and another device changed the cloud copy. Choose which whole copy to keep; nothing is overwritten automatically.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button disabled={busy} onClick={() => resolve(auth.useCloudCopy)}>Use cloud copy</Button>
          <Button disabled={busy} variant="outline" onClick={() => resolve(auth.keepDeviceCopy)}>Keep this device</Button>
        </div>
      </> : <>
        {auth.error ? <ShieldAlert className="text-accent" size={27} /> : <Loader2 className="animate-spin text-primary" size={27} />}
        <h1 className="mt-4 font-display text-2xl font-semibold">{auth.error ? "Could not load your private data" : "Opening your workspace"}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{auth.error ?? "Checking your account and its private cloud state…"}</p>
        {auth.error && <div className="mt-5 flex flex-wrap gap-2"><Button disabled={busy} onClick={auth.retry}><RefreshCw size={16} />Retry</Button><Button disabled={busy} variant="outline" onClick={() => {
          if (window.confirm("Sign out and discard any unsynced data cached for this account on this device? This cannot be undone.")) void resolve(() => auth.signOut(true));
        }}>Sign out and discard local copy</Button></div>}
      </>}
      {actionError && <p role="alert" className="mt-3 text-sm text-accent">{actionError}</p>}
    </div>
  </main>;
}
