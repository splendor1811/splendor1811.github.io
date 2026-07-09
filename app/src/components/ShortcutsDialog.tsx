import * as Dialog from "@radix-ui/react-dialog";
import { useUI } from "@/store/ui";
import { Kbd } from "@/components/ui/primitives";

const GROUPS: { title: string; items: [string[], string][] }[] = [
  {
    title: "General",
    items: [
      [["⌘", "K"], "Open command palette"],
      [["?"], "Show this help"],
      [["⇧", "T"], "Toggle theme"],
    ],
  },
  {
    title: "Navigation (press g, then…)",
    items: [
      [["g", "d"], "Dashboard"],
      [["g", "l"], "Library"],
      [["g", "t"], "Topics"],
      [["g", "g"], "Knowledge graph"],
      [["g", "v"], "Review"],
    ],
  },
];

export function ShortcutsDialog() {
  const { shortcutsOpen, setShortcutsOpen } = useUI();
  return (
    <Dialog.Root open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[60] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 animate-scale-in rounded-xl border border-border bg-popover p-6 shadow-raised">
          <Dialog.Title className="font-display text-lg font-semibold text-foreground">
            Keyboard shortcuts
          </Dialog.Title>
          <div className="mt-5 space-y-5">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <div className="rail mb-2">{g.title}</div>
                <div className="space-y-1.5">
                  {g.items.map(([keys, label]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <span className="flex items-center gap-1">
                        {keys.map((k, i) => (
                          <Kbd key={i}>{k}</Kbd>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
