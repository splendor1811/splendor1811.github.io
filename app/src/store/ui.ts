import { create } from "zustand";

export type Theme = "dark" | "light";

interface UIState {
  theme: Theme;
  commandOpen: boolean;
  sidebarOpen: boolean; // mobile drawer
  shortcutsOpen: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setCommandOpen: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  setShortcutsOpen: (v: boolean) => void;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#14232f" : "#f5f7fa");
  try {
    localStorage.setItem("sb-theme", theme);
  } catch {}
}

const initialTheme: Theme = (() => {
  try { return localStorage.getItem("sb-theme") === "dark" ? "dark" : "light"; }
  catch { return "light"; }
})();

export const useUI = create<UIState>((set, get) => ({
  theme: initialTheme,
  commandOpen: false,
  sidebarOpen: false,
  shortcutsOpen: false,
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    applyTheme(next);
    set({ theme: next });
  },
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setShortcutsOpen: (shortcutsOpen) => set({ shortcutsOpen }),
}));
