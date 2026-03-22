/**
 * Dev Tools User Simulation v1
 * Sample simulated users with multi-day check-in histories
 */

import type { DevUser } from "@/types/dev-user";

/**
 * User 1: Oily acne-prone progression
 * Starts with frequent breakouts, gradually improves
 */
const oilyAcneUser: DevUser = {
  id: "user-oily-acne",
  name: "Alex (Oily/Acne-Prone)",
  description: "Oily skin with frequent breakouts, gradually improving over time",
  checkInHistory: [
    {
      day: 1,
      date: "2026-03-01",
      notes: "Initial state - frequent breakouts, very oily",
      answers: {
        concerns: ["breakouts", "oiliness"],
        skin_behavior: "shiny_all",
        frequency: "often",
        sensitivity: "rarely",
        has_actives: false,
        spf_usage: "rarely",
        routine_realism: "easy",
      },
    },
    {
      day: 3,
      date: "2026-03-03",
      notes: "Started using actives",
      answers: {
        concerns: ["breakouts", "oiliness"],
        skin_behavior: "shiny_all",
        frequency: "often",
        sensitivity: "rarely",
        has_actives: true,
        actives: ["benzoyl_peroxide"],
        spf_usage: "sometimes",
        routine_realism: "manageable",
      },
    },
    {
      day: 7,
      date: "2026-03-07",
      notes: "Some improvement, less oil",
      answers: {
        concerns: ["breakouts", "texture"],
        skin_behavior: "shiny_areas",
        frequency: "sometimes",
        sensitivity: "rarely",
        has_actives: true,
        actives: ["benzoyl_peroxide", "aha_bha"],
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
    {
      day: 14,
      date: "2026-03-14",
      notes: "Consistent use, noticeable improvement",
      answers: {
        concerns: ["texture", "breakouts"],
        skin_behavior: "shiny_areas",
        frequency: "rarely",
        sensitivity: "rarely",
        has_actives: true,
        actives: ["benzoyl_peroxide", "aha_bha", "retinoid"],
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
    {
      day: 21,
      date: "2026-03-21",
      notes: "Much clearer, maintaining routine",
      answers: {
        concerns: ["texture"],
        skin_behavior: "balanced",
        frequency: "rarely",
        sensitivity: "rarely",
        has_actives: true,
        actives: ["retinoid", "aha_bha", "vitamin_c"],
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
  ],
};

/**
 * User 2: Dry sensitive recovery
 * Starts with reactive skin, gradually builds tolerance
 */
const drySensitiveUser: DevUser = {
  id: "user-dry-sensitive",
  name: "Sam (Dry/Sensitive)",
  description: "Very dry and reactive skin, slowly building barrier strength",
  checkInHistory: [
    {
      day: 1,
      date: "2026-03-01",
      notes: "Initial state - very dry and reactive",
      answers: {
        concerns: ["dryness", "redness"],
        skin_behavior: "tight",
        frequency: "constant",
        sensitivity: "very_easily",
        has_actives: false,
        spf_usage: "sometimes",
        routine_realism: "manageable",
      },
    },
    {
      day: 5,
      date: "2026-03-05",
      notes: "Gentle routine started",
      answers: {
        concerns: ["dryness", "redness"],
        skin_behavior: "tight",
        frequency: "often",
        sensitivity: "very_easily",
        has_actives: false,
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
    {
      day: 10,
      date: "2026-03-10",
      notes: "Less tight, still sensitive",
      answers: {
        concerns: ["dryness", "redness"],
        skin_behavior: "tight",
        frequency: "sometimes",
        sensitivity: "sometimes",
        has_actives: false,
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
    {
      day: 17,
      date: "2026-03-17",
      notes: "Barrier improving, trying gentle actives",
      answers: {
        concerns: ["redness", "texture"],
        skin_behavior: "balanced",
        frequency: "sometimes",
        sensitivity: "sometimes",
        has_actives: true,
        actives: ["azelaic_acid"],
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
    {
      day: 25,
      date: "2026-03-25",
      notes: "Much more resilient, expanding routine",
      answers: {
        concerns: ["texture"],
        skin_behavior: "balanced",
        frequency: "rarely",
        sensitivity: "rarely",
        has_actives: true,
        actives: ["azelaic_acid", "vitamin_c"],
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
  ],
};

/**
 * User 3: Balanced maintenance
 * Relatively stable skin, minor variations
 */
const balancedMaintenanceUser: DevUser = {
  id: "user-balanced",
  name: "Jordan (Balanced/Maintenance)",
  description: "Generally balanced skin with occasional texture concerns",
  checkInHistory: [
    {
      day: 1,
      date: "2026-03-01",
      notes: "Baseline - balanced with minor texture",
      answers: {
        concerns: ["texture"],
        skin_behavior: "balanced",
        frequency: "rarely",
        sensitivity: "rarely",
        has_actives: true,
        actives: ["retinoid", "vitamin_c"],
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
    {
      day: 4,
      date: "2026-03-04",
      notes: "Minor breakout from stress",
      answers: {
        concerns: ["breakouts", "texture"],
        skin_behavior: "balanced",
        frequency: "sometimes",
        sensitivity: "rarely",
        has_actives: true,
        actives: ["retinoid", "vitamin_c"],
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
    {
      day: 8,
      date: "2026-03-08",
      notes: "Back to baseline",
      answers: {
        concerns: ["texture"],
        skin_behavior: "balanced",
        frequency: "rarely",
        sensitivity: "rarely",
        has_actives: true,
        actives: ["retinoid", "vitamin_c", "aha_bha"],
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
    {
      day: 15,
      date: "2026-03-15",
      notes: "Trying additional actives",
      answers: {
        concerns: ["texture"],
        skin_behavior: "balanced",
        frequency: "rarely",
        sensitivity: "rarely",
        has_actives: true,
        actives: ["retinoid", "vitamin_c", "aha_bha", "azelaic_acid"],
        spf_usage: "daily",
        routine_realism: "manageable",
      },
    },
    {
      day: 22,
      date: "2026-03-22",
      notes: "Optimal state, maintaining",
      answers: {
        concerns: ["texture"],
        skin_behavior: "balanced",
        frequency: "rarely",
        sensitivity: "rarely",
        has_actives: true,
        actives: ["retinoid", "vitamin_c"],
        spf_usage: "daily",
        routine_realism: "easy",
      },
    },
  ],
};

/**
 * All available dev users
 */
export const devUsers: DevUser[] = [
  oilyAcneUser,
  drySensitiveUser,
  balancedMaintenanceUser,
];
