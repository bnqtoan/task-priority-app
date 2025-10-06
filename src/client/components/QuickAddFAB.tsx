import { useState, useEffect, useRef } from "react";
import { Plus, ChevronUp, X } from "lucide-react";
import type { CreateTaskInput } from "../../utils/types";

interface QuickAddFABProps {
  onAdd: (task: CreateTaskInput) => Promise<void>;
  onShowFullForm?: () => void;
}

export function QuickAddFAB({ onAdd, onShowFullForm }: QuickAddFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Smart defaults for quick add
  const getQuickTaskDefaults = (): Omit<CreateTaskInput, "name"> => ({
    impact: 5,
    confidence: 5,
    ease: 5,
    type: "unclassified",
    timeBlock: "quick",
    estimatedTime: 30,
    decision: "do",
    scheduledFor: "today",
    recurringPattern: null,
    notes: "",
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setTaskName("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim() || isAdding) return;

    setIsAdding(true);
    try {
      const newTask: CreateTaskInput = {
        name: taskName.trim(),
        ...getQuickTaskDefaults(),
      };

      await onAdd(newTask);

      // Reset and close
      setTaskName("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAdvanced = () => {
    setIsOpen(false);
    setTaskName("");
    if (onShowFullForm) {
      onShowFullForm();
    }
  };

  return (
    <>
      {/* Quick Add Form - Floating above FAB */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 z-40 animate-slide-up"
          style={{ minWidth: "350px", maxWidth: "400px" }}
        >
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-purple-600" />
                <span className="font-semibold text-gray-800">
                  Quick Add Task
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setTaskName("");
                }}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-white rounded transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Input */}
            <div className="p-4">
              <input
                ref={inputRef}
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Type task name and press Enter..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAdding}
              />
              <p className="text-xs text-gray-500 mt-2">
                Quick defaults: ICE 5/5/5, Quick Win, Do Today
              </p>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 rounded-b-lg flex items-center justify-between border-t">
              <button
                type="button"
                onClick={handleAdvanced}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <ChevronUp size={16} />
                Advanced Options
              </button>
              <button
                type="submit"
                disabled={!taskName.trim() || isAdding}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition"
              >
                {isAdding ? "Adding..." : "Add Task"}
              </button>
            </div>
          </form>

          {/* Keyboard hint */}
          <div className="px-4 py-2 bg-gray-50 border-t text-center">
            <span className="text-xs text-gray-400">
              Press{" "}
              <kbd className="px-2 py-0.5 bg-white border rounded text-gray-600 font-mono">
                Enter
              </kbd>{" "}
              to add •{" "}
              <kbd className="px-2 py-0.5 bg-white border rounded text-gray-600 font-mono">
                Esc
              </kbd>{" "}
              to close
            </span>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-110 ${
          isOpen ? "rotate-45" : ""
        }`}
        title="Quick Add Task (Cmd+K)"
      >
        <Plus size={24} />
      </button>

      {/* Keyboard shortcut hint - only show when closed */}
      {!isOpen && (
        <div className="fixed bottom-2 right-6 text-center z-40 pointer-events-none">
          <span className="inline-block bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded animate-fade-in">
            <kbd className="font-mono">⌘K</kbd>
          </span>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-in 0.5s both;
        }
      `}</style>
    </>
  );
}
