import { useState, useEffect } from 'react';
import { Task, FocusQuote } from '../../utils/types';
import { getRandomFocusQuote } from '../../utils/focus-quotes';

interface FocusModeModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (duration: number) => void;
}

export function FocusModeModal({ task, isOpen, onClose, onComplete }: FocusModeModalProps) {
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [quote] = useState<FocusQuote>(getRandomFocusQuote());
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedTime;
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, startTime, isPaused, pausedTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    if (isPaused) {
      // Resume - add the paused time to total paused time
      setPausedTime(prev => prev + (new Date().getTime() - startTime.getTime()) / 1000 - elapsedTime);
    }
    setIsPaused(!isPaused);
  };

  const handleComplete = () => {
    const totalMinutes = Math.ceil(elapsedTime / 60);
    onComplete(totalMinutes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      {/* Background overlay with subtle animation */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close focus mode"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main content */}
      <div className="relative z-10 text-center text-white max-w-4xl px-8">
        {/* Task name */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-blue-100">
          {task.name}
        </h1>

        {/* Timer */}
        <div className="mb-12">
          <div className="text-6xl md:text-8xl font-mono font-bold mb-4 text-white">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-lg text-blue-200">
            {isPaused ? 'Paused' : 'Focus Time'}
          </div>
        </div>

        {/* Quote */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 mb-12 max-w-2xl mx-auto">
          <blockquote className="text-xl md:text-2xl italic text-blue-50 mb-4">
            "{quote.text}"
          </blockquote>
          <cite className="text-blue-200 font-medium">— {quote.author}</cite>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePause}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
              isPaused
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            {isPaused ? (
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Resume</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <span>Pause</span>
              </span>
            )}
          </button>

          <button
            onClick={handleComplete}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Complete Session</span>
          </button>
        </div>

        {/* Estimated vs actual time */}
        {task.estimatedTime && (
          <div className="mt-8 text-blue-200 text-sm">
            Estimated: {task.estimatedTime} min | 
            Actual: {Math.ceil(elapsedTime / 60)} min
            {task.actualTime && ` | Total time: ${task.actualTime + Math.ceil(elapsedTime / 60)} min`}
          </div>
        )}
      </div>

      {/* Ambient particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-indigo-400 rounded-full opacity-30 animate-bounce"></div>
      </div>
    </div>
  );
}
