/**
 * Dev Tools User Simulation v1
 * Timeline of check-in entries for selected user
 */

import type { CheckInEntry } from "@/types/dev-user";

interface CheckInTimelineProps {
  entries: CheckInEntry[];
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}

export function CheckInTimeline({ entries, selectedDay, onSelectDay }: CheckInTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted text-sm">
        No check-in history available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider font-medium text-muted mb-4">
        Check-In History
      </h3>
      <div className="space-y-2">
        {entries.map((entry) => (
          <button
            key={entry.day}
            onClick={() => onSelectDay(entry.day)}
            className={`w-full text-left p-4 rounded-lg border transition-colors ${
              selectedDay === entry.day
                ? "bg-primary/10 border-primary text-on-surface"
                : "bg-surface-container-low border-outline-variant text-muted hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">Day {entry.day}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                {entry.date}
              </span>
            </div>
            {entry.notes && (
              <div className="text-xs opacity-80 line-clamp-2">{entry.notes}</div>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.answers.concerns.map((concern) => (
                <span
                  key={concern}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest"
                >
                  {concern}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
