import { createClient } from "@supabase/supabase-js";
import type { PersonalSnapshot } from "@/lib/personal-snapshot";

const projectUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

// Public config only. Never place a Supabase secret/service-role key in VITE_*.
export const supabase = projectUrl && publishableKey
  ? createClient(projectUrl, publishableKey, {
      // GitHub Pages is a client-only app. The default Magic Link template uses
      // the implicit browser flow; PKCE requires a custom token-hash callback.
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: "implicit" },
    })
  : null;

export interface CloudSnapshot {
  revision: number;
  data: PersonalSnapshot;
}

export async function readCloudSnapshot(userId: string): Promise<CloudSnapshot | null> {
  if (!supabase) throw new Error("Cloud sync is not configured");
  const { data, error } = await supabase.from("personal_snapshots")
    .select("revision, data").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data ? { revision: data.revision, data: data.data as PersonalSnapshot } : null;
}

export async function createCloudSnapshot(userId: string, data: PersonalSnapshot): Promise<CloudSnapshot> {
  if (!supabase) throw new Error("Cloud sync is not configured");
  const result = await supabase.from("personal_snapshots")
    .insert({ user_id: userId, revision: 1, data }).select("revision, data").single();
  if (result.error) throw result.error;
  return { revision: result.data.revision, data: result.data.data as PersonalSnapshot };
}

/** Compare-and-swap: a second device cannot silently overwrite a newer revision. */
export async function updateCloudSnapshot(userId: string, expectedRevision: number, data: PersonalSnapshot): Promise<CloudSnapshot | null> {
  if (!supabase) throw new Error("Cloud sync is not configured");
  const result = await supabase.from("personal_snapshots")
    .update({ revision: expectedRevision + 1, data, updated_at: new Date().toISOString() })
    .eq("user_id", userId).eq("revision", expectedRevision)
    .select("revision, data").maybeSingle();
  if (result.error) throw result.error;
  return result.data ? { revision: result.data.revision, data: result.data.data as PersonalSnapshot } : null;
}
