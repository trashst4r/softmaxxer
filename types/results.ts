/**
 * Check-In Results Screen Wiring v1
 * Typed payload for check-in results
 */

import type { SkinProfile } from "./skin-profile";
import type { Routine } from "./regimen";

export interface ResultPayload {
  profile: SkinProfile;
  routine: Routine;
  timestamp: number;
}
