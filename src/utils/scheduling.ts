import type { Task, TaskScheduleSuggestion, SchedulingWindow } from './types'

/**
 * Get scheduling window info for display
 */
export function getSchedulingWindowInfo(window: SchedulingWindow) {
  const info = {
    today: {
      label: 'Today',
      icon: '🎯',
      description: 'Work on this today',
      color: 'bg-red-50 border-red-200 text-red-800'
    },
    'this-week': {
      label: 'This Week',
      icon: '📅',
      description: 'Schedule this week',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    'this-month': {
      label: 'This Month',
      icon: '📊',
      description: 'Plan for this month',
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    },
    someday: {
      label: 'Someday',
      icon: '💭',
      description: 'Backlog / Maybe later',
      color: 'bg-gray-50 border-gray-200 text-gray-600'
    }
  }

  return info[window]
}

/**
 * Get recurring pattern info for display
 */
export function getRecurringPatternInfo(pattern: 'daily' | 'weekly' | 'monthly' | null) {
  if (!pattern) return null

  const info = {
    daily: {
      label: 'Daily',
      icon: '🔄',
      description: 'Repeats every day',
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    weekly: {
      label: 'Weekly',
      icon: '📆',
      description: 'Repeats every week',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-800'
    },
    monthly: {
      label: 'Monthly',
      icon: '📅',
      description: 'Repeats every month',
      color: 'bg-violet-50 border-violet-200 text-violet-800'
    }
  }

  return info[pattern]
}

/**
 * Check if a recurring task should be shown today
 */
export function shouldShowRecurringTaskToday(task: Task): boolean {
  if (!task.recurringPattern) return false
  if (task.status !== 'active') return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastCompleted = task.lastCompletedDate ? new Date(task.lastCompletedDate) : null

  if (!lastCompleted) return true // Never completed, show it

  // Check if completed today already
  if (lastCompleted >= today) return false

  return true // Not completed today yet
}

/**
 * Get smart task suggestions based on available capacity and priorities
 */
export function suggestTasksForCapacity(
  tasks: Task[],
  availableMinutes: number,
  preferredTimeBlock?: Task['timeBlock']
): TaskScheduleSuggestion[] {
  const suggestions: TaskScheduleSuggestion[] = []

  // Filter active tasks only
  let candidateTasks = tasks.filter(t => t.status === 'active')

  // If preferred time block, filter by that
  if (preferredTimeBlock) {
    candidateTasks = candidateTasks.filter(t => t.timeBlock === preferredTimeBlock)
  }

  // Sort by ICE score (higher is better)
  candidateTasks.sort((a, b) => {
    const scoreA = (a.impact * a.confidence * a.ease) / 100
    const scoreB = (b.impact * b.confidence * b.ease) / 100
    return scoreB - scoreA
  })

  // Greedily fill capacity with highest priority tasks
  let remainingMinutes = availableMinutes

  for (const task of candidateTasks) {
    if (task.estimatedTime <= remainingMinutes) {
      const iceScore = (task.impact * task.confidence * task.ease) / 100
      const priority = iceScore >= 7.5 ? 'high' : iceScore >= 5 ? 'medium' : 'low'

      let reason = `ICE Score: ${iceScore.toFixed(1)}`

      if (task.decision === 'do') {
        reason += ', Marked as DO'
      }

      if (task.estimatedTime <= 30) {
        reason += ', Quick win (<30min)'
      }

      suggestions.push({
        task,
        reason,
        suggestedTimeBlock: task.timeBlock,
        priority: priority as 'high' | 'medium' | 'low'
      })

      remainingMinutes -= task.estimatedTime
    }

    if (remainingMinutes <= 0) break
  }

  return suggestions
}

/**
 * Group tasks by time block
 */
export function groupTasksByTimeBlock(tasks: Task[]) {
  return {
    deep: tasks.filter(t => t.timeBlock === 'deep'),
    collaborative: tasks.filter(t => t.timeBlock === 'collaborative'),
    quick: tasks.filter(t => t.timeBlock === 'quick'),
    systematic: tasks.filter(t => t.timeBlock === 'systematic')
  }
}

/**
 * Format time in hours and minutes
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/**
 * Calculate completion percentage for tasks
 */
export function calculateCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0

  const completed = tasks.filter(t => t.status === 'completed').length
  return Math.round((completed / tasks.length) * 100)
}

/**
 * Get streak emoji based on count
 */
export function getStreakEmoji(count: number): string {
  if (count >= 30) return '🔥🔥🔥'
  if (count >= 14) return '🔥🔥'
  if (count >= 7) return '🔥'
  if (count >= 3) return '⭐'
  return '✨'
}

/**
 * Get color class based on time block
 */
export function getTimeBlockColor(timeBlock: Task['timeBlock']): string {
  const colors = {
    deep: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    collaborative: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    quick: 'bg-amber-100 text-amber-800 border-amber-300',
    systematic: 'bg-rose-100 text-rose-800 border-rose-300'
  }

  return colors[timeBlock]
}
