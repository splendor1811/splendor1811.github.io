// Shared types for the parsed Markdown knowledge base. `content.json` is validated
// against ContentBundle at generation time.

export type ResourceType =
  | "Blog"
  | "Paper"
  | "Video"
  | "Course"
  | "Book"
  | "Repo"
  | "News";

export interface ResourceMarkers {
  star: boolean; // ⭐ must-read/watch
  startHere: boolean; // 🔁 recommended starting point
  unverified: boolean; // ⚠️unverified — summary reconstructed, verify details
}

export interface Resource {
  id: string; // stable slug (topic + title)
  title: string;
  url: string;
  type: ResourceType;
  source: string;
  dateRaw: string; // as written: ISO, YYYY-MM, YYYY, or "—"
  dateSort: string | null; // normalized YYYY-MM-DD for sorting, null if unknown
  topicSlug: string;
  group: string; // the ### heading the entry lives under
  summary: string;
  keyConcepts: string[];
  markers: ResourceMarkers;
}

export interface Topic {
  slug: string;
  title: string;
  intro: string;
  readingOrder: string | null; // raw "Suggested reading order:" text, if present
  relatedSlugs: string[]; // from the "Related:" back-link line
  groups: string[]; // ### headings in document order
  color: string;
  icon: string;
  short: string;
  resourceCount: number;
}

export interface PriorityItem {
  title: string;
  url: string;
  blurb: string;
  topicSlug: string | null;
  marker: "star" | "startHere" | null;
}

export interface ContentBundle {
  generatedAt: string;
  resources: Resource[];
  topics: Topic[];
  priorityQueue: PriorityItem[];
  tags: { name: string; count: number }[];
}
