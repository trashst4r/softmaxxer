"use client";

import { useEffect, useState } from "react";
import {
  getDailyAdherence,
  calculateAdherenceRate,
} from "@/lib/console-state";

interface AdherenceStats {
  todayRate: number;
  sevenDayRate: number;
  todayMissedAM: number;
  todayMissedPM: number;
  todayCompletedTotal: number;
  todayTotalSteps: number;
}

export function AdherenceSummaryCard() {
  const [stats, setStats] = useState<AdherenceStats | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const allEntries = getDailyAdherence();
    const todayEntry = allEntries.find((e) => e.date === today);

    // Calculate today stats
    let todayCompletedTotal = 0;
    let todayTotalSteps = 0;
    let todayMissedAM = 0;
    let todayMissedPM = 0;

    if (todayEntry) {
      const allSteps = [...todayEntry.am, ...todayEntry.pm];
      todayTotalSteps = allSteps.length;
      todayCompletedTotal = allSteps.filter((s) => s.status === "completed").length;
      todayMissedAM = todayEntry.am.filter((s) => s.status === "missed").length;
      todayMissedPM = todayEntry.pm.filter((s) => s.status === "missed").length;
    }

    const todayRate = todayTotalSteps > 0 ? Math.round((todayCompletedTotal / todayTotalSteps) * 100) : 0;

    // Calculate 7-day rate
    const sevenDayRate = calculateAdherenceRate(sevenDaysAgo, today);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats({
      todayRate,
      sevenDayRate,
      todayMissedAM,
      todayMissedPM,
      todayCompletedTotal,
      todayTotalSteps,
    });
  }, []);

  if (!stats) {
    return (
      <div className="clinical-card space-y-4">
        <h2 className="clinical-label">Adherence Summary</h2>
        <div className="text-sm text-muted">Loading adherence data...</div>
      </div>
    );
  }

  return (
    <div className="clinical-card space-y-6">
      <h2 className="clinical-label">Adherence Summary</h2>

      <div className="space-y-4">
        {/* Today's completion */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wider text-muted">Today</span>
            <span className="text-2xl font-light text-foreground">{stats.todayRate}%</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${stats.todayRate}%` }}
            />
          </div>
          <div className="text-xs text-muted">
            {stats.todayCompletedTotal} of {stats.todayTotalSteps} steps completed
          </div>
        </div>

        {/* 7-day completion */}
        <div className="space-y-2 pt-3 border-t border-border">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wider text-muted">7-Day Average</span>
            <span className="text-2xl font-light text-foreground">{stats.sevenDayRate}%</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${stats.sevenDayRate}%` }}
            />
          </div>
        </div>

        {/* Missed steps breakdown */}
        {(stats.todayMissedAM > 0 || stats.todayMissedPM > 0) && (
          <div className="pt-3 border-t border-border space-y-2">
            <div className="text-xs uppercase tracking-wider text-muted">Today&rsquo;s Missed Steps</div>
            <div className="flex gap-4 text-sm">
              {stats.todayMissedAM > 0 && (
                <div className="space-y-1">
                  <div className="text-foreground">{stats.todayMissedAM}</div>
                  <div className="text-xs text-muted">AM</div>
                </div>
              )}
              {stats.todayMissedPM > 0 && (
                <div className="space-y-1">
                  <div className="text-foreground">{stats.todayMissedPM}</div>
                  <div className="text-xs text-muted">PM</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Perfect completion message */}
        {stats.todayRate === 100 && stats.todayTotalSteps > 0 && (
          <div className="pt-3 border-t border-primary/30 bg-primary/5 -mx-6 -mb-6 px-6 py-3 rounded-b-sm">
            <div className="text-sm text-foreground">Protocol completed for today</div>
          </div>
        )}
      </div>
    </div>
  );
}
