/**
 * Sprint 15: Console Intelligence Layer
 * Analyzes console data to actively guide user behavior.
 * Deterministic analysis - no fake metrics, no gamification.
 */

import type { AnalysisResult } from "@/types/analysis";
import {
  getDailyAdherence,
  getScanHistory,
  getDailyCheckIns,
  type DailyAdherenceEntry,
  type ScanHistoryEntry,
  type DailyCheckIn,
} from "./console-state";

export type AdherenceSignal = "consistent" | "inconsistent" | "declining" | "unknown";
export type TrendDirection = "improving" | "plateau" | "unstable" | "unknown";
export type ConcernProgression = "resolving" | "unchanged" | "worsening" | "unknown";

export interface ConsoleIntelligence {
  adherenceSignal: AdherenceSignal;
  adherenceReason: string;
  trendDirection: TrendDirection;
  trendReason: string;
  concernProgression: ConcernProgression;
  concernReason: string;
  nextAction: string; // Clear, actionable guidance
  nextActionPriority: "critical" | "high" | "medium"; // Visual emphasis level
  context: string; // Why this matters right now
}

/**
 * Analyze console data and generate intelligent guidance.
 * This is the main entry point for Sprint 15 intelligence.
 */
export function generateConsoleIntelligence(result: AnalysisResult): ConsoleIntelligence {
  const adherence = getDailyAdherence();
  const scanHistory = getScanHistory();
  const checkIns = getDailyCheckIns();

  // Analyze adherence pattern (last 14 days)
  const { signal: adherenceSignal, reason: adherenceReason } = analyzeAdherence(adherence);

  // Analyze trend direction (comparing scans)
  const { direction: trendDirection, reason: trendReason } = analyzeTrend(
    result,
    scanHistory
  );

  // Analyze concern progression (top concern only)
  const { progression: concernProgression, reason: concernReason } = analyzeConcernProgression(
    result,
    scanHistory,
    checkIns
  );

  // Generate next action based on all signals
  const { action: nextAction, priority: nextActionPriority, context } = generateNextAction(
    adherenceSignal,
    trendDirection,
    concernProgression,
    result
  );

  return {
    adherenceSignal,
    adherenceReason,
    trendDirection,
    trendReason,
    concernProgression,
    concernReason,
    nextAction,
    nextActionPriority,
    context,
  };
}

/**
 * Analyze adherence pattern over last 14 days.
 */
function analyzeAdherence(
  adherence: DailyAdherenceEntry[]
): { signal: AdherenceSignal; reason: string } {
  if (adherence.length === 0) {
    return {
      signal: "unknown",
      reason: "No adherence data recorded yet",
    };
  }

  const last14Days = getLast14Days();
  const recentEntries = adherence.filter((e) => last14Days.includes(e.date));

  if (recentEntries.length < 3) {
    return {
      signal: "unknown",
      reason: "Need at least 3 days of data to assess pattern",
    };
  }

  // Calculate completion rates for each entry
  const completionRates = recentEntries.map((entry) => {
    const allSteps = [...entry.am, ...entry.pm];
    const completed = allSteps.filter((s) => s.status === "completed").length;
    return (completed / allSteps.length) * 100;
  });

  const avgRate = completionRates.reduce((a, b) => a + b, 0) / completionRates.length;

  // Check for declining trend (comparing first half vs second half)
  const midpoint = Math.floor(completionRates.length / 2);
  const firstHalf = completionRates.slice(0, midpoint);
  const secondHalf = completionRates.slice(midpoint);
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const decline = firstAvg - secondAvg;

  // Determine signal
  if (decline > 20) {
    return {
      signal: "declining",
      reason: `Adherence dropped from ${Math.round(firstAvg)}% to ${Math.round(secondAvg)}% over ${recentEntries.length} days`,
    };
  } else if (avgRate >= 75) {
    return {
      signal: "consistent",
      reason: `${Math.round(avgRate)}% average completion rate over ${recentEntries.length} days`,
    };
  } else if (avgRate >= 50) {
    return {
      signal: "inconsistent",
      reason: `${Math.round(avgRate)}% average completion rate with ${Math.round(Math.max(...completionRates) - Math.min(...completionRates))}% variability`,
    };
  } else {
    return {
      signal: "declining",
      reason: `Low adherence at ${Math.round(avgRate)}% average completion`,
    };
  }
}

/**
 * Analyze trend direction by comparing scans over time.
 */
function analyzeTrend(
  current: AnalysisResult,
  history: ScanHistoryEntry[]
): { direction: TrendDirection; reason: string } {
  if (history.length < 2) {
    return {
      direction: "unknown",
      reason: "Need at least 2 scans to identify trends",
    };
  }

  // Get previous scan (second in history, since first is current)
  const previous = history[1];

  // Compare key metrics
  const acneDelta = current.scores.acne_severity - previous.scores.acne_severity;
  const barrierDelta = current.scores.barrier_health - previous.scores.barrier_health;
  const overallDelta = current.scores.overall_condition - previous.scores.overall_condition;

  // Count improvements vs declines
  let improvements = 0;
  let declines = 0;

  // Acne severity: lower is better
  if (acneDelta < -5) improvements++;
  else if (acneDelta > 5) declines++;

  // Barrier health: higher is better
  if (barrierDelta > 5) improvements++;
  else if (barrierDelta < -5) declines++;

  // Overall condition: higher is better
  if (overallDelta > 5) improvements++;
  else if (overallDelta < -5) declines++;

  // Determine direction
  if (improvements >= 2 && declines === 0) {
    return {
      direction: "improving",
      reason: `${improvements} key metrics improved since last scan`,
    };
  } else if (declines >= 2) {
    return {
      direction: "unstable",
      reason: `${declines} key metrics declined since last scan`,
    };
  } else if (Math.abs(acneDelta) < 5 && Math.abs(barrierDelta) < 5 && Math.abs(overallDelta) < 5) {
    return {
      direction: "plateau",
      reason: "No significant changes in key metrics",
    };
  } else {
    return {
      direction: "plateau",
      reason: "Mixed changes across metrics",
    };
  }
}

/**
 * Analyze progression of top concern.
 */
function analyzeConcernProgression(
  current: AnalysisResult,
  history: ScanHistoryEntry[],
  checkIns: DailyCheckIn[]
): { progression: ConcernProgression; reason: string } {
  const topConcern = current.ranked_concerns[0];

  if (!topConcern) {
    return {
      progression: "unknown",
      reason: "No primary concern identified",
    };
  }

  // Check recent check-ins for user perception
  const recentCheckIns = checkIns.slice(0, 7); // Last 7 check-ins
  if (recentCheckIns.length >= 3) {
    const betterCount = recentCheckIns.filter((c) => c.skin_feel === "better").length;
    const worseCount = recentCheckIns.filter((c) => c.skin_feel === "worse").length;

    if (betterCount >= recentCheckIns.length * 0.6) {
      return {
        progression: "resolving",
        reason: `${betterCount}/${recentCheckIns.length} recent check-ins report improvement`,
      };
    } else if (worseCount >= recentCheckIns.length * 0.5) {
      return {
        progression: "worsening",
        reason: `${worseCount}/${recentCheckIns.length} recent check-ins report worsening`,
      };
    }
  }

  // Fall back to scan comparison if available
  if (history.length >= 2) {
    const previous = history[1];
    const concernKey = topConcern.concern.toLowerCase();

    // Try to match concern to score
    let currentScore = 0;
    let previousScore = 0;

    if (concernKey.includes("acne")) {
      currentScore = current.scores.acne_severity;
      previousScore = previous.scores.acne_severity;
    } else if (concernKey.includes("oil")) {
      currentScore = current.scores.oil_production;
      previousScore = previous.scores.oil_production;
    } else if (concernKey.includes("dry") || concernKey.includes("dehydrat")) {
      currentScore = current.scores.dryness_dehydration;
      previousScore = previous.scores.dryness_dehydration;
    } else if (concernKey.includes("sensiti")) {
      currentScore = current.scores.sensitivity_reactivity;
      previousScore = previous.scores.sensitivity_reactivity;
    }

    if (currentScore > 0 && previousScore > 0) {
      const delta = currentScore - previousScore;
      // For problem scores, lower is better
      if (delta < -10) {
        return {
          progression: "resolving",
          reason: `${topConcern.concern} score improved from ${previousScore} to ${currentScore}`,
        };
      } else if (delta > 10) {
        return {
          progression: "worsening",
          reason: `${topConcern.concern} score increased from ${previousScore} to ${currentScore}`,
        };
      } else {
        return {
          progression: "unchanged",
          reason: `${topConcern.concern} score stable at ${currentScore}`,
        };
      }
    }
  }

  return {
    progression: "unknown",
    reason: "Insufficient data to assess concern progression",
  };
}

/**
 * Generate clear next action based on all signals.
 */
function generateNextAction(
  adherence: AdherenceSignal,
  trend: TrendDirection,
  concern: ConcernProgression,
  result: AnalysisResult
): { action: string; priority: "critical" | "high" | "medium"; context: string } {
  // CRITICAL: Declining adherence
  if (adherence === "declining") {
    return {
      action: "Resume your protocol today. Complete both AM and PM routines.",
      priority: "critical",
      context:
        "Consistency is essential for results. Missing steps allows concerns to return.",
    };
  }

  // CRITICAL: Worsening concern with inconsistent adherence
  if (concern === "worsening" && adherence === "inconsistent") {
    const topConcern = result.ranked_concerns[0]?.concern || "primary concern";
    return {
      action: `Lock in your routine for 7 days. ${topConcern} requires consistent application.`,
      priority: "critical",
      context: "Irregular adherence is preventing your protocol from working effectively.",
    };
  }

  // HIGH: Barrier risk elevated
  if (result.barrier_risk === "Elevated") {
    return {
      action: "Pause actives. Focus only on cleansing, moisturizing, and SPF until barrier recovers.",
      priority: "high",
      context:
        "Elevated barrier risk means your skin needs repair before continuing active treatment.",
    };
  }

  // HIGH: Improving trend but inconsistent adherence
  if (trend === "improving" && adherence === "inconsistent") {
    return {
      action: "Your protocol is working. Maintain consistency to accelerate progress.",
      priority: "high",
      context: "You're seeing improvement. Regular adherence will compound these results.",
    };
  }

  // HIGH: Plateau with consistent adherence
  if (trend === "plateau" && adherence === "consistent") {
    return {
      action: "Progress has plateaued. Consider retaking analysis to adjust protocol.",
      priority: "high",
      context:
        "You're following the protocol consistently but results have stalled. Time to reassess.",
    };
  }

  // MEDIUM: Resolving concern with consistent adherence
  if (concern === "resolving" && adherence === "consistent") {
    return {
      action: "Continue current protocol. Your routine is working effectively.",
      priority: "medium",
      context: "Stay the course. Consistent adherence is delivering visible improvement.",
    };
  }

  // MEDIUM: Inconsistent adherence, no crisis
  if (adherence === "inconsistent") {
    return {
      action: "Aim for 7 consecutive days of full adherence. Build the habit first.",
      priority: "medium",
      context: "Consistency matters more than perfection. Focus on completing your routine daily.",
    };
  }

  // MEDIUM: Unknown state - need data
  if (adherence === "unknown" || trend === "unknown") {
    return {
      action: "Record today's routine adherence to start building your progress data.",
      priority: "medium",
      context: "The console needs adherence data to provide intelligent guidance.",
    };
  }

  // DEFAULT: Keep going
  return {
    action: "Complete your AM and PM routines. Monitor skin response daily.",
    priority: "medium",
    context: "Maintain your protocol and track progress through regular check-ins.",
  };
}

/**
 * Helper: Get last 14 days as YYYY-MM-DD strings.
 */
function getLast14Days(): string[] {
  const days: string[] = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }
  return days;
}
