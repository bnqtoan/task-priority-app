import { Brain, Users, Zap, Clock } from 'lucide-react';
import type { Task } from '../../utils/types';

export const calculateICE = (task: Task): string => {
  return ((task.impact + task.confidence + task.ease) / 3).toFixed(1);
};

export const getTypeInfo = (type: string) => {
  const types = {
    revenue: { emoji: '💰', label: 'Revenue/Business', color: 'bg-green-100 text-green-800' },
    growth: { emoji: '📈', label: 'Growth/Learning', color: 'bg-blue-100 text-blue-800' },
    operations: { emoji: '🔧', label: 'Operations', color: 'bg-gray-100 text-gray-800' },
    strategic: { emoji: '🎯', label: 'Strategic', color: 'bg-purple-100 text-purple-800' },
    personal: { emoji: '✨', label: 'Personal', color: 'bg-pink-100 text-pink-800' },
  };
  return types[type as keyof typeof types] || types.operations;
};

export const getDecisionInfo = (decision: string) => {
  const decisions = {
    do: {
      icon: '✅',
      label: 'DO',
      color: 'bg-green-100 text-green-800 border-green-300',
      description: 'Làm ngay - High value, phù hợp với kỹ năng',
    },
    delegate: {
      icon: '👤',
      label: 'DELEGATE',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Giao cho người khác - Low skill requirement hoặc người khác làm tốt hơn',
    },
    delay: {
      icon: '⏸️',
      label: 'DELAY',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'Hoãn lại - Quan trọng nhưng chưa cấp thiết',
    },
    delete: {
      icon: '🗑️',
      label: 'DELETE',
      color: 'bg-red-100 text-red-800 border-red-300',
      description: 'Loại bỏ - Low impact, không cần thiết',
    },
  };
  return decisions[decision as keyof typeof decisions] || decisions.do;
};

export const getTimeBlockInfo = (timeBlock: string) => {
  const blocks = {
    deep: {
      icon: Brain,
      label: 'Deep Work',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      description: 'Cần tập trung cao, không bị gián đoạn',
      bestTime: '🌅 Sáng sớm / Sau giờ nghỉ trưa'
    },
    collaborative: {
      icon: Users,
      label: 'Collaborative',
      color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      description: 'Cần tương tác, feedback từ người khác',
      bestTime: '☀️ Giờ hành chính / Khi team online'
    },
    quick: {
      icon: Zap,
      label: 'Quick Wins',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Nhanh gọn, 5-30 phút',
      bestTime: '⚡ Khi chờ đợi / Giữa các task lớn'
    },
    systematic: {
      icon: Clock,
      label: 'Systematic',
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Setup một lần, chạy tự động',
      bestTime: '🔧 Khi có thời gian yên tĩnh để setup'
    },
  };
  return blocks[timeBlock as keyof typeof blocks] || blocks.quick;
};