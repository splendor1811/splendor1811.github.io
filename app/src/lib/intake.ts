import raw from "@/data/intake.json";

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
export const intake = raw as SourceIntake;
