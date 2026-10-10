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
        <aside className="hidden w-[244px] shrink-0 border-r border-border bg-surface lg:block"><Sidebar /></aside>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(320px,90vw)] border-r border-border bg-surface shadow-raised">
            <Dialog.Title className="sr-only">Workspace navigation</Dialog.Title>
            <Dialog.Description className="sr-only">Explore your resources, topics and learning tools.</Dialog.Description>
            <Dialog.Close className="absolute right-2 top-3 flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted" aria-label="Close menu"><X size={19} /></Dialog.Close>
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main id="main-scroll" tabIndex={-1} className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth focus:outline-none"><Suspense fallback={<div role="status" className="p-8 text-sm text-muted-foreground">Opening your workspace…</div>}><Outlet /></Suspense></main>
        </div>
      </div>
    </Dialog.Root>
  );
}
