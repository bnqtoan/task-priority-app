import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Search, CheckCircle, Clock, Archive, X } from 'lucide-react';
import { api } from '../lib/api';
import { calculateICE, getTypeInfo, getDecisionInfo, getTimeBlockInfo } from '../lib/helpers';
import { getDecisionRecommendation } from '../../utils/algorithms';
import type { Task, CreateTaskInput, User, OverviewStats } from '../../utils/types';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTask, setNewTask] = useState<CreateTaskInput>({
    name: '',
    impact: 5,
    confidence: 5,
    ease: 5,
    type: 'operations',
    timeBlock: 'quick',
    estimatedTime: 30,
    decision: 'do',
    notes: ''
  });

  const [activeTab, setActiveTab] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('hybrid');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userRes, tasksRes, statsRes] = await Promise.all([
        api.getMe(),
        api.getTasks({ status: statusFilter }),
        api.getOverview()
      ]);

      setUser(userRes);
      setTasks(tasksRes);
      setStats(statsRes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Reload data when status filter changes
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [statusFilter]);

  const addTask = async () => {
    if (!newTask.name.trim()) return;

    try {
      const createdTask = await api.createTask(newTask);
      setTasks([...tasks, createdTask]);
      setNewTask({
        name: '',
        impact: 5,
        confidence: 5,
        ease: 5,
        type: 'operations',
        timeBlock: 'quick',
        estimatedTime: 30,
        decision: 'do',
        notes: ''
      });

      // Refresh stats
      const updatedStats = await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));

      // Refresh stats
      const updatedStats = await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const updateTask = async (id: number, field: string, value: any) => {
    try {
      const updatedTask = await api.updateTask(id, { [field]: value });
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));

      // Refresh stats if the change affects stats
      if (['decision', 'timeBlock', 'type', 'estimatedTime'].includes(field)) {
        const updatedStats = await api.getOverview();
        setStats(updatedStats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  // Search and filter tasks
  const searchAndFilterTasks = (tasksList: Task[]) => {
    let filtered = tasksList;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(query) ||
        (task.notes && task.notes.toLowerCase().includes(query)) ||
        task.type.toLowerCase().includes(query) ||
        task.decision.toLowerCase().includes(query)
      );
    }

    // Apply time block filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.timeBlock === activeTab);
    }

    return filtered;
  };

  const sortedTasks = [...tasks].sort((a, b) => parseFloat(calculateICE(b)) - parseFloat(calculateICE(a)));
  const filteredTasks = searchAndFilterTasks(sortedTasks);

  const getDecisionStats = (decision: string) => {
    if (!stats) return { count: 0, time: 0 };
    return stats.decisions[decision as keyof typeof stats.decisions] || { count: 0, time: 0 };
  };

  const getTimeBlockStats = (block: string) => {
    if (!stats) return { count: 0, time: 0 };
    return stats.timeBlocks[block as keyof typeof stats.timeBlocks] || { count: 0, time: 0 };
  };

  const toggleRowExpansion = (taskId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedRows(newExpanded);
  };

  const completeTask = async (id: number) => {
    try {
      await api.completeTask(id);
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed', completedAt: new Date() } : t));

      // Refresh stats
      const updatedStats = await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete task');
    }
  };

  const archiveTask = async (id: number) => {
    try {
      await api.updateTask(id, { status: 'archived' });
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'archived' } : t));

      // Refresh stats
      const updatedStats = await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive task');
    }
  };

  const reactivateTask = async (id: number) => {
    try {
      await api.updateTask(id, { status: 'active' });
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'active', completedAt: undefined } : t));

      // Refresh stats
      const updatedStats = await api.getOverview();
      setStats(updatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate task');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Priority Framework</h1>
        <p className="text-gray-600 mb-4">ICE Score + Time Blocking + 4D Decision Framework</p>
        {user && (
          <p className="text-sm text-gray-500 mb-4">Welcome, {user.name || user.email}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="font-semibold text-gray-700">Impact:</span>
            <p className="text-gray-600 text-xs mt-1">Tác động đến mục tiêu (1-10)</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="font-semibold text-gray-700">Confidence:</span>
            <p className="text-gray-600 text-xs mt-1">Độ chắc chắn hoàn thành (1-10)</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="font-semibold text-gray-700">Ease:</span>
            <p className="text-gray-600 text-xs mt-1">Độ dễ thực hiện (1-10)</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="font-semibold text-gray-700">ICE Score:</span>
            <p className="text-gray-600 text-xs mt-1">Điểm ưu tiên = Trung bình 3 yếu tố</p>
          </div>
        </div>
      </div>

      {/* Decision Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['do', 'delegate', 'delay', 'delete'].map(decision => {
          const info = getDecisionInfo(decision);
          const statsData = getDecisionStats(decision);
          return (
            <div key={decision} className={`${info.color} border-2 rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{info.icon}</span>
                  <span className="font-bold">{info.label}</span>
                </div>
                <span className="text-sm font-semibold">{statsData.count} tasks</span>
              </div>
              <p className="text-xs mb-2">{info.description}</p>
              <p className="text-xs mt-1 font-semibold">⏱️ {statsData.time} phút</p>
            </div>
          );
        })}
      </div>

      {/* Time Block Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['deep', 'collaborative', 'quick', 'systematic'].map(block => {
          const info = getTimeBlockInfo(block);
          const statsData = getTimeBlockStats(block);
          const Icon = info.icon;
          return (
            <div key={block} className={`${info.color} border-2 rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Icon size={20} className="mr-2" />
                  <span className="font-bold">{info.label}</span>
                </div>
                <span className="text-sm font-semibold">{statsData.count} tasks</span>
              </div>
              <p className="text-xs mb-2">{info.description}</p>
              <p className="text-xs font-medium">{info.bestTime}</p>
              <p className="text-xs mt-1 font-semibold">⏱️ {statsData.time} phút</p>
            </div>
          );
        })}
      </div>

      {/* Add Task Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">➕ Thêm Task Mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
          <input
            type="text"
            placeholder="Tên công việc..."
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />

          <div>
            <label className="block text-xs text-gray-600 mb-1">Impact</label>
            <input
              type="number"
              min="1"
              max="10"
              value={newTask.impact}
              onChange={(e) => setNewTask({ ...newTask, impact: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Confidence</label>
            <input
              type="number"
              min="1"
              max="10"
              value={newTask.confidence}
              onChange={(e) => setNewTask({ ...newTask, confidence: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Ease</label>
            <input
              type="number"
              min="1"
              max="10"
              value={newTask.ease}
              onChange={(e) => setNewTask({ ...newTask, ease: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Type</label>
            <select
              value={newTask.type}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="revenue">💰 Revenue</option>
              <option value="growth">📈 Growth</option>
              <option value="operations">🔧 Operations</option>
              <option value="strategic">🎯 Strategic</option>
              <option value="personal">✨ Personal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Time Block</label>
            <select
              value={newTask.timeBlock}
              onChange={(e) => setNewTask({ ...newTask, timeBlock: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="deep">🧠 Deep Work</option>
              <option value="collaborative">👥 Collaborative</option>
              <option value="quick">⚡ Quick Wins</option>
              <option value="systematic">🔧 Systematic</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Estimated Time (phút)</label>
            <input
              type="number"
              min="5"
              value={newTask.estimatedTime}
              onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) || 5 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Decision (4D Framework)</label>
            <select
              value={newTask.decision}
              onChange={(e) => setNewTask({ ...newTask, decision: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="do">✅ DO - Làm ngay</option>
              <option value="delegate">👤 DELEGATE - Giao việc</option>
              <option value="delay">⏸️ DELAY - Hoãn lại</option>
              <option value="delete">🗑️ DELETE - Loại bỏ</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-600 mb-1">Description / Notes</label>
          <textarea
            placeholder="Add detailed description, requirements, or notes about this task..."
            value={newTask.notes || ''}
            onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          />
        </div>

        <button
          onClick={addTask}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition"
        >
          <Plus className="mr-2" size={20} />
          Thêm Task
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks, descriptions, types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">📋 Active Tasks</option>
              <option value="completed">✅ Completed Tasks</option>
              <option value="archived">📦 Archived Tasks</option>
            </select>
          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-gray-600 font-medium">
              {filteredTasks.length} of {tasks.length} tasks
            </span>
          </div>
        </div>
      </div>

      {/* AI Method Selector */}
      <div className="bg-white rounded-t-lg shadow-lg">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            🤖 AI Recommendation Method (chọn để xem sự thay đổi ngay bên dưới):
          </label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg font-semibold text-base focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
          >
            <option value="simple">1️⃣ Simple ICE (Original)</option>
            <option value="weighted">2️⃣ Weighted Score (Impact 50%)</option>
            <option value="roi">3️⃣ ROI-Based (Time Efficiency)</option>
            <option value="eisenhower">4️⃣ Eisenhower Enhanced (Urgency)</option>
            <option value="skill">5️⃣ Skill Match (Talent Fit)</option>
            <option value="energy">6️⃣ Energy-Aware (Sustainable)</option>
            <option value="strategic">7️⃣ Strategic Alignment (Type-Based)</option>
            <option value="hybrid">8️⃣ Hybrid Smart (Recommended) ⭐</option>
          </select>
          <p className="text-xs text-gray-700 mt-2 font-medium">
            {selectedMethod === 'simple' && '📝 Basic method using ICE score and impact level'}
            {selectedMethod === 'weighted' && '⚖️ Impact (50%) > Confidence (30%) > Ease (20%)'}
            {selectedMethod === 'roi' && '📊 Considers ROI = Impact / Effort and time efficiency'}
            {selectedMethod === 'eisenhower' && '📋 Classic Important/Urgent matrix with time blocks'}
            {selectedMethod === 'skill' && '🎯 Matches your skills (ease) with value potential'}
            {selectedMethod === 'energy' && '⚡ Optimizes for energy efficiency and burnout prevention'}
            {selectedMethod === 'strategic' && '🎲 Prioritizes based on task type (Revenue > Strategic > Growth)'}
            {selectedMethod === 'hybrid' && '🔮 Combines ROI (40%), Value (30%), Strategy (30%) - Most comprehensive'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            📋 All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('deep')}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'deep' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-600'}`}
          >
            🧠 Deep Work ({getTimeBlockStats('deep').count})
          </button>
          <button
            onClick={() => setActiveTab('collaborative')}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'collaborative' ? 'border-b-2 border-cyan-500 text-cyan-600' : 'text-gray-600'}`}
          >
            👥 Collaborative ({getTimeBlockStats('collaborative').count})
          </button>
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'quick' ? 'border-b-2 border-amber-500 text-amber-600' : 'text-gray-600'}`}
          >
            ⚡ Quick Wins ({getTimeBlockStats('quick').count})
          </button>
          <button
            onClick={() => setActiveTab('systematic')}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'systematic' ? 'border-b-2 border-rose-500 text-rose-600' : 'text-gray-600'}`}
          >
            🔧 Systematic ({getTimeBlockStats('systematic').count})
          </button>
        </div>
      </div>

      {/* Tasks Table - Compact with Expandable Rows */}
      <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-3 text-left text-sm font-semibold text-gray-700 w-8"></th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Task</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700">ICE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Decision</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">AI Suggest</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => {
                const iceScore = calculateICE(task);
                const typeInfo = getTypeInfo(task.type);
                const timeBlockInfo = getTimeBlockInfo(task.timeBlock);
                const decisionInfo = getDecisionInfo(task.decision);
                const recommendation = getDecisionRecommendation(task, selectedMethod);
                const priorityColor = parseFloat(iceScore) >= 8 ? 'bg-green-500' : parseFloat(iceScore) >= 6 ? 'bg-yellow-500' : 'bg-gray-400';
                const isExpanded = expandedRows.has(task.id);

                return (
                  <>
                    {/* Main Row */}
                    <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-2 py-3">
                        <button
                          onClick={() => toggleRowExpansion(task.id)}
                          className="text-gray-400 hover:text-gray-600 transition"
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`${priorityColor} text-white font-bold px-3 py-1 rounded-full text-sm whitespace-nowrap`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-md">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={task.name}
                              onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                              className={`flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium ${
                                task.status === 'completed' ? 'line-through text-gray-500' : ''
                              }`}
                            />
                            {/* Status Badge */}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : task.status === 'archived'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {task.status === 'completed' && '✅'}
                              {task.status === 'archived' && '📦'}
                              {task.status === 'active' && '📋'}
                            </span>
                          </div>
                          {task.notes && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.notes}</p>
                          )}
                          {task.completedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              Completed: {new Date(task.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-gray-800">{iceScore}</span>
                          <div className="flex gap-1 text-xs text-gray-500">
                            <span>{task.impact}</span>
                            <span>{task.confidence}</span>
                            <span>{task.ease}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={task.decision}
                          onChange={(e) => updateTask(task.id, 'decision', e.target.value)}
                          className={`${decisionInfo.color} border px-3 py-2 rounded-lg text-sm font-medium w-full`}
                        >
                          <option value="do">✅ DO</option>
                          <option value="delegate">👤 DELEGATE</option>
                          <option value="delay">⏸️ DELAY</option>
                          <option value="delete">🗑️ DELETE</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm max-w-xs">
                          <div className="font-semibold text-gray-700 mb-1">
                            {getDecisionInfo(recommendation.decision).icon} {recommendation.decision.toUpperCase()}
                          </div>
                          <div className="text-gray-600 text-xs line-clamp-2">{recommendation.reason}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Status Action Buttons */}
                          {task.status === 'active' && (
                            <>
                              <button
                                onClick={() => completeTask(task.id)}
                                className="text-green-600 hover:text-green-700 transition p-2 rounded-lg hover:bg-green-50"
                                title="Mark as completed"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => archiveTask(task.id)}
                                className="text-gray-600 hover:text-gray-700 transition p-2 rounded-lg hover:bg-gray-50"
                                title="Archive task"
                              >
                                <Archive size={18} />
                              </button>
                            </>
                          )}

                          {(task.status === 'completed' || task.status === 'archived') && (
                            <button
                              onClick={() => reactivateTask(task.id)}
                              className="text-blue-600 hover:text-blue-700 transition p-2 rounded-lg hover:bg-blue-50"
                              title="Reactivate task"
                            >
                              <Clock size={18} />
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 transition p-2 rounded-lg hover:bg-red-50"
                            title="Delete task permanently"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr className="bg-gray-50 border-t border-gray-100">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Status Management */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800 mb-3">📊 Status Management</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">Current Status</label>
                                  <div className={`p-3 rounded-lg border-2 ${
                                    task.status === 'completed'
                                      ? 'bg-green-50 border-green-200'
                                      : task.status === 'archived'
                                      ? 'bg-gray-50 border-gray-200'
                                      : 'bg-blue-50 border-blue-200'
                                  }`}>
                                    <span className="font-medium">
                                      {task.status === 'completed' && '✅ Completed'}
                                      {task.status === 'archived' && '📦 Archived'}
                                      {task.status === 'active' && '📋 Active'}
                                    </span>
                                    {task.completedAt && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        {new Date(task.completedAt).toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  {task.status === 'active' && (
                                    <>
                                      <button
                                        onClick={() => completeTask(task.id)}
                                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                      >
                                        <CheckCircle size={16} />
                                        Mark Complete
                                      </button>
                                      <button
                                        onClick={() => archiveTask(task.id)}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                                      >
                                        <Archive size={16} />
                                        Archive
                                      </button>
                                    </>
                                  )}
                                  {(task.status === 'completed' || task.status === 'archived') && (
                                    <button
                                      onClick={() => reactivateTask(task.id)}
                                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                    >
                                      <Clock size={16} />
                                      Reactivate
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* ICE Scoring */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800 mb-3">🎯 ICE Scoring</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Impact (1-10)</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={task.impact}
                                    onChange={(e) => updateTask(task.id, 'impact', parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Confidence (1-10)</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={task.confidence}
                                    onChange={(e) => updateTask(task.id, 'confidence', parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Ease (1-10)</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={task.ease}
                                    onChange={(e) => updateTask(task.id, 'ease', parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Categorization */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800 mb-3">📊 Categorization</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                                  <select
                                    value={task.type}
                                    onChange={(e) => updateTask(task.id, 'type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="revenue">💰 Revenue</option>
                                    <option value="growth">📈 Growth</option>
                                    <option value="operations">🔧 Operations</option>
                                    <option value="strategic">🎯 Strategic</option>
                                    <option value="personal">✨ Personal</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Time Block</label>
                                  <select
                                    value={task.timeBlock}
                                    onChange={(e) => updateTask(task.id, 'timeBlock', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="deep">🧠 Deep Work</option>
                                    <option value="collaborative">👥 Collaborative</option>
                                    <option value="quick">⚡ Quick Wins</option>
                                    <option value="systematic">🔧 Systematic</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Estimated Time (minutes)</label>
                                  <input
                                    type="number"
                                    min="5"
                                    value={task.estimatedTime}
                                    onChange={(e) => updateTask(task.id, 'estimatedTime', parseInt(e.target.value) || 5)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-800 mb-3">📝 Description</h4>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                                <textarea
                                  value={task.notes || ''}
                                  onChange={(e) => updateTask(task.id, 'notes', e.target.value)}
                                  placeholder="Add detailed description, requirements, or notes..."
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                />
                              </div>
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-xs text-blue-700 font-medium mb-1">AI Recommendation:</p>
                                <p className="text-sm text-blue-800">{recommendation.reason}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Framework Guide */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">💡 4D Decision Framework:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-semibold text-green-700">✅ DO - Làm ngay</p>
            <p className="text-sm text-gray-600">High ICE (≥7.5) + High Impact (≥7). Tasks này quan trọng và bạn có khả năng làm tốt.</p>
            <p className="text-xs text-gray-500 mt-1">Ví dụ: Core product development, strategic planning</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold text-blue-700">👤 DELEGATE - Giao việc</p>
            <p className="text-sm text-gray-600">High Impact nhưng Low Ease (khó với bạn) HOẶC Low Impact nhưng Easy (ai cũng làm được).</p>
            <p className="text-xs text-gray-500 mt-1">Ví dụ: Admin tasks, graphic design, data entry</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="font-semibold text-yellow-700">⏸️ DELAY - Hoãn lại</p>
            <p className="text-sm text-gray-600">Medium Impact + Low Confidence. Cần thêm thông tin hoặc chưa đến lúc phù hợp.</p>
            <p className="text-xs text-gray-500 mt-1">Ví dụ: Projects cần thêm research, tasks phụ thuộc vào điều kiện khác</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <p className="font-semibold text-red-700">🗑️ DELETE - Loại bỏ</p>
            <p className="text-sm text-gray-600">Low Impact (≤4). Không đáng để dành thời gian, energy và attention.</p>
            <p className="text-xs text-gray-500 mt-1">Ví dụ: Nice-to-have features, vanity metrics, busy work</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-3 mt-6">🎯 Hướng Dẫn Sử Dụng Time Blocking:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-indigo-500 pl-4">
            <p className="font-semibold text-indigo-700">🧠 Deep Work Tasks</p>
            <p className="text-sm text-gray-600">Schedule vào buổi sáng hoặc khung giờ bạn tập trung tốt nhất. Tắt thông báo, không multitask.</p>
          </div>
          <div className="border-l-4 border-cyan-500 pl-4">
            <p className="font-semibold text-cyan-700">👥 Collaborative Tasks</p>
            <p className="text-sm text-gray-600">Làm trong giờ hành chính khi team online. Chuẩn bị trước để meeting hiệu quả.</p>
          </div>
          <div className="border-l-4 border-amber-500 pl-4">
            <p className="font-semibold text-amber-700">⚡ Quick Wins</p>
            <p className="text-sm text-gray-600">Làm khi chờ đợi, giữa các task lớn, hoặc khi năng lượng thấp. Momentum tốt cho ngày mới.</p>
          </div>
          <div className="border-l-4 border-rose-500 pl-4">
            <p className="font-semibold text-rose-700">🔧 Systematic Tasks</p>
            <p className="text-sm text-gray-600">Đầu tư thời gian setup một lần, sau đó chạy tự động. Ưu tiên cao nếu tiết kiệm được nhiều thời gian.</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 mb-2">
            <strong>💡 Pro Tip:</strong> Cột "AI Suggest" thay đổi theo method bạn chọn phía trên.
          </p>
          <p className="text-xs text-blue-700">
            <strong>Khuyến nghị:</strong> Thử các methods khác nhau để tìm cách tính phù hợp nhất với phong cách làm việc của bạn.
            <strong>Hybrid Smart</strong> là balanced nhất, <strong>ROI-Based</strong> tốt cho efficiency,
            <strong>Energy-Aware</strong> tốt cho sustainable productivity, <strong>Strategic</strong> tốt cho business owners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;