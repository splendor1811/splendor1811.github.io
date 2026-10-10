import type { Resource } from "../src/data/schema";

type RecordValue = Record<string, unknown>;

function record(value: unknown, path: string): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
  return value as RecordValue;
}

function text(value: unknown, path: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${path} must be a non-empty string`);
  return value;
}

function recordDate(value: unknown, path: string): void {
  const raw = text(value, path);
  const iso = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2}))?$/;
  const day = raw.slice(0, 10);
  if (!iso.test(raw) || !Number.isFinite(Date.parse(raw)) ||
      new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) !== day) {
    throw new Error(`${path} must be a valid ISO date or timestamp with a timezone`);
  }
}

// This is a publication guard, not a network-access or DNS-rebinding validator.
// Browser snapshots and local/private links must never enter the public bundle.
export function validatePublicReference(value: unknown, path: string): void {
  const raw = text(value, path);
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error(`${path} must be an absolute public HTTP(S) URL`); }
  if (!/^https?:$/.test(url.protocol) || url.username || url.password) {
    throw new Error(`${path} must be a public HTTP(S) URL without credentials`);
  }
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  const ipv4 = /^\d+\.\d+\.\d+\.\d+$/.test(host) ? host.split(".").map(Number) : null;
  const localV4 = ipv4 && (ipv4[0] === 0 || ipv4[0] === 10 || ipv4[0] === 127 ||
    (ipv4[0] === 169 && ipv4[1] === 254) || (ipv4[0] === 172 && ipv4[1] >= 16 && ipv4[1] <= 31) ||
    (ipv4[0] === 192 && ipv4[1] === 168));
  const localV6 = /^\[(?:|::|::1|f[cd][0-9a-f:]*|fe[89ab][0-9a-f:]*|::ffff:[0-9a-f:.]+)\]$/.test(host);
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || localV4 || localV6) {
    throw new Error(`${path} points to a local/private address`);
  }
}

export function validateLibraryReferences(input: {
  resources: readonly Pick<Resource, "id" | "url" | "topicSlug">[];
  topicSlugs: ReadonlySet<string>;
  provenance: unknown;
  intake: unknown;
}): void {
  const resourceIds = new Set(input.resources.map(resource => resource.id));
  function domain(value: unknown, path: string) {
    if (!input.topicSlugs.has(text(value, path))) throw new Error(`${path} refers to an unknown domain: ${value}`);
  }
  function resource(value: unknown, path: string) {
    if (!resourceIds.has(text(value, path))) throw new Error(`${path} refers to an unknown resource: ${value}`);
  }
  for (const item of input.resources) {
    validatePublicReference(item.url, `Resource ${item.id}.url`);
    domain(item.topicSlug, `Resource ${item.id}.topicSlug`);
  }
  const provenance = record(input.provenance, "Provenance");
  for (const [id, raw] of Object.entries(provenance)) {
    resource(id, "Provenance key");
    const entry = record(raw, `Provenance ${id}`);
    if (entry.origin !== undefined && (typeof entry.origin !== "string" || !["edge", "x", "manual", "lilianweng"].includes(entry.origin))) {
      throw new Error(`Provenance ${id}.origin is invalid`);
    }
    if (entry.verification !== undefined && (typeof entry.verification !== "string" || !["primary", "metadata-only"].includes(entry.verification))) {
      throw new Error(`Provenance ${id}.verification is invalid`);
    }
    if (entry.note !== undefined && typeof entry.note !== "string") throw new Error(`Provenance ${id}.note must be a string`);
    for (const key of ["capturedAt", "verifiedAt"]) {
      if (entry[key] !== undefined) recordDate(entry[key], `Provenance ${id}.${key}`);
    }
    if (entry.sourceUrl !== undefined) validatePublicReference(entry.sourceUrl, `Provenance ${id}.sourceUrl`);
    if (entry.verification === "primary") {
      validatePublicReference(entry.sourceUrl, `Provenance ${id}.sourceUrl`);
      text(entry.note, `Provenance ${id}.note (review scope)`);
    }
    if (entry.relatedDomains !== undefined) {
      if (!Array.isArray(entry.relatedDomains)) throw new Error(`Provenance ${id}.relatedDomains must be an array`);
      for (const slug of entry.relatedDomains) domain(slug, `Provenance ${id}.relatedDomains`);
    }
    if (entry.discoveryLinks !== undefined) {
      if (!Array.isArray(entry.discoveryLinks)) throw new Error(`Provenance ${id}.discoveryLinks must be an array`);
      for (const rawLink of entry.discoveryLinks) {
        const link = record(rawLink, `Provenance ${id}.discoveryLinks item`);
        validatePublicReference(link.url, `Provenance ${id}.discoveryLinks URL`);
        text(link.label, `Provenance ${id}.discoveryLinks label`);
      }
    }
  }
  const intake = record(input.intake, "Intake");
  if (intake.updatedAt !== null) recordDate(intake.updatedAt, "Intake.updatedAt");
  const coverage = record(intake.coverage, "Intake.coverage");
  for (const key of ["edgeWindows", "edgeTabs", "edgeUniqueUrls"]) {
    const count = coverage[key];
    if (count !== undefined && (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0)) {
      throw new Error(`Intake.coverage.${key} must be a non-negative integer`);
    }
  }
  if (coverage.xStatus !== undefined && typeof coverage.xStatus !== "string") throw new Error("Intake.coverage.xStatus must be a string");
  if (coverage.xComplete !== undefined && typeof coverage.xComplete !== "boolean") throw new Error("Intake.coverage.xComplete must be a boolean");
  if (!Array.isArray(intake.entries)) throw new Error("Intake.entries must be an array");
  const seen = new Set<string>();
  for (const raw of intake.entries) {
    const entry = record(raw, "Intake entry");
    const id = text(entry.id, "Intake entry.id");
    if (seen.has(id)) throw new Error(`Duplicate intake ID: ${id}`);
    seen.add(id);
    for (const key of ["title", "source", "note"]) text(entry[key], `Intake ${id}.${key}`);
    validatePublicReference(entry.url, `Intake ${id}.url`);
    if (entry.verifiedAt !== undefined) recordDate(entry.verifiedAt, `Intake ${id}.verifiedAt`);
    if (typeof entry.status !== "string" || !["imported", "existing", "needs-review"].includes(entry.status)) throw new Error(`Intake ${id}.status is invalid`);
    if (entry.domainSlug !== undefined) domain(entry.domainSlug, `Intake ${id}.domainSlug`);
    if (entry.resourceId !== undefined || entry.status !== "needs-review") resource(entry.resourceId, `Intake ${id}.resourceId`);
  }
}
