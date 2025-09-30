import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import type { ICEWeights } from '../../utils/types';
import { ICE_WEIGHT_PRESETS, DEFAULT_ICE_WEIGHTS, getPresetName } from '../lib/helpers';

interface ICEWeightsSettingsProps {
  isOpen: boolean;
  currentWeights: ICEWeights;
  onClose: () => void;
  onSave: (weights: ICEWeights) => void;
}

export function ICEWeightsSettings({ isOpen, currentWeights, onClose, onSave }: ICEWeightsSettingsProps) {
  const [weights, setWeights] = useState<ICEWeights>(currentWeights);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  useEffect(() => {
    setWeights(currentWeights);
    setSelectedPreset(getPresetName(currentWeights) || 'custom');
  }, [currentWeights, isOpen]);

  const handleWeightChange = (field: keyof ICEWeights, value: number) => {
    setWeights(prev => ({ ...prev, [field]: value }));
    setSelectedPreset('custom');
  };

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    if (presetName !== 'custom') {
      setWeights(ICE_WEIGHT_PRESETS[presetName]);
    }
  };

  const handleSave = () => {
    // Validate total equals 100
    const total = weights.impact + weights.confidence + weights.ease;
    if (Math.abs(total - 100) > 0.1) {
      alert('Total weights must equal 100%');
      return;
    }
    onSave(weights);
    onClose();
  };

  const handleReset = () => {
    setWeights(DEFAULT_ICE_WEIGHTS);
    setSelectedPreset('impactFocused');
  };

  const totalWeight = weights.impact + weights.confidence + weights.ease;
  const isValid = Math.abs(totalWeight - 100) < 0.1;

  if (!isOpen) return null;

  const presetInfo: Record<string, { name: string; description: string }> = {
    balanced: {
      name: 'Balanced (33-33-33)',
      description: 'Equal weight to all factors. Good for general use.'
    },
    impactFocused: {
      name: 'Impact-Focused (50-30-20)',
      description: 'Prioritizes high-impact work. Best for strategic goals and revenue generation.'
    },
    quickWins: {
      name: 'Quick Wins (25-25-50)',
      description: 'Focuses on easy tasks. Great for building momentum and clearing backlogs.'
    },
    confidentMoves: {
      name: 'Confident Moves (30-50-20)',
      description: 'Prioritizes tasks you can deliver with certainty. Good for meeting deadlines.'
    },
    strategic: {
      name: 'Strategic (60-25-15)',
      description: 'Maximum focus on impact. Best for founders and leaders making big bets.'
    },
    momentum: {
      name: 'Momentum Builder (20-30-50)',
      description: 'Gets things done fast. Perfect when energy is low or you need quick progress.'
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">ICE Score Weights</h2>
            <p className="text-sm text-gray-600 mt-1">Customize how tasks are prioritized</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How ICE Weights Work</p>
              <p>
                The weighted ICE score = (Impact × {weights.impact}%) + (Confidence × {weights.confidence}%) + (Ease × {weights.ease}%)
              </p>
              <p className="mt-1">
                Higher percentages mean that factor has more influence on task priority.
              </p>
            </div>
          </div>

          {/* Preset Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose a Preset Profile
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(presetInfo).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => handlePresetChange(key)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedPreset === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="font-medium text-gray-800 mb-1">{info.name}</div>
                  <div className="text-xs text-gray-600">{info.description}</div>
                </button>
              ))}
              <button
                onClick={() => setSelectedPreset('custom')}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedPreset === 'custom'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="font-medium text-gray-800 mb-1">Custom</div>
                <div className="text-xs text-gray-600">Set your own weight percentages</div>
              </button>
            </div>
          </div>

          {/* Weight Sliders */}
          <div className="space-y-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Fine-tune Weights</h3>

            {/* Impact */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Impact Weight
                </label>
                <span className="text-lg font-bold text-blue-600">{weights.impact.toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weights.impact}
                onChange={(e) => handleWeightChange('impact', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                How much does the task's impact on goals matter?
              </p>
            </div>

            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Confidence Weight
                </label>
                <span className="text-lg font-bold text-green-600">{weights.confidence.toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weights.confidence}
                onChange={(e) => handleWeightChange('confidence', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                How much does certainty of completion matter?
              </p>
            </div>

            {/* Ease */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Ease Weight
                </label>
                <span className="text-lg font-bold text-orange-600">{weights.ease.toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weights.ease}
                onChange={(e) => handleWeightChange('ease', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                How much does ease of execution matter?
              </p>
            </div>

            {/* Total Display */}
            <div className={`p-4 rounded-lg border-2 ${
              isValid ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Total Weight:</span>
                <span className={`text-xl font-bold ${
                  isValid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {totalWeight.toFixed(1)}%
                </span>
              </div>
              {!isValid && (
                <p className="text-xs text-red-600 mt-1">
                  Total must equal 100%. Adjust the sliders above.
                </p>
              )}
            </div>
          </div>

          {/* Example Calculation */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Example Calculation</h4>
            <p className="text-sm text-gray-600 mb-2">
              For a task with Impact=8, Confidence=6, Ease=4:
            </p>
            <div className="font-mono text-sm text-gray-700 bg-white p-3 rounded border">
              Score = (8 × {weights.impact.toFixed(0)}%) + (6 × {weights.confidence.toFixed(0)}%) + (4 × {weights.ease.toFixed(0)}%)
              <br />
              Score = {((8 * weights.impact / 100) + (6 * weights.confidence / 100) + (4 * weights.ease / 100)).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
          >
            Reset to Default
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                isValid
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}