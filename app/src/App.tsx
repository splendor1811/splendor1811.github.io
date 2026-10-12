import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import { TOPIC_ALIASES, SOURCE_TOPIC_REDIRECTS } from "@/data/topics";
import { AppLayout } from "@/components/AppLayout";
import { CommandPalette } from "@/components/CommandPalette";
import { ShortcutsDialog } from "@/components/ShortcutsDialog";
import { useUI } from "@/store/ui";
import { PRIMARY_NAV } from "@/lib/nav";
import { generatedAt, resources } from "@/lib/content";
import { pruneStaleOverlay } from "@/lib/overlay";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { LibraryPage } from "@/features/library/LibraryPage";
import { TopicsPage } from "@/features/topics/TopicsPage";
const TopicDetailPage = lazy(() => import("@/features/topics/TopicDetailPage").then(m => ({default:m.TopicDetailPage})));
const ResourcePage = lazy(() => import("@/features/resource/ResourcePage").then(m => ({default:m.ResourcePage})));
const RoadmapPage = lazy(() => import("@/features/roadmap/RoadmapPage").then(m => ({default:m.RoadmapPage})));
const ReviewPage = lazy(() => import("@/features/review/ReviewPage").then(m => ({default:m.ReviewPage})));
const ActivityPage = lazy(() => import("@/features/activity/ActivityPage").then(m => ({default:m.ActivityPage})));
const FavoritesPage = lazy(() => import("@/features/favorites/FavoritesPage").then(m => ({default:m.FavoritesPage})));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage").then(m => ({default:m.SettingsPage})));
const AddPage = lazy(() => import("@/features/add/AddPage").then(m => ({default:m.AddPage})));
const SourcesPage = lazy(() => import("@/features/sources/SourcesPage").then(m => ({default:m.SourcesPage})));
const AccountPage = lazy(() => import("@/features/auth/AccountPage").then(m => ({default:m.AccountPage})));

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
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // Command palette — works everywhere.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
        return;
      }
      if (typing) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

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

function TopicRoute() {
  const { slug = "" } = useParams();
  const location = useLocation();
  const source = SOURCE_TOPIC_REDIRECTS[slug];
  if (source) return <Navigate to={`/library?source=${encodeURIComponent(source)}`} replace />;
  const canonical = TOPIC_ALIASES[slug];
  if (canonical) return <Navigate to={`/topics/${canonical}${location.search}`} replace />;
  return <TopicDetailPage />;
}

/** Once a redeploy bakes optimistic adds/edits into content.json, clear their overlays. */
function OverlayReconciler() {
  useEffect(() => {
    const builtAt = new Date(generatedAt).getTime();
    if (!Number.isNaN(builtAt)) pruneStaleOverlay(builtAt, resources);
  }, []);
  return null;
}

export function App() {
  useGlobalShortcuts();
  return (
    <>
      <ScrollToTop />
      <OverlayReconciler />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/resource/:id" element={<ResourcePage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/:slug" element={<TopicRoute />} />
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
