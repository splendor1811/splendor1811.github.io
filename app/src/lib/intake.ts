import raw from "@/data/intake.json";
import type { SourceIntake } from "./intake-filters";

export * from "./intake-filters";
export const intake = raw as SourceIntake;
