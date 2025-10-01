import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Clock, Target, Award, ChevronDown, Home } from 'lucide-react';
import type { Task, DateRange, TimeRangePreset, ReportData } from '../../utils/types';
import { taskStorage } from '../../lib/storage';
import {
  getDateRangeForPreset,
  generateReportData,
  formatDuration,
  formatPercentage
} from '../../utils/analytics';

const COLORS = {
  revenue: '#10b981',
  growth: '#3b82f6',
  operations: '#f59e0b',
  strategic: '#8b5cf6',
  personal: '#ec4899',
  deep: '#6366f1',
  collaborative: '#14b8a6',
  quick: '#f97316',
  systematic: '#84cc16',
  do: '#22c55e',
  delegate: '#3b82f6',
  delay: '#eab308',
  delete: '#ef4444'
};

export function Reports() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<TimeRangePreset>('week');
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeForPreset('week'));
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const allTasks = await taskStorage.getTasks();
        setTasks(allTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    if (selectedPreset !== 'custom') {
      const range = getDateRangeForPreset(selectedPreset);
      setDateRange(range);
    }
  }, [selectedPreset]);

  useEffect(() => {
    const data = generateReportData(tasks, dateRange);
    setReportData(data);
  }, [tasks, dateRange]);

  const handlePresetChange = (preset: TimeRangePreset) => {
    setSelectedPreset(preset);
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);
      setDateRange({ start, end, preset: 'custom' });
    }
  };

  if (loading || !reportData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  const { timeStats, byType, byTimeBlock, byDecision, dailyData, hourlyData, topTasks, productivityMetrics } = reportData;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={32} />
              Reports & Analytics
            </h1>
            <p className="text-gray-600">Insights about your work patterns and productivity</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home size={18} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={20} className="text-gray-600" />
          <span className="font-medium text-gray-900">Time Period</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(['today', 'week', 'month', 'last7', 'last30', 'last90', 'all'] as TimeRangePreset[]).map(preset => (
            <button
              key={preset}
              onClick={() => handlePresetChange(preset)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedPreset === preset
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {preset === 'today' && 'Today'}
              {preset === 'week' && 'This Week'}
              {preset === 'month' && 'This Month'}
              {preset === 'last7' && 'Last 7 Days'}
              {preset === 'last30' && 'Last 30 Days'}
              {preset === 'last90' && 'Last 90 Days'}
              {preset === 'all' && 'All Time'}
            </button>
          ))}
          <button
            onClick={() => handlePresetChange('custom')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedPreset === 'custom'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Custom Range
          </button>
        </div>

        {selectedPreset === 'custom' && (
          <div className="flex items-center gap-3 pt-3 border-t">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
            <button
              onClick={handleCustomDateApply}
              disabled={!customStartDate || !customEndDate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium"
            >
              Apply
            </button>
          </div>
        )}

        <div className="text-sm text-gray-500 mt-3">
          {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Time</span>
            <Clock className="text-blue-600" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatDuration(timeStats.totalMinutes)}</div>
          <div className="text-xs text-gray-500 mt-1">{timeStats.totalTasks} tasks</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Completed</span>
            <Target className="text-green-600" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{timeStats.completedTasks}</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatPercentage(productivityMetrics.completionRate * 100)} completion rate
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Focus Sessions</span>
            <Award className="text-purple-600" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{timeStats.focusSessions}</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatPercentage(productivityMetrics.focusTimeRatio * 100)} focus time
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Productivity Score</span>
            <TrendingUp className="text-indigo-600" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{productivityMetrics.score}</div>
          <div className="text-xs text-gray-500 mt-1">out of 100</div>
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200 p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Award className="text-blue-600" size={20} />
          Productivity Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Focus Time Ratio</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${productivityMetrics.focusTimeRatio * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{formatPercentage(productivityMetrics.focusTimeRatio * 100)}</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Estimate Accuracy</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${productivityMetrics.estimateAccuracy * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{formatPercentage(productivityMetrics.estimateAccuracy * 100)}</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Deep Work Ratio</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${productivityMetrics.deepWorkRatio * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{formatPercentage(productivityMetrics.deepWorkRatio * 100)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {productivityMetrics.suggestions.map((suggestion, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
              <ChevronDown className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row 1: Daily Timeline & Time by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Daily Timeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalMinutes" stroke="#3b82f6" name="Minutes" strokeWidth={2} />
              <Line type="monotone" dataKey="completedTasks" stroke="#10b981" name="Tasks" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Time by Type */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Time by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={byType as any}
                dataKey="minutes"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry: any) => `${entry.category} (${formatDuration(entry.minutes)})`}
              >
                {byType.map((entry) => (
                  <Cell key={entry.category} fill={COLORS[entry.category as keyof typeof COLORS] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Time Block & Decision Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Time by Time Block */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Time by Time Block</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byTimeBlock}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="minutes" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time by Decision */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Time by Decision</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byDecision}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="minutes">
                {byDecision.map((entry) => (
                  <Cell key={entry.category} fill={COLORS[entry.category as keyof typeof COLORS] || '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3: Hourly Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Time of Day Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="minutes" fill="#14b8a6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Tasks Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Top Tasks by Time Spent</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Task</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Type</th>
                <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Time</th>
                <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">% of Total</th>
                <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">ICE Score</th>
              </tr>
            </thead>
            <tbody>
              {topTasks.map((task, idx) => (
                <tr key={task.id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2 px-3 text-sm text-gray-900">{task.name}</td>
                  <td className="py-2 px-3 text-sm">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: COLORS[task.type as keyof typeof COLORS] }}
                    >
                      {task.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-sm text-right font-medium text-gray-900">
                    {formatDuration(task.minutes)}
                  </td>
                  <td className="py-2 px-3 text-sm text-right text-gray-600">
                    {formatPercentage(task.percentage)}
                  </td>
                  <td className="py-2 px-3 text-sm text-right font-medium text-gray-900">
                    {task.iceScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {topTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No completed tasks in this time period
          </div>
        )}
      </div>
    </div>
  );
}
