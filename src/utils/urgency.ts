/**
 * Urgency calculation utilities for deadline-based prioritization
 */

export interface UrgencyInfo {
  multiplier: number;
  tier: number;
  label: string;
  color: string;
  emoji: string;
  isOverdue: boolean;
}

/**
 * Calculate urgency multiplier based on deadline proximity
 * Returns a value between 1.0 (no urgency) and 3.0 (critical urgency)
 */
export function calculateUrgencyMultiplier(deadline: Date | null | undefined): number {
  if (!deadline) return 1.0; // No deadline = no urgency boost

  const now = new Date();
  const daysUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  if (daysUntil < 0) return 3.0; // Overdue - critical
  if (daysUntil < 1) return 2.5; // Due today
  if (daysUntil < 2) return 2.0; // Due tomorrow
  if (daysUntil < 7) return 1.5; // Due this week
  if (daysUntil < 14) return 1.2; // Due in 2 weeks

  return 1.0; // Future - no boost
}

/**
 * Get urgency tier for sorting (higher tier = more urgent)
 */
export function getUrgencyTier(deadline: Date | null | undefined): number {
  if (!deadline) return 0;

  const now = new Date();
  const daysUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  if (daysUntil < 0) return 6; // Overdue
  if (daysUntil < 1) return 5; // Due today
  if (daysUntil < 2) return 4; // Due tomorrow
  if (daysUntil < 7) return 3; // Due this week
  if (daysUntil < 14) return 2; // Due in 2 weeks
  if (daysUntil < 30) return 1; // Due this month

  return 0; // Future
}

/**
 * Check if a task is overdue
 */
export function isOverdue(deadline: Date | null | undefined): boolean {
  if (!deadline) return false;
  return deadline.getTime() < new Date().getTime();
}

/**
 * Calculate days until deadline (negative if overdue)
 */
export function daysUntilDeadline(deadline: Date | null | undefined): number | null {
  if (!deadline) return null;

  const now = new Date();
  const days = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return Math.floor(days);
}

/**
 * Get comprehensive urgency information for UI display
 */
export function getUrgencyInfo(deadline: Date | null | undefined): UrgencyInfo {
  if (!deadline) {
    return {
      multiplier: 1.0,
      tier: 0,
      label: "No deadline",
      color: "gray",
      emoji: "⚪",
      isOverdue: false,
    };
  }

  const days = daysUntilDeadline(deadline);
  const multiplier = calculateUrgencyMultiplier(deadline);
  const tier = getUrgencyTier(deadline);
  const overdue = isOverdue(deadline);

  if (overdue) {
    const daysOverdue = Math.abs(days!);
    return {
      multiplier,
      tier,
      label: daysOverdue === 0 ? "Overdue today" : `${daysOverdue}d overdue`,
      color: "red",
      emoji: "🔴",
      isOverdue: true,
    };
  }

  if (days! < 1) {
    return {
      multiplier,
      tier,
      label: "Due today",
      color: "red",
      emoji: "🔴",
      isOverdue: false,
    };
  }

  if (days === 1) {
    return {
      multiplier,
      tier,
      label: "Due tomorrow",
      color: "orange",
      emoji: "🟠",
      isOverdue: false,
    };
  }

  if (days! < 7) {
    return {
      multiplier,
      tier,
      label: `${days}d remaining`,
      color: "yellow",
      emoji: "🟡",
      isOverdue: false,
    };
  }

  if (days! < 14) {
    return {
      multiplier,
      tier,
      label: `${days}d remaining`,
      color: "green",
      emoji: "🟢",
      isOverdue: false,
    };
  }

  return {
    multiplier,
    tier,
    label: `${days}d remaining`,
    color: "gray",
    emoji: "⚪",
    isOverdue: false,
  };
}

/**
 * Format deadline for display
 */
export function formatDeadline(deadline: Date | null | undefined): string {
  if (!deadline) return "";

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: deadline.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  };

  return deadline.toLocaleDateString("en-US", options);
}

/**
 * Calculate final priority with urgency multiplier
 */
export function calculateFinalPriority(
  iceScore: number,
  deadline: Date | null | undefined
): number {
  const urgencyMultiplier = calculateUrgencyMultiplier(deadline);
  return iceScore * urgencyMultiplier;
}
