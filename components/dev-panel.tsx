"use client";

import { useAccessState } from "@/lib/access-state";
import { useDevMode } from "./developer-mode-toggle";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import type { AccessState } from "@/lib/access-state";

const DEV_PAGES = [
  { path: "/", label: "Home" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/analysis", label: "Analysis" },
  { path: "/results", label: "Results" },
  { path: "/protocol", label: "Protocol" },
  { path: "/how-it-works", label: "How It Works" },
  { path: "/preferences", label: "Preferences" },
  { path: "/console", label: "Console" },
  { path: "/media-kit", label: "Media Kit" },
  { path: "/dev", label: "Dev Index" },
  { path: "/dev/texture-audit", label: "Texture Audit" },
  { path: "/dev/simulation", label: "Simulation" },
  { path: "/dev/engine", label: "Engine Test" },
  { path: "/dev/routines", label: "Routines" },
  { path: "/dev/products", label: "Products" },
];

export function DevPanel() {
  const [accessState, setAccessState] = useAccessState();
  const isDevMode = useDevMode();
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  if (!isDevMode) return null;

  const handleAccessChange = (state: AccessState) => {
    setAccessState(state);
    window.location.reload();
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    alert("localStorage cleared!");
  };

  const copyProfileData = () => {
    const profile = localStorage.getItem("active_profile");
    const regimen = localStorage.getItem("active_regimen");
    const data = { profile: profile ? JSON.parse(profile) : null, regimen: regimen ? JSON.parse(regimen) : null };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("Profile data copied to clipboard!");
  };

  return (
    <div className="fixed bottom-20 left-4 z-50">
      <div className="bg-background border-2 border-primary rounded-lg shadow-2xl max-w-sm">
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-primary cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">engineering</span>
            <div className="text-xs uppercase tracking-widest font-bold text-primary">
              Dev Panel
            </div>
          </div>
          <span className="material-symbols-outlined text-primary text-sm">
            {expanded ? "expand_less" : "expand_more"}
          </span>
        </div>

        {/* Content */}
        {expanded && (
          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Page Navigator */}
            <div className="space-y-2">
              <div className="text-xs text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">map</span>
                Page Navigator
              </div>
              <select
                value={pathname}
                onChange={(e) => router.push(e.target.value)}
                className="w-full text-xs bg-surface-container-low border border-outline-variant rounded px-2 py-1.5 font-mono"
              >
                {DEV_PAGES.map(page => (
                  <option key={page.path} value={page.path}>
                    {page.label} ({page.path})
                  </option>
                ))}
              </select>
            </div>

            {/* Access State */}
            <div className="space-y-2">
              <div className="text-xs text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">badge</span>
                Access State
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="access-state"
                    value="guest"
                    checked={accessState === "guest"}
                    onChange={() => handleAccessChange("guest")}
                    className="accent-primary"
                  />
                  <span className="text-xs text-foreground">Guest</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="access-state"
                    value="member"
                    checked={accessState === "member"}
                    onChange={() => handleAccessChange("member")}
                    className="accent-primary"
                  />
                  <span className="text-xs text-foreground">Member</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="access-state"
                    value="pro"
                    checked={accessState === "pro"}
                    onChange={() => handleAccessChange("pro")}
                    className="accent-primary"
                  />
                  <span className="text-xs text-foreground">Pro</span>
                </label>
              </div>
            </div>

            {/* Dev Tools */}
            <div className="space-y-2">
              <div className="text-xs text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">build</span>
                Tools
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={clearLocalStorage}
                  className="flex items-center gap-2 px-3 py-2 bg-error/10 text-error text-xs font-medium rounded hover:bg-error/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Clear Storage
                </button>
                <button
                  onClick={copyProfileData}
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary text-xs font-medium rounded hover:bg-primary/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copy Profile Data
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-3 py-2 bg-surface-container-highest text-on-surface text-xs font-medium rounded hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Reload Page
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="pt-3 border-t border-outline-variant">
              <div className="text-[10px] text-muted space-y-1">
                <div className="flex justify-between">
                  <span>Access:</span>
                  <span className="text-primary font-mono">{accessState}</span>
                </div>
                <div className="flex justify-between">
                  <span>Path:</span>
                  <span className="text-primary font-mono truncate max-w-[120px]">{pathname}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
