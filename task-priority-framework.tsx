import React, { useState } from "react";
import { Plus, Trash2, Clock, Brain, Users, Zap } from "lucide-react";

const TaskPriorityFramework = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Test openline",
      impact: 7,
      confidence: 8,
      ease: 6,
      type: "operations",
      timeBlock: "collaborative",
      estimatedTime: 30,
      decision: "do",
      notes: "",
    },
    {
      id: 2,
      name: "Give feedback openline",
      impact: 6,
      confidence: 9,
      ease: 8,
      type: "operations",
      timeBlock: "collaborative",
      estimatedTime: 20,
      decision: "do",
      notes: "",
    },
    {
      id: 3,
      name: "Wix app, WordPress plugin",
      impact: 9,
      confidence: 7,
      ease: 4,
      type: "revenue",
      timeBlock: "deep",
      estimatedTime: 120,
      decision: "do",
      notes: "",
    },
    {
      id: 4,
      name: "Python practice, Python flashcards",
      impact: 7,
      confidence: 8,
      ease: 7,
      type: "growth",
      timeBlock: "deep",
      estimatedTime: 60,
      decision: "do",
      notes: "",
    },
    {
      id: 5,
      name: "New webinar",
      impact: 8,
      confidence: 6,
      ease: 5,
      type: "revenue",
      timeBlock: "deep",
      estimatedTime: 90,
      decision: "do",
      notes: "",
    },
    {
      id: 6,
      name: "Profile - Canva",
      impact: 5,
      confidence: 9,
      ease: 9,
      type: "operations",
      timeBlock: "quick",
      estimatedTime: 15,
      decision: "delegate",
      notes: "",
    },
    {
      id: 7,
      name: "Case study for Mr. C, contribute content",
      impact: 8,
      confidence: 7,
      ease: 6,
      type: "strategic",
      timeBlock: "collaborative",
      estimatedTime: 45,
      decision: "do",
      notes: "",
    },
    {
      id: 8,
      name: "Set up email subscription flow",
      impact: 9,
      confidence: 8,
      ease: 5,
      type: "revenue",
      timeBlock: "systematic",
      estimatedTime: 60,
      decision: "do",
      notes: "",
    },
    {
      id: 9,
      name: "Buy lottery ticket",
      impact: 2,
      confidence: 10,
      ease: 10,
      type: "personal",
      timeBlock: "quick",
      estimatedTime: 5,
      decision: "delete",
      notes: "",
    },
  ]);

  const [newTask, setNewTask] = useState({
    name: "",
    impact: 5,
    confidence: 5,
    ease: 5,
    type: "operations",
    timeBlock: "quick",
    estimatedTime: 30,
    decision: "do",
    notes: "",
  });

  const [activeTab, setActiveTab] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("hybrid");

  const calculateICE = (task) => {
    return ((task.impact + task.confidence + task.ease) / 3).toFixed(1);
  };

  const getTypeInfo = (type) => {
    const types = {
      revenue: {
        emoji: "💰",
        label: "Revenue/Business",
        color: "bg-green-100 text-green-800",
      },
      growth: {
        emoji: "📈",
        label: "Growth/Learning",
        color: "bg-blue-100 text-blue-800",
      },
      operations: {
        emoji: "🔧",
        label: "Operations",
        color: "bg-gray-100 text-gray-800",
      },
      strategic: {
        emoji: "🎯",
        label: "Strategic",
        color: "bg-purple-100 text-purple-800",
      },
      personal: {
        emoji: "✨",
        label: "Personal",
        color: "bg-pink-100 text-pink-800",
      },
    };
    return types[type] || types.operations;
  };

  const getDecisionInfo = (decision) => {
    const decisions = {
      do: {
        icon: "✅",
        label: "DO",
        color: "bg-green-100 text-green-800 border-green-300",
        description: "Làm ngay - High value, phù hợp với kỹ năng",
      },
      delegate: {
        icon: "👤",
        label: "DELEGATE",
        color: "bg-blue-100 text-blue-800 border-blue-300",
        description:
          "Giao cho người khác - Low skill requirement hoặc người khác làm tốt hơn",
      },
      delay: {
        icon: "⏸️",
        label: "DELAY",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        description: "Hoãn lại - Quan trọng nhưng chưa cấp thiết",
      },
      delete: {
        icon: "🗑️",
        label: "DELETE",
        color: "bg-red-100 text-red-800 border-red-300",
        description: "Loại bỏ - Low impact, không cần thiết",
      },
    };
    return decisions[decision] || decisions.do;
  };

  const getDecisionRecommendation = (task) => {
    const iceScore = parseFloat(calculateICE(task));
    const impact = task.impact;
    const ease = task.ease;
    const confidence = task.confidence;
    const estimatedTime = task.estimatedTime || 30;

    // Method 1: Simple ICE (Original)
    if (selectedMethod === "simple") {
      if (iceScore >= 7.5 && impact >= 7) {
        return { decision: "do", reason: "High value & achievable" };
      }
      if (impact >= 7 && ease <= 5) {
        return { decision: "delegate", reason: "Important but difficult" };
      }
      if (impact <= 5 && ease >= 8) {
        return {
          decision: "delegate",
          reason: "Easy task - delegate to free up time",
        };
      }
      if (impact >= 6 && impact < 8 && confidence <= 6) {
        return { decision: "delay", reason: "Need more clarity" };
      }
      if (impact <= 4) {
        return { decision: "delete", reason: "Low impact" };
      }
      return { decision: "do", reason: "Balanced task" };
    }

    // Method 2: Weighted Score
    if (selectedMethod === "weighted") {
      const score = impact * 0.5 + confidence * 0.3 + ease * 0.2;
      if (score >= 8 && impact >= 7) {
        return {
          decision: "do",
          reason: `High weighted score (${score.toFixed(1)})`,
        };
      }
      if (score >= 7 && ease <= 4) {
        return { decision: "delegate", reason: "Good score but too difficult" };
      }
      if (score >= 5 && score < 7 && confidence <= 5) {
        return { decision: "delay", reason: "Medium score, low confidence" };
      }
      if (score < 5) {
        return {
          decision: "delete",
          reason: `Low score (${score.toFixed(1)})`,
        };
      }
      return { decision: "do", reason: `Good score (${score.toFixed(1)})` };
    }

    // Method 3: ROI-Based
    if (selectedMethod === "roi") {
      const effort = 11 - ease;
      const roi = impact / effort;
      const timeEfficiency = impact / (estimatedTime / 60);

      if (roi >= 1.5 && timeEfficiency >= 5) {
        return {
          decision: "do",
          reason: `High ROI (${roi.toFixed(2)}) & time efficient`,
        };
      }
      if (roi >= 1.5 && ease <= 4) {
        return {
          decision: "delegate",
          reason: `High ROI (${roi.toFixed(2)}) but difficult`,
        };
      }
      if (roi < 1.0 && ease >= 7) {
        return {
          decision: "delegate",
          reason: `Low ROI (${roi.toFixed(2)}), waste of time`,
        };
      }
      if (roi < 0.8) {
        return {
          decision: "delete",
          reason: `Very low ROI (${roi.toFixed(2)})`,
        };
      }
      return { decision: "delay", reason: `Medium ROI (${roi.toFixed(2)})` };
    }

    // Method 4: Eisenhower Enhanced
    if (selectedMethod === "eisenhower") {
      const timeBlockFactor = {
        quick: 3,
        collaborative: 2,
        deep: 0,
        systematic: -1,
      };
      const urgency = 10 - confidence + (timeBlockFactor[task.timeBlock] || 0);
      const importance = impact;

      if (importance >= 7 && urgency >= 7) {
        return { decision: "do", reason: "Important & Urgent (Do Now)" };
      }
      if (importance >= 7 && urgency < 7 && ease >= 6) {
        return { decision: "do", reason: "Important, Not Urgent (Schedule)" };
      }
      if (importance >= 7 && urgency < 7 && ease < 6) {
        return { decision: "delegate", reason: "Important but need help" };
      }
      if (importance < 7 && urgency >= 7) {
        return { decision: "delegate", reason: "Not Important but Urgent" };
      }
      return { decision: "delete", reason: "Not Important, Not Urgent" };
    }

    // Method 5: Skill Match
    if (selectedMethod === "skill") {
      const skillMatch = ease;
      const valuePotential = (impact * confidence) / 10;

      if (valuePotential >= 6 && skillMatch >= 7) {
        return { decision: "do", reason: "Perfect skill-value match" };
      }
      if (valuePotential >= 6 && skillMatch < 5) {
        return {
          decision: "delegate",
          reason: "Valuable but not your strength",
        };
      }
      if (valuePotential < 4 && skillMatch >= 8) {
        return { decision: "delegate", reason: "Too easy, waste your talent" };
      }
      if (valuePotential < 3) {
        return { decision: "delete", reason: "Low value potential" };
      }
      return { decision: "delay", reason: "Unclear skill-value fit" };
    }

    // Method 6: Energy-Aware
    if (selectedMethod === "energy") {
      const energyRequired = 11 - ease + estimatedTime / 30;
      const expectedValue = impact * (confidence / 10);
      const valuePerEnergy = expectedValue / energyRequired;

      if (valuePerEnergy >= 1.5) {
        return {
          decision: "do",
          reason: `Excellent energy ROI (${valuePerEnergy.toFixed(2)})`,
        };
      }
      if (valuePerEnergy >= 0.8 && energyRequired <= 5) {
        return { decision: "do", reason: "Good value, low energy" };
      }
      if (valuePerEnergy >= 0.8 && energyRequired > 5) {
        return { decision: "delegate", reason: "Good value but too draining" };
      }
      if (valuePerEnergy < 0.5) {
        return {
          decision: "delete",
          reason: `Poor energy ROI (${valuePerEnergy.toFixed(2)})`,
        };
      }
      return { decision: "delay", reason: "Medium energy efficiency" };
    }

    // Method 7: Strategic Alignment
    if (selectedMethod === "strategic") {
      const typeWeights = {
        revenue: 1.5,
        strategic: 1.3,
        growth: 1.2,
        operations: 1.0,
        personal: 0.8,
      };
      const strategicValue = (typeWeights[task.type] || 1.0) * impact;
      const feasibility = (confidence + ease) / 2;

      if (strategicValue >= 10 && feasibility >= 6) {
        return { decision: "do", reason: "Strategic priority & feasible" };
      }
      if (strategicValue >= 10 && feasibility < 6) {
        return { decision: "delegate", reason: "Strategic but need help" };
      }
      if (strategicValue < 6 && feasibility >= 8) {
        return { decision: "delegate", reason: "Low strategic value" };
      }
      if (strategicValue < 5) {
        return { decision: "delete", reason: "Not aligned with strategy" };
      }
      return { decision: "delay", reason: "Medium strategic fit" };
    }

    // Method 8: Hybrid Smart (Default)
    if (selectedMethod === "hybrid") {
      const typeWeights = {
        revenue: 1.5,
        strategic: 1.3,
        growth: 1.2,
        operations: 1.0,
        personal: 0.8,
      };

      const valueScore = impact * (confidence / 10);
      const effortScore = 11 - ease + estimatedTime / 30;
      const roi = valueScore / effortScore;
      const strategicWeight = typeWeights[task.type] || 1.0;
      const finalScore = roi * 0.4 + valueScore * 0.3 + strategicWeight * 0.3;

      if (finalScore >= 3.5 && valueScore >= 6) {
        return {
          decision: "do",
          reason: `Excellent score (${finalScore.toFixed(2)})`,
        };
      }
      if (finalScore >= 2.5 && effortScore >= 8) {
        return { decision: "delegate", reason: "Good value but too effortful" };
      }
      if (finalScore >= 2.5 && valueScore <= 5 && ease >= 7) {
        return { decision: "delegate", reason: "Easy but low value" };
      }
      if (confidence <= 5 && finalScore < 3.5) {
        return { decision: "delay", reason: "Uncertain, need more info" };
      }
      if (finalScore < 2.0) {
        return {
          decision: "delete",
          reason: `Low score (${finalScore.toFixed(2)})`,
        };
      }
      return {
        decision: "do",
        reason: `Good score (${finalScore.toFixed(2)})`,
      };
    }

    return { decision: "do", reason: "Default" };
  };

  const getTimeBlockInfo = (timeBlock) => {
    const blocks = {
      deep: {
        icon: Brain,
        label: "Deep Work",
        color: "bg-indigo-100 text-indigo-800 border-indigo-300",
        description: "Cần tập trung cao, không bị gián đoạn",
        bestTime: "🌅 Sáng sớm / Sau giờ nghỉ trưa",
      },
      collaborative: {
        icon: Users,
        label: "Collaborative",
        color: "bg-cyan-100 text-cyan-800 border-cyan-300",
        description: "Cần tương tác, feedback từ người khác",
        bestTime: "☀️ Giờ hành chính / Khi team online",
      },
      quick: {
        icon: Zap,
        label: "Quick Wins",
        color: "bg-amber-100 text-amber-800 border-amber-300",
        description: "Nhanh gọn, 5-30 phút",
        bestTime: "⚡ Khi chờ đợi / Giữa các task lớn",
      },
      systematic: {
        icon: Clock,
        label: "Systematic",
        color: "bg-rose-100 text-rose-800 border-rose-300",
        description: "Setup một lần, chạy tự động",
        bestTime: "🔧 Khi có thời gian yên tĩnh để setup",
      },
    };
    return blocks[timeBlock] || blocks.quick;
  };

  const getDecisionStats = (decision) => {
    const decisionTasks = tasks.filter((t) => t.decision === decision);
    const totalTime = decisionTasks.reduce(
      (sum, t) => sum + (t.estimatedTime || 0),
      0,
    );
    return {
      count: decisionTasks.length,
      time: totalTime,
    };
  };

  const addTask = () => {
    if (newTask.name.trim()) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({
        name: "",
        impact: 5,
        confidence: 5,
        ease: 5,
        type: "operations",
        timeBlock: "quick",
        estimatedTime: 30,
        decision: "do",
        notes: "",
      });
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const updateTask = (id, field, value) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => calculateICE(b) - calculateICE(a),
  );

  const filterByTimeBlock = (tasksList, block) => {
    if (block === "all") return tasksList;
    return tasksList.filter((t) => t.timeBlock === block);
  };

  const filteredTasks = filterByTimeBlock(sortedTasks, activeTab);

  const getTimeBlockStats = (block) => {
    const blockTasks = tasks.filter((t) => t.timeBlock === block);
    const totalTime = blockTasks.reduce(
      (sum, t) => sum + (t.estimatedTime || 0),
      0,
    );
    return {
      count: blockTasks.length,
      time: totalTime,
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Task Priority Framework
        </h1>
        <p className="text-gray-600 mb-4">
          ICE Score + Time Blocking + 4D Decision Framework
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="font-semibold text-gray-700">Impact:</span>
            <p className="text-gray-600 text-xs mt-1">
              Tác động đến mục tiêu (1-10)
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="font-semibold text-gray-700">Confidence:</span>
            <p className="text-gray-600 text-xs mt-1">
              Độ chắc chắn hoàn thành (1-10)
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="font-semibold text-gray-700">Ease:</span>
            <p className="text-gray-600 text-xs mt-1">Độ dễ thực hiện (1-10)</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="font-semibold text-gray-700">ICE Score:</span>
            <p className="text-gray-600 text-xs mt-1">
              Điểm ưu tiên = Trung bình 3 yếu tố
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {["do", "delegate", "delay", "delete"].map((decision) => {
          const info = getDecisionInfo(decision);
          const stats = getDecisionStats(decision);
          return (
            <div
              key={decision}
              className={`${info.color} border-2 rounded-lg p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{info.icon}</span>
                  <span className="font-bold">{info.label}</span>
                </div>
                <span className="text-sm font-semibold">
                  {stats.count} tasks
                </span>
              </div>
              <p className="text-xs mb-2">{info.description}</p>
              <p className="text-xs mt-1 font-semibold">⏱️ {stats.time} phút</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {["deep", "collaborative", "quick", "systematic"].map((block) => {
          const info = getTimeBlockInfo(block);
          const stats = getTimeBlockStats(block);
          const Icon = info.icon;
          return (
            <div
              key={block}
              className={`${info.color} border-2 rounded-lg p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Icon size={20} className="mr-2" />
                  <span className="font-bold">{info.label}</span>
                </div>
                <span className="text-sm font-semibold">
                  {stats.count} tasks
                </span>
              </div>
              <p className="text-xs mb-2">{info.description}</p>
              <p className="text-xs font-medium">{info.bestTime}</p>
              <p className="text-xs mt-1 font-semibold">⏱️ {stats.time} phút</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          ➕ Thêm Task Mới
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
          <input
            type="text"
            placeholder="Tên công việc..."
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />

          <div>
            <label className="block text-xs text-gray-600 mb-1">Impact</label>
            <input
              type="number"
              min="1"
              max="10"
              value={newTask.impact}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  impact: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Confidence
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={newTask.confidence}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  confidence: parseInt(e.target.value) || 1,
                })
              }
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
              onChange={(e) =>
                setNewTask({ ...newTask, ease: parseInt(e.target.value) || 1 })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Type</label>
            <select
              value={newTask.type}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
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
            <label className="block text-xs text-gray-600 mb-1">
              Time Block
            </label>
            <select
              value={newTask.timeBlock}
              onChange={(e) =>
                setNewTask({ ...newTask, timeBlock: e.target.value })
              }
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
            <label className="block text-xs text-gray-600 mb-1">
              Estimated Time (phút)
            </label>
            <input
              type="number"
              min="5"
              value={newTask.estimatedTime}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  estimatedTime: parseInt(e.target.value) || 5,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Decision (4D Framework)
            </label>
            <select
              value={newTask.decision}
              onChange={(e) =>
                setNewTask({ ...newTask, decision: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="do">✅ DO - Làm ngay</option>
              <option value="delegate">👤 DELEGATE - Giao việc</option>
              <option value="delay">⏸️ DELAY - Hoãn lại</option>
              <option value="delete">🗑️ DELETE - Loại bỏ</option>
            </select>
          </div>
        </div>

        <button
          onClick={addTask}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition"
        >
          <Plus className="mr-2" size={20} />
          Thêm Task
        </button>
      </div>

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
            <option value="strategic">
              7️⃣ Strategic Alignment (Type-Based)
            </option>
            <option value="hybrid">8️⃣ Hybrid Smart (Recommended) ⭐</option>
          </select>
          <p className="text-xs text-gray-700 mt-2 font-medium">
            {selectedMethod === "simple" &&
              "📝 Basic method using ICE score and impact level"}
            {selectedMethod === "weighted" &&
              "⚖️ Impact (50%) > Confidence (30%) > Ease (20%)"}
            {selectedMethod === "roi" &&
              "📊 Considers ROI = Impact / Effort and time efficiency"}
            {selectedMethod === "eisenhower" &&
              "📋 Classic Important/Urgent matrix with time blocks"}
            {selectedMethod === "skill" &&
              "🎯 Matches your skills (ease) with value potential"}
            {selectedMethod === "energy" &&
              "⚡ Optimizes for energy efficiency and burnout prevention"}
            {selectedMethod === "strategic" &&
              "🎲 Prioritizes based on task type (Revenue > Strategic > Growth)"}
            {selectedMethod === "hybrid" &&
              "🔮 Combines ROI (40%), Value (30%), Strategy (30%) - Most comprehensive"}
          </p>
        </div>

        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === "all" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
          >
            📋 All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab("deep")}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === "deep" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-600"}`}
          >
            🧠 Deep Work ({getTimeBlockStats("deep").count})
          </button>
          <button
            onClick={() => setActiveTab("collaborative")}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === "collaborative" ? "border-b-2 border-cyan-500 text-cyan-600" : "text-gray-600"}`}
          >
            👥 Collaborative ({getTimeBlockStats("collaborative").count})
          </button>
          <button
            onClick={() => setActiveTab("quick")}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === "quick" ? "border-b-2 border-amber-500 text-amber-600" : "text-gray-600"}`}
          >
            ⚡ Quick Wins ({getTimeBlockStats("quick").count})
          </button>
          <button
            onClick={() => setActiveTab("systematic")}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === "systematic" ? "border-b-2 border-rose-500 text-rose-600" : "text-gray-600"}`}
          >
            🔧 Systematic ({getTimeBlockStats("systematic").count})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Task Name
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  I
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  C
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  E
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  ICE
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Time Block
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Est. Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Decision
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  AI Suggest
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => {
                const iceScore = calculateICE(task);
                const typeInfo = getTypeInfo(task.type);
                const timeBlockInfo = getTimeBlockInfo(task.timeBlock);
                const decisionInfo = getDecisionInfo(task.decision);
                const recommendation = getDecisionRecommendation(task);
                const priorityColor =
                  iceScore >= 8
                    ? "bg-green-500"
                    : iceScore >= 6
                      ? "bg-yellow-500"
                      : "bg-gray-400";

                return (
                  <tr
                    key={task.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`${priorityColor} text-white font-bold px-3 py-1 rounded-full text-sm whitespace-nowrap`}
                      >
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) =>
                          updateTask(task.id, "name", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={task.impact}
                        onChange={(e) =>
                          updateTask(
                            task.id,
                            "impact",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-12 px-2 py-1 text-center border border-gray-200 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={task.confidence}
                        onChange={(e) =>
                          updateTask(
                            task.id,
                            "confidence",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-12 px-2 py-1 text-center border border-gray-200 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={task.ease}
                        onChange={(e) =>
                          updateTask(
                            task.id,
                            "ease",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-12 px-2 py-1 text-center border border-gray-200 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xl font-bold text-gray-800">
                        {iceScore}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={task.type}
                        onChange={(e) =>
                          updateTask(task.id, "type", e.target.value)
                        }
                        className={`${typeInfo.color} px-2 py-1 rounded-full text-xs font-medium`}
                      >
                        <option value="revenue">💰 Revenue</option>
                        <option value="growth">📈 Growth</option>
                        <option value="operations">🔧 Operations</option>
                        <option value="strategic">🎯 Strategic</option>
                        <option value="personal">✨ Personal</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={task.timeBlock}
                        onChange={(e) =>
                          updateTask(task.id, "timeBlock", e.target.value)
                        }
                        className={`${timeBlockInfo.color} border px-2 py-1 rounded-lg text-xs font-medium flex items-center`}
                      >
                        <option value="deep">🧠 Deep</option>
                        <option value="collaborative">👥 Collab</option>
                        <option value="quick">⚡ Quick</option>
                        <option value="systematic">🔧 System</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="5"
                        value={task.estimatedTime}
                        onChange={(e) =>
                          updateTask(
                            task.id,
                            "estimatedTime",
                            parseInt(e.target.value) || 5,
                          )
                        }
                        className="w-16 px-2 py-1 text-center border border-gray-200 rounded"
                      />
                      <span className="text-xs text-gray-500 ml-1">min</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={task.decision}
                        onChange={(e) =>
                          updateTask(task.id, "decision", e.target.value)
                        }
                        className={`${decisionInfo.color} border px-2 py-1 rounded-lg text-xs font-medium`}
                      >
                        <option value="do">✅ DO</option>
                        <option value="delegate">👤 DELEGATE</option>
                        <option value="delay">⏸️ DELAY</option>
                        <option value="delete">🗑️ DELETE</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <div className="font-semibold text-gray-700 mb-1">
                          {getDecisionInfo(recommendation.decision).icon}{" "}
                          {recommendation.decision.toUpperCase()}
                        </div>
                        <div className="text-gray-600 italic">
                          {recommendation.reason}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          💡 4D Decision Framework:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-semibold text-green-700">✅ DO - Làm ngay</p>
            <p className="text-sm text-gray-600">
              High ICE (≥7.5) + High Impact (≥7). Tasks này quan trọng và bạn có
              khả năng làm tốt.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Core product development, strategic planning
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold text-blue-700">
              👤 DELEGATE - Giao việc
            </p>
            <p className="text-sm text-gray-600">
              High Impact nhưng Low Ease (khó với bạn) HOẶC Low Impact nhưng
              Easy (ai cũng làm được).
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Admin tasks, graphic design, data entry
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="font-semibold text-yellow-700">⏸️ DELAY - Hoãn lại</p>
            <p className="text-sm text-gray-600">
              Medium Impact + Low Confidence. Cần thêm thông tin hoặc chưa đến
              lúc phù hợp.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Projects cần thêm research, tasks phụ thuộc vào điều kiện
              khác
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <p className="font-semibold text-red-700">🗑️ DELETE - Loại bỏ</p>
            <p className="text-sm text-gray-600">
              Low Impact (≤4). Không đáng để dành thời gian, energy và
              attention.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Nice-to-have features, vanity metrics, busy work
            </p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-3 mt-6">
          🎯 Hướng Dẫn Sử Dụng Time Blocking:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-indigo-500 pl-4">
            <p className="font-semibold text-indigo-700">🧠 Deep Work Tasks</p>
            <p className="text-sm text-gray-600">
              Schedule vào buổi sáng hoặc khung giờ bạn tập trung tốt nhất. Tắt
              thông báo, không multitask.
            </p>
          </div>
          <div className="border-l-4 border-cyan-500 pl-4">
            <p className="font-semibold text-cyan-700">
              👥 Collaborative Tasks
            </p>
            <p className="text-sm text-gray-600">
              Làm trong giờ hành chính khi team online. Chuẩn bị trước để
              meeting hiệu quả.
            </p>
          </div>
          <div className="border-l-4 border-amber-500 pl-4">
            <p className="font-semibold text-amber-700">⚡ Quick Wins</p>
            <p className="text-sm text-gray-600">
              Làm khi chờ đợi, giữa các task lớn, hoặc khi năng lượng thấp.
              Momentum tốt cho ngày mới.
            </p>
          </div>
          <div className="border-l-4 border-rose-500 pl-4">
            <p className="font-semibold text-rose-700">🔧 Systematic Tasks</p>
            <p className="text-sm text-gray-600">
              Đầu tư thời gian setup một lần, sau đó chạy tự động. Ưu tiên cao
              nếu tiết kiệm được nhiều thời gian.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 mb-2">
            <strong>💡 Pro Tip:</strong> Cột "AI Suggest" thay đổi theo method
            bạn chọn phía trên.
          </p>
          <p className="text-xs text-blue-700">
            <strong>Khuyến nghị:</strong> Thử các methods khác nhau để tìm cách
            tính phù hợp nhất với phong cách làm việc của bạn.
            <strong>Hybrid Smart</strong> là balanced nhất,{" "}
            <strong>ROI-Based</strong> tốt cho efficiency,
            <strong>Energy-Aware</strong> tốt cho sustainable productivity,{" "}
            <strong>Strategic</strong> tốt cho business owners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskPriorityFramework;
