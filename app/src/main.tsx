import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { App } from "@/App";
import "@/styles/globals.css";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <TooltipProvider delayDuration={300}>
        <App />
        <Toaster
          theme="system"
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                "!bg-popover !border-border !text-popover-foreground !rounded-lg !font-sans",
            },
          }}
        />
      </TooltipProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
