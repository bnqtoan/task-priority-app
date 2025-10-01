import { Task, AIRecommendation } from "./types";

export const calculateICE = (task: Task): string => {
  return ((task.impact + task.confidence + task.ease) / 3).toFixed(1);
};

export const getDecisionRecommendation = (
  task: Task,
  selectedMethod: string = "hybrid",
): AIRecommendation => {
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
      return { decision: "delete", reason: `Low score (${score.toFixed(1)})` };
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
      return { decision: "delete", reason: `Very low ROI (${roi.toFixed(2)})` };
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
      return { decision: "delegate", reason: "Valuable but not your strength" };
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
    return { decision: "do", reason: `Good score (${finalScore.toFixed(2)})` };
  }

  return { decision: "do", reason: "Default" };
};
