const RESOURCE_TONES = ["resource-tone-0", "resource-tone-1", "resource-tone-2", "resource-tone-3"] as const;

export function resourceTone(index: number): string {
  return RESOURCE_TONES[((index % RESOURCE_TONES.length) + RESOURCE_TONES.length) % RESOURCE_TONES.length];
}
