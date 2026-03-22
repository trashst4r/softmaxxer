"use client";

import type { SkinProfile } from "@/types/skin-profile";
import type { AnalysisResult } from "@/types/analysis";

interface ExportButtonProps {
  profile: SkinProfile;
  routine: AnalysisResult;
}

export function ExportButton({ profile, routine }: ExportButtonProps) {
  const handleExport = () => {
    const exportData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      profile,
      routine: {
        am: routine.am_routine,
        pm: routine.pm_routine,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `softmaxxer-protocol-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-surface bg-surface-container-low hover:bg-surface-container-highest rounded-lg transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Export Protocol
    </button>
  );
}
