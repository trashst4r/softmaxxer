"use client";

import { motion } from "framer-motion";

/**
 * Sprint D8: Page Transitions
 *
 * Consistent fade + slight vertical motion across all routes.
 * Fast (200ms), subtle, no directional logic.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1], // easeOutQuart (same as check-in)
      }}
    >
      {children}
    </motion.div>
  );
}
