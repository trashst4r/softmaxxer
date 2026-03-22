"use client";

import { useState, useEffect } from "react";
import { addDailyCheckIn, getDailyCheckIns } from "@/lib/console-state";
import type { DailyCheckIn } from "@/lib/console-state";

export function DailyCheckInCard() {
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null);
  const [skinFeel, setSkinFeel] = useState<"better" | "same" | "worse">("same");
  const [breakouts, setBreakouts] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = getDailyCheckIns();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCheckIns(stored);

    // Check if already checked in today
    const today = new Date().toISOString().split("T")[0];
    const existing = stored.find((c) => c.date === today);
    if (existing) {
      setTodayCheckIn(existing);
      setSkinFeel(existing.skin_feel);
      setBreakouts(existing.breakouts);
      setNotes(existing.notes || "");
    }
  }, []);

  const handleSubmit = () => {
    setIsSubmitting(true);

    const today = new Date().toISOString().split("T")[0];
    const checkIn: DailyCheckIn = {
      date: today,
      skin_feel: skinFeel,
      breakouts,
      notes: notes.trim() || undefined,
    };

    addDailyCheckIn(checkIn);
    setTodayCheckIn(checkIn);

    // Reload check-ins
    const updated = getDailyCheckIns();
    setCheckIns(updated);

    setTimeout(() => setIsSubmitting(false), 500);
  };

  const recentCheckIns = checkIns.slice(0, 5);

  return (
    <div className="clinical-card space-y-6">
      <h2 className="clinical-label">Daily Check-In</h2>

      {todayCheckIn ? (
        <div className="space-y-3">
          <div className="text-sm text-foreground">
            ✓ Checked in today
          </div>
          <div className="text-xs text-muted">
            Skin: {todayCheckIn.skin_feel} · Breakouts: {todayCheckIn.breakouts}
          </div>
          {todayCheckIn.notes && (
            <div className="text-xs text-muted italic">&ldquo;{todayCheckIn.notes}&rdquo;</div>
          )}
          <button
            onClick={() => setTodayCheckIn(null)}
            className="text-xs text-primary hover:text-primary/80 uppercase tracking-wider font-medium"
          >
            Update Check-In
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Skin Feel */}
          <div className="space-y-2">
            <label className="text-xs text-muted uppercase tracking-wider">How does your skin feel?</label>
            <div className="flex gap-2">
              {(["better", "same", "worse"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSkinFeel(option)}
                  className={`flex-1 px-3 py-2 text-xs uppercase tracking-wider border rounded-sm transition-all ${
                    skinFeel === option
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted hover:border-primary/30"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Breakouts */}
          <div className="space-y-2">
            <label className="text-xs text-muted uppercase tracking-wider">Active breakouts</label>
            <input
              type="number"
              min="0"
              max="50"
              value={breakouts}
              onChange={(e) => setBreakouts(parseInt(e.target.value) || 0)}
              className="clinical-input text-sm"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs text-muted uppercase tracking-wider">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any reactions, new products, etc..."
              rows={2}
              className="clinical-input text-sm resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="clinical-button w-full disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Submit Check-In"}
          </button>
        </div>
      )}

      {/* Recent History */}
      {recentCheckIns.length > 0 && (
        <div className="pt-4 border-t border-border space-y-3">
          <div className="text-xs text-muted uppercase tracking-wider">Recent History</div>
          <div className="space-y-2">
            {recentCheckIns.map((checkIn, index) => (
              <div key={index} className="text-xs text-foreground flex items-center justify-between">
                <span className="text-muted">{checkIn.date}</span>
                <div className="flex items-center gap-3">
                  <span>{checkIn.skin_feel}</span>
                  <span className="text-muted">{checkIn.breakouts} breakouts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
