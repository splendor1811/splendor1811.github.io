import { useState } from "react";
import { toast } from "sonner";
import { Cloud, Github, LockKeyhole, LogOut } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/primitives";
import { useAuth } from "./AuthProvider";

export function AccountPage() {
  const auth = useAuth();
  const [busy, setBusy] = useState(false);
  async function signIn() {
    setBusy(true);
    try {
      await auth.signIn();
    } catch (cause) { toast.error("Sign-in failed", { description: cause instanceof Error ? cause.message : String(cause) }); }
    finally { setBusy(false); }
  }
  async function signOut() {
    setBusy(true);
    try { await auth.signOut(); toast.success("Signed out"); }
    catch (cause) { toast.error("Could not sign out", { description: cause instanceof Error ? cause.message : String(cause) }); }
    finally { setBusy(false); }
  }
  return <PageContainer className="max-w-3xl">
    <PageHeader eyebrow="Private workspace" title="Your account" description="The research library is public. Your reading progress, favorites and notes belong only to you." />
    <section className="mt-7 rounded-xl border border-border bg-surface p-6">
      {!auth.configured ? <><LockKeyhole className="text-primary" size={25}/><h2 className="mt-3 font-display text-lg font-semibold">Account sync is not live yet</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your personal data remains in this browser. The site owner must finish Supabase setup and private-data policies before account sign-in can be enabled.</p></> : auth.userId ? <>
        <Cloud className="text-primary" size={25}/><h2 className="mt-3 font-display text-lg font-semibold">Signed in as {auth.email}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Cloud status: {auth.syncStatus}. Changes are saved to your private Supabase row; a second device cannot silently overwrite a newer copy.</p>
        <Button variant="outline" className="mt-5" disabled={busy} onClick={signOut}><LogOut size={16}/>Sign out</Button>
      </> : <>
        <Github className="text-primary" size={25}/><h2 className="mt-3 font-display text-lg font-semibold">Sign in with GitHub</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use your GitHub account to sync your private reading progress across devices. Your current guest progress stays on this device and is never merged without your choice.</p>
        <Button className="mt-5" disabled={busy} onClick={signIn}><Github size={17} />Continue with GitHub</Button>
      </>}
    </section>
  </PageContainer>;
}
