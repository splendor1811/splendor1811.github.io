import { useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import {
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  Sparkles,
  Database,
  Github,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { Button, Input } from "@/components/ui/primitives";
import { Switch } from "@/components/ui/switch";
import { useUI } from "@/store/ui";
import { db, setSetting } from "@/lib/db";
import { getAISettings, DEFAULT_AI_SETTINGS, type AISettings } from "@/lib/ai/client";
import {
  getGitHubConfig,
  saveGitHubConfig,
  testConnection,
  DEFAULT_GITHUB_CONFIG,
  type ConnectionResult,
} from "@/lib/github";
import { exportData, downloadBackup, importData, resetAll, type Backup } from "@/lib/export";
import { resources, topics, generatedAt } from "@/lib/content";
import { cn } from "@/lib/utils";

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: typeof Moon;
  children: React.ReactNode;
}) {
  return (
    <section className="card-surface p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <Icon size={16} className="text-faint" />
        <div>
          <h2 className="font-display text-sm font-semibold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function PublishingSection() {
  const cfg = useLiveQuery(() => getGitHubConfig(), [], DEFAULT_GITHUB_CONFIG);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<ConnectionResult | null>(null);

  async function update(patch: Partial<typeof cfg>) {
    await saveGitHubConfig(patch);
    setResult(null);
  }

  async function onTest() {
    setTesting(true);
    setResult(await testConnection(await getGitHubConfig()));
    setTesting(false);
  }

  const connected = result?.ok && result.canWrite;

  return (
    <Section
      title="Publishing"
      description="Add and edit resources from this site. Commits Markdown to your GitHub repo."
      icon={Github}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Owner</span>
            <Input defaultValue={cfg.owner} onBlur={(e) => update({ owner: e.target.value.trim() })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Repo</span>
            <Input defaultValue={cfg.repo} onBlur={(e) => update({ repo: e.target.value.trim() })} />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            Fine-grained token · Contents: Read and write
          </span>
          <Input
            type="password"
            placeholder="github_pat_…"
            defaultValue={cfg.token}
            onBlur={(e) => update({ token: e.target.value.trim() })}
          />
        </label>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onTest} disabled={testing}>
            {testing ? <Loader2 size={14} className="animate-spin" /> : <Github size={14} />}
            Test connection
          </Button>
          {connected && (
            <span className="flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 size={14} /> Ready to publish
            </span>
          )}
          {result && !connected && (
            <span className="flex items-center gap-1.5 text-xs text-accent">
              <AlertCircle size={14} /> {result.message}
            </span>
          )}
          {connected && <span className="text-xs text-muted-foreground">{result?.message}</span>}
        </div>

        <div className="flex gap-2 rounded-lg border border-border bg-surface/50 p-3 text-xs text-muted-foreground">
          <Github size={14} className="mt-0.5 shrink-0 text-faint" />
          <div className="space-y-1">
            <p>
              Create a token at{" "}
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-foreground underline"
              >
                github.com/settings/personal-access-tokens <ExternalLink size={10} />
              </a>{" "}
              → scope it to this one repo → permission <span className="text-foreground">Contents: Read and write</span>.
            </p>
            <p>The token stays in this browser (IndexedDB) and is sent only to api.github.com.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <div className="text-sm text-foreground">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

export function SettingsPage() {
  const { theme, setTheme } = useUI();
  const ai = useLiveQuery(() => getAISettings(), [], DEFAULT_AI_SETTINGS);
  const fileRef = useRef<HTMLInputElement>(null);

  const counts = useLiveQuery(
    async () => ({
      progress: await db.progress.count(),
      notes: await db.notes.count(),
      highlights: await db.highlights.count(),
      favorites: await db.favorites.count(),
      reviews: await db.reviews.count(),
      activity: await db.activity.count(),
    }),
    [],
  );

  async function updateAI(patch: Partial<AISettings>) {
    await setSetting("ai", { ...ai, ...patch });
  }

  async function onExport() {
    downloadBackup(await exportData());
    toast.success("Backup downloaded");
  }

  function onImportClick() {
    fileRef.current?.click();
  }

  async function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const backup = JSON.parse(await file.text()) as Backup;
      await importData(backup, "merge");
      toast.success("Backup imported");
    } catch (err) {
      toast.error("Import failed", { description: (err as Error).message });
    }
    e.target.value = "";
  }

  async function onReset() {
    if (!confirm("Delete all your progress, notes, highlights and reviews? This cannot be undone.")) return;
    await resetAll();
    toast.success("Personal data cleared");
  }

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader eyebrow="Settings" title="Settings" />

      <div className="mt-6 space-y-4">
        <Section title="Appearance" icon={theme === "dark" ? Moon : Sun}>
          <Row label="Theme" hint="Switch between the dark observatory and light paper themes.">
            <div className="flex overflow-hidden rounded-md border border-border">
              {(["dark", "light"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    theme === t ? "bg-surface-raised text-foreground" : "text-muted-foreground",
                  )}
                >
                  {t === "dark" ? <Moon size={13} /> : <Sun size={13} />}
                  {t}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        <div id="publishing">
          <PublishingSection />
        </div>

        <Section
          title="AI features"
          description="Optional. Off by default. Uses your own Anthropic API key, stored locally."
          icon={Sparkles}
        >
          <Row label="Enable AI assists" hint="Draft note skeletons and summaries on demand.">
            <Switch checked={!!ai.enabled} onCheckedChange={(v) => updateAI({ enabled: v })} />
          </Row>
          {ai.enabled && (
            <div className="mt-2 space-y-3 border-t border-border pt-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Anthropic API key</label>
                <Input
                  type="password"
                  placeholder="sk-ant-…"
                  defaultValue={ai.apiKey}
                  onBlur={(e) => updateAI({ apiKey: e.target.value.trim() })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Model</label>
                <Input defaultValue={ai.model} onBlur={(e) => updateAI({ model: e.target.value.trim() })} />
              </div>
              <p className="text-2xs text-faint">
                Your key never leaves this browser except in direct requests to Anthropic.
              </p>
            </div>
          )}
        </Section>

        <Section title="Your data" description="Everything is stored locally in your browser." icon={Database}>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="secondary" onClick={onExport}>
              <Download size={15} /> Export backup
            </Button>
            <Button variant="secondary" onClick={onImportClick}>
              <Upload size={15} /> Import backup
            </Button>
          </div>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImportFile} />
          {counts && (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {Object.entries(counts).map(([k, v]) => (
                <div key={k} className="rounded-md border border-border bg-surface/50 p-2 text-center">
                  <div className="font-display text-base font-semibold text-foreground">{v}</div>
                  <div className="rail">{k}</div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 border-t border-border pt-3">
            <Button variant="destructive" size="sm" onClick={onReset}>
              <Trash2 size={14} /> Clear all personal data
            </Button>
          </div>
        </Section>

        <Section title="Content" description="Parsed from your Markdown library at build time." icon={Database}>
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-muted-foreground">
            <span>{resources.length} resources</span>
            <span>{topics.length} topics</span>
            <span>generated {new Date(generatedAt).toLocaleString()}</span>
          </div>
        </Section>
      </div>
    </PageContainer>
  );
}
