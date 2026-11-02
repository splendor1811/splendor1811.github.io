import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useUI } from "@/store/ui";

export function AppLayout() {
  const { sidebarOpen, setSidebarOpen } = useUI();
  return (
    <Dialog.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-[100dvh] overflow-hidden bg-background">
        <a href="#main-scroll" className="skip-link">Skip to content</a>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-foreground/45" />
          <Dialog.Content className="fixed inset-y-3 left-3 z-50 w-[min(340px,calc(100vw-24px))] overflow-hidden rounded-lg border-2 border-border bg-surface shadow-raised">
            <Dialog.Title className="sr-only">Workspace navigation</Dialog.Title>
            <Dialog.Description className="sr-only">Explore your resources, topics and learning tools.</Dialog.Description>
            <Dialog.Close className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-accent text-foreground transition-transform hover:-translate-y-0.5" aria-label="Close menu"><X size={18} /></Dialog.Close>
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main id="main-scroll" tabIndex={-1} className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth focus:outline-none"><Suspense fallback={<div role="status" className="p-8 font-mono text-sm text-muted-foreground">Tuning the signal…</div>}><Outlet /></Suspense></main>
        </div>
      </div>
    </Dialog.Root>
  );
}
