export interface IntakeEntry {
  id: string;
  title: string;
  url: string;
  source: string;
  domainSlug?: string;
  status: "imported" | "existing" | "needs-review";
  resourceId?: string;
  note: string;
  verifiedAt?: string;
}
export interface SourceIntake {
  updatedAt: string | null;
  coverage: {edgeWindows?:number;edgeTabs?:number;edgeUniqueUrls?:number;xStatus?:string;xComplete?:boolean};
  entries: IntakeEntry[];
}

export const INTAKE_ORIGINS = [
  { value: "edge", label: "Edge tabs" },
  { value: "x", label: "X reposts" },
  { value: "lilianweng", label: "Lilian Weng" },
  { value: "followup", label: "Follow-up sources" },
  { value: "other", label: "Other sources" },
] as const;

export type IntakeOrigin = typeof INTAKE_ORIGINS[number]["value"];

/** Acquisition is encoded in stable inventory IDs, not the source's publisher. */
export function getIntakeOrigin(entry: Pick<IntakeEntry, "id">): IntakeOrigin {
  if (entry.id.startsWith("edge-")) return "edge";
  if (entry.id.startsWith("x-")) return "x";
  if (entry.id.startsWith("lilianweng-")) return "lilianweng";
  if (entry.id.startsWith("followup-")) return "followup";
  return "other";
}

export function parseIntakeOrigin(value: string | null): IntakeOrigin | "" {
  return INTAKE_ORIGINS.find(origin => origin.value === value)?.value ?? "";
}

interface IntakeFilters {
  query?: string;
  status?: IntakeEntry["status"] | "all" | string;
  domain?: string;
  origin?: IntakeOrigin | "";
}

const normalizeQuery = (text: string) => text.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");

export function filterIntakeEntries(
  entries: readonly IntakeEntry[],
  { query = "", status = "all", domain = "", origin = "" }: IntakeFilters = {},
  domainTitle: (slug: string) => string | undefined = () => undefined,
): IntakeEntry[] {
  const needle = normalizeQuery(query.trim());
  return entries.filter(entry => {
    if (status !== "all" && entry.status !== status) return false;
    if (domain && entry.domainSlug !== domain) return false;
    if (origin && getIntakeOrigin(entry) !== origin) return false;
    const domainText = entry.domainSlug ? `${entry.domainSlug} ${domainTitle(entry.domainSlug) ?? ""}` : "";
    return normalizeQuery(`${entry.title} ${entry.url} ${entry.source} ${entry.note} ${domainText}`).includes(needle);
  });
}
