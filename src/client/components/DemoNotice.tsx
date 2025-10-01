import { useState } from "react";
import { X, Download, Upload, RotateCcw, ExternalLink } from "lucide-react";
import { APP_CONFIG } from "../../utils/config";
import {
  exportDemoData,
  importDemoData,
  resetDemoData,
} from "../../lib/demo-data";

export const DemoNotice = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDataMenu, setShowDataMenu] = useState(false);

  if (!APP_CONFIG.IS_DEMO) return null;

  const handleExport = () => {
    const data = exportDemoData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `task-priority-demo-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDataMenu(false);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            importDemoData(data);
            window.location.reload(); // Refresh to show imported data
          } catch (error) {
            alert(
              "Invalid file format. Please select a valid JSON export file.",
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setShowDataMenu(false);
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all demo data? This cannot be undone.",
      )
    ) {
      resetDemoData();
      window.location.reload();
    }
    setShowDataMenu(false);
  };

  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium"
        >
          🚀 Demo Mode
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg p-4 mb-6 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">🚀</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Demo Mode Active
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              You're using the <strong>demo version</strong> of the Task
              Priority Framework. Your data is stored locally in your browser
              and will be lost when you clear browser data.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://task-priority-app.bnqtoan.workers.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Try Full Version
              </a>
              <div className="relative">
                <button
                  onClick={() => setShowDataMenu(!showDataMenu)}
                  className="inline-flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Data Options
                </button>
                {showDataMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                    <button
                      onClick={handleExport}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Download className="w-3 h-3" />
                      Export Data
                    </button>
                    <button
                      onClick={handleImport}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Upload className="w-3 h-3" />
                      Import Data
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Demo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="flex-shrink-0 text-yellow-600 hover:text-yellow-800 ml-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Click outside handler for data menu */}
      {showDataMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDataMenu(false)}
        />
      )}
    </div>
  );
};
