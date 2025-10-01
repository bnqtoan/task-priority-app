import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Zap, TrendingUp, CheckCircle, Clock, Play } from 'lucide-react';
import { taskStorage } from '../../lib/storage';
import {
  getSchedulingWindowInfo,
  getRecurringPatternInfo,
  formatMinutes,
  getStreakEmoji,
  groupTasksByTimeBlock,
  getTimeBlockColor
} from '../../utils/scheduling';
import { calculateICE } from '../lib/helpers';
import type { Task, DailyCapacity } from '../../utils/types';

type FocusTab = 'today' | 'week' | 'month' | 'someday';

const FocusView = () => {
  const [activeTab, setActiveTab] = useState<FocusTab>('today');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [capacity, setCapacity] = useState<DailyCapacity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      let fetchedTasks: Task[] = [];

      switch (activeTab) {
        case 'today':
          fetchedTasks = await taskStorage.getTasksForToday();
          const cap = await taskStorage.getDailyCapacity();
          setCapacity(cap);
          break;
        case 'week':
          fetchedTasks = await taskStorage.getTasksForWeek();
          break;
        case 'month':
          fetchedTasks = await taskStorage.getTasksForMonth();
          break;
        case 'someday':
          fetchedTasks = await taskStorage.getTasks({
            status: 'active',
            scheduledFor: 'someday'
          });
          break;
      }

      // Sort by ICE score
      fetchedTasks.sort((a, b) => {
        const scoreA = parseFloat(calculateICE(a));
        const scoreB = parseFloat(calculateICE(b));
        return scoreB - scoreA;
      });

      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (task: Task) => {
    try {
      if (task.recurringPattern) {
        await taskStorage.completeRecurringTask(task.id);
      } else {
        await taskStorage.completeTask(task.id);
      }
      loadData();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const startFocus = async (task: Task) => {
    try {
      await taskStorage.startFocusSession(task.id);
      // Navigate to dashboard with focus mode
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to start focus:', error);
    }
  };

  const groupedTasks = groupTasksByTimeBlock(tasks);
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalTime = tasks.reduce((sum, t) => sum + t.estimatedTime, 0);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Focus View</h1>
        <p className="text-gray-600">
          Smart scheduling and capacity planning for your tasks
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-8 py-4 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'today'
                ? 'border-b-4 border-red-500 text-red-600 bg-red-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap size={20} />
              <span>Today</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`px-8 py-4 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'week'
                ? 'border-b-4 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>This Week</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`px-8 py-4 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'month'
                ? 'border-b-4 border-purple-500 text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={20} />
              <span>This Month</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('someday')}
            className={`px-8 py-4 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'someday'
                ? 'border-b-4 border-gray-500 text-gray-600 bg-gray-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>Someday / Backlog</span>
            </div>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-500 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-500 mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-500 mb-1">Total Time</div>
              <div className="text-2xl font-bold text-blue-600">{formatMinutes(totalTime)}</div>
            </div>
            {capacity && activeTab === 'today' && (
              <div className="bg-white rounded-lg p-3 border">
                <div className="text-xs text-gray-500 mb-1">Remaining</div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatMinutes(capacity.remainingMinutes)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Capacity Warning (Today only) */}
      {capacity && activeTab === 'today' && capacity.remainingMinutes < 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-800">Overcommitted!</p>
              <p className="text-sm text-yellow-700">
                You have {formatMinutes(Math.abs(capacity.remainingMinutes))} more work than time available today.
                Consider moving some tasks to later.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tasks by Time Block */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {activeTab === 'today' && "You're all clear for today!"}
            {activeTab === 'week' && "No tasks scheduled this week"}
            {activeTab === 'month' && "No tasks scheduled this month"}
            {activeTab === 'someday' && "Your backlog is empty"}
          </h3>
          <p className="text-gray-600">
            {activeTab !== 'someday'
              ? "Great job! Check your backlog or add new tasks."
              : "Add some tasks to your backlog to work on later."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Deep Work Tasks */}
          {groupedTasks.deep.length > 0 && (
            <TaskSection
              title="🧠 Deep Work"
              tasks={groupedTasks.deep}
              timeBlock="deep"
              onComplete={completeTask}
              onStartFocus={startFocus}
            />
          )}

          {/* Collaborative Tasks */}
          {groupedTasks.collaborative.length > 0 && (
            <TaskSection
              title="👥 Collaborative"
              tasks={groupedTasks.collaborative}
              timeBlock="collaborative"
              onComplete={completeTask}
              onStartFocus={startFocus}
            />
          )}

          {/* Quick Wins */}
          {groupedTasks.quick.length > 0 && (
            <TaskSection
              title="⚡ Quick Wins"
              tasks={groupedTasks.quick}
              timeBlock="quick"
              onComplete={completeTask}
              onStartFocus={startFocus}
            />
          )}

          {/* Systematic Tasks */}
          {groupedTasks.systematic.length > 0 && (
            <TaskSection
              title="🔧 Systematic"
              tasks={groupedTasks.systematic}
              timeBlock="systematic"
              onComplete={completeTask}
              onStartFocus={startFocus}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Task Section Component
function TaskSection({
  title,
  tasks,
  timeBlock,
  onComplete,
  onStartFocus
}: {
  title: string;
  tasks: Task[];
  timeBlock: Task['timeBlock'];
  onComplete: (task: Task) => void;
  onStartFocus: (task: Task) => void;
}) {
  const totalTime = tasks.reduce((sum, t) => sum + t.estimatedTime, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className={`${getTimeBlockColor(timeBlock)} px-6 py-4 border-b flex items-center justify-between`}>
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm opacity-80">
            {tasks.length} tasks • {formatMinutes(totalTime)} total
          </p>
        </div>
      </div>

      <div className="divide-y">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onStartFocus={onStartFocus}
          />
        ))}
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({
  task,
  onComplete,
  onStartFocus
}: {
  task: Task;
  onComplete: (task: Task) => void;
  onStartFocus: (task: Task) => void;
}) {
  const iceScore = calculateICE(task);
  const recurringInfo = getRecurringPatternInfo(task.recurringPattern || null);
  const schedulingInfo = task.scheduledFor ? getSchedulingWindowInfo(task.scheduledFor) : null;

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-800">{task.name}</h4>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              ICE: {iceScore}
            </span>
            {recurringInfo && (
              <span className={`px-2 py-1 text-xs font-medium rounded border ${recurringInfo.color}`}>
                {recurringInfo.icon} {recurringInfo.label}
                {task.streakCount && task.streakCount > 0 && (
                  <span className="ml-1">{getStreakEmoji(task.streakCount)} {task.streakCount}</span>
                )}
              </span>
            )}
            {schedulingInfo && (
              <span className={`px-2 py-1 text-xs font-medium rounded border ${schedulingInfo.color}`}>
                {schedulingInfo.icon} {schedulingInfo.label}
              </span>
            )}
          </div>

          {task.notes && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.notes}</p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>⏱️ {task.estimatedTime} min</span>
            <span>📊 I:{task.impact} C:{task.confidence} E:{task.ease}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.status === 'active' && (
            <>
              <button
                onClick={() => onStartFocus(task)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Start focus session"
              >
                <Play size={20} />
              </button>
              <button
                onClick={() => onComplete(task)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Mark as complete"
              >
                <CheckCircle size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FocusView;
