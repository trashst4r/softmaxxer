"use client";

import { useState, useEffect } from "react";

export function DeveloperModeToggle() {
  // Always start with false to match SSR
  const [isDevMode, setIsDevMode] = useState(false);

  // Load from localStorage after mount (hydration-safe pattern)
  useEffect(() => {
    const stored = localStorage.getItem("developer_mode");
    if (stored === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDevMode(true);
    }
  }, []);

  const toggleDevMode = () => {
    const newValue = !isDevMode;
    setIsDevMode(newValue);
    localStorage.setItem("developer_mode", String(newValue));

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent("developer-mode-change", { detail: { enabled: newValue } }));
  };

  return (
    <button
      onClick={toggleDevMode}
      className={`fixed bottom-4 left-4 z-50 px-3 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${
        isDevMode
          ? "bg-foreground text-background border-foreground"
          : "bg-background text-muted border-border hover:border-foreground hover:text-foreground"
      }`}
      title="Toggle developer mode (skip validation, allow step navigation)"
      suppressHydrationWarning
    >
      Dev {isDevMode ? "ON" : "OFF"}
    </button>
  );
}

/**
 * Hook to check if developer mode is enabled.
 * Always returns false on first render to match SSR.
 * Loads from localStorage after mount.
 */
export function useDevMode() {
  // Always start with false to match SSR
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Load from localStorage after mount (hydration-safe pattern)
    const stored = localStorage.getItem("developer_mode");
    if (stored === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDevMode(true);
    }

    // Listen for changes from toggle button
    const handleDevModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      setIsDevMode(customEvent.detail.enabled);
    };

    window.addEventListener("developer-mode-change", handleDevModeChange);

    return () => {
      window.removeEventListener("developer-mode-change", handleDevModeChange);
    };
  }, []);

  return isDevMode;
}
