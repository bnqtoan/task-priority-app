import { Brain, Users, Zap, Clock } from "lucide-react";
import type { Task, ICEWeights } from "../../utils/types";

// Default weights - balanced approach prioritizing impact
export const DEFAULT_ICE_WEIGHTS: ICEWeights = {
  impact: 50,
  confidence: 30,
  ease: 20,
};

// Preset weight profiles
export const ICE_WEIGHT_PRESETS: Record<string, ICEWeights> = {
  balanced: {
    impact: 33.3,
    confidence: 33.3,
    ease: 33.4,
  },
  impactFocused: {
    impact: 50,
    confidence: 30,
    ease: 20,
  },
  quickWins: {
    impact: 25,
    confidence: 25,
    ease: 50,
  },
  confidentMoves: {
    impact: 30,
    confidence: 50,
    ease: 20,
  },
  strategic: {
    impact: 60,
    confidence: 25,
    ease: 15,
  },
  momentum: {
    impact: 20,
    confidence: 30,
    ease: 50,
  },
};

// Calculate ICE with simple average (backward compatibility)
export const calculateICE = (task: Task): string => {
  return ((task.impact + task.confidence + task.ease) / 3).toFixed(1);
};

// Calculate weighted ICE score
export const calculateWeightedICE = (
  task: Task,
  weights?: ICEWeights,
): string => {
  const w = weights || DEFAULT_ICE_WEIGHTS;

  const score =
    (task.impact * w.impact) / 100 +
    (task.confidence * w.confidence) / 100 +
    (task.ease * w.ease) / 100;

  return score.toFixed(1);
};

// Get preset name from weights
export const getPresetName = (weights: ICEWeights): string | null => {
  for (const [name, preset] of Object.entries(ICE_WEIGHT_PRESETS)) {
    if (
      Math.abs(preset.impact - weights.impact) < 0.1 &&
      Math.abs(preset.confidence - weights.confidence) < 0.1 &&
      Math.abs(preset.ease - weights.ease) < 0.1
    ) {
      return name;
    }
  }
  return "custom";
};

export const getTypeInfo = (type: string) => {
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
  return types[type as keyof typeof types] || types.operations;
};

export const getDecisionInfo = (decision: string) => {
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
  return decisions[decision as keyof typeof decisions] || decisions.do;
};

export const getTimeBlockInfo = (timeBlock: string) => {
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
  return blocks[timeBlock as keyof typeof blocks] || blocks.quick;
};
