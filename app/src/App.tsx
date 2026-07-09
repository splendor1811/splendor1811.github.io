import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { CommandPalette } from "@/components/CommandPalette";
import { ShortcutsDialog } from "@/components/ShortcutsDialog";
import { useUI } from "@/store/ui";
import { PRIMARY_NAV } from "@/lib/nav";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { LibraryPage } from "@/features/library/LibraryPage";
import { ResourcePage } from "@/features/resource/ResourcePage";
import { TopicsPage } from "@/features/topics/TopicsPage";
import { TopicDetailPage } from "@/features/topics/TopicDetailPage";
import { RoadmapPage } from "@/features/roadmap/RoadmapPage";
import { ReviewPage } from "@/features/review/ReviewPage";
import { ActivityPage } from "@/features/activity/ActivityPage";
import { FavoritesPage } from "@/features/favorites/FavoritesPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { AddPage } from "@/features/add/AddPage";

// The force-graph library is heavy — load it only when the graph is visited.
const GraphPage = lazy(() =>
  import("@/features/graph/GraphPage").then((m) => ({ default: m.GraphPage })),
);

function useGlobalShortcuts() {
  const navigate = useNavigate();
  const { setCommandOpen, toggleTheme, setShortcutsOpen } = useUI();

  useEffect(() => {
    let gPending = false;
    let gTimer: ReturnType<typeof setTimeout> | undefined;

    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Command palette — works everywhere.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
        return;
      }
      if (typing) return;

      if (e.key === "?") {
        setShortcutsOpen(true);
        return;
      }
      if (e.key.toLowerCase() === "t" && (e.metaKey || e.ctrlKey) === false && e.shiftKey) {
        toggleTheme();
        return;
      }

      // "g then <key>" navigation.
      if (gPending) {
        const item = PRIMARY_NAV.find((n) => n.key === e.key.toLowerCase());
        if (item) {
          e.preventDefault();
          navigate(item.to);
        }
        gPending = false;
        clearTimeout(gTimer);
        return;
      }
      if (e.key.toLowerCase() === "g") {
        gPending = true;
        gTimer = setTimeout(() => (gPending = false), 900);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, setCommandOpen, toggleTheme, setShortcutsOpen]);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById("main-scroll")?.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export function App() {
  useGlobalShortcuts();
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/resource/:id" element={<ResourcePage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/:slug" element={<TopicDetailPage />} />
          <Route
            path="/graph"
            element={
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Loading graph…
                  </div>
                }
              >
                <GraphPage />
              </Suspense>
            }
          />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Route>
      </Routes>
      <CommandPalette />
      <ShortcutsDialog />
    </>
  );
}
