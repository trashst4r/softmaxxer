/**
 * Protocol Page Motion System
 * Single source of truth for all animation timing and easing
 *
 * Rules:
 * - No inline timing or easing anywhere
 * - All Framer Motion transitions must reference these values
 * - Vertical motion only (max 4px translateY)
 * - No bounce, elastic, or decorative motion
 */

export const motion = {
  duration: {
    instant: 0,    // Border changes, immediate feedback
    fast: 150,     // Checkmarks, small state changes
    base: 200,     // Default for most transitions
    slow: 300,     // Section collapse, progress bar
    modal: 400,    // Deck bar entrance, modal open
  },
  easing: {
    standard: [0.22, 1, 0.36, 1] as [number, number, number, number],     // Default ease-out-cubic
    entrance: [0, 0.55, 0.45, 1] as [number, number, number, number],     // Modals, major transitions
    exit: [0.55, 0, 1, 0.45] as [number, number, number, number],         // Dismissals
  },
  stagger: {
    cards: 50,     // Product cards within a section
    slots: 30,     // Deck bar slots on first appearance
  },
} as const;

/**
 * Common Framer Motion variants
 */
export const variants = {
  // Card entrance (for initial render)
  cardEntrance: {
    initial: { opacity: 0, y: 4 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motion.duration.base / 1000,
        ease: motion.easing.standard,
      }
    },
  },

  // Modal entrance
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: motion.duration.base / 1000,
        ease: motion.easing.entrance,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: motion.duration.base / 1000,
        ease: motion.easing.exit,
      }
    },
  },

  modalContent: {
    initial: { opacity: 0, scale: 0.96 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: motion.duration.slow / 1000,
        ease: motion.easing.entrance,
        delay: 0.1,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: motion.duration.base / 1000,
        ease: motion.easing.exit,
      }
    },
  },
} as const;
