import { useState } from "react";
import { BookOpen, Github, Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { useAuth } from "./AuthProvider";
import { App } from "@/App";
import { downloadBackup, exportData } from "@/lib/export";

export function AuthGate() {
  const auth = useAuth();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  if (auth.ready && auth.syncStatus !== "conflict") {
    if (!auth.configured) return import.meta.env.DEV ? <App key="guest" /> : <ConfigurationGate />;
    if (auth.userId) return <App key={auth.userId} />;
    return <SignInGate signIn={auth.signIn} />;
  }

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
        {auth.error && <div className="mt-5 flex flex-wrap gap-2"><Button disabled={busy} onClick={auth.retry}><RefreshCw size={16} />Retry</Button><Button disabled={busy} variant="outline" onClick={() => resolve(() => auth.signOut())}>Sign out · keep local copy</Button></div>}
      </>}
      {actionError && <p role="alert" className="mt-3 text-sm text-accent">{actionError}</p>}
    </div>
  </main>;
}

function ConfigurationGate() {
  return <main className="flex min-h-screen items-center justify-center bg-background p-6">
    <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-7 shadow-subtle">
      <ShieldAlert className="text-accent" size={27} />
      <h1 className="mt-4 font-display text-2xl font-semibold">Sign-in is unavailable</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">This deployment is missing its public Supabase configuration. The workspace interface remains closed until it is configured.</p>
    </div>
  </main>;
}

function SignInGate({ signIn }: { signIn: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function start() {
    setBusy(true);
    setError(null);
    try { await signIn(); }
    catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setBusy(false);
    }
  }
  async function backupGuest() {
    setError(null);
    try { downloadBackup(await exportData()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-background p-6">
    <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-7 shadow-subtle sm:p-9">
      <BookOpen className="text-primary" size={30} />
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Second Brain · Research Atlas</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Sign in to explore</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Connect your GitHub account to open the learning workspace and keep your reading progress private to your account.</p>
      <Button className="mt-6 w-full" disabled={busy} onClick={start}>
        {busy ? <Loader2 size={17} className="animate-spin" /> : <Github size={17} />} Continue with GitHub
      </Button>
      <Button variant="outline" className="mt-2 w-full" disabled={busy} onClick={backupGuest}>Download previous browser progress</Button>
      {error && <p role="alert" className="mt-3 text-sm text-accent">{error}</p>}
      <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">Sign-in gates the website interface. The underlying GitHub Pages files remain public.</p>
    </div>
  </main>;
}
