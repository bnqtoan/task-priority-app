import React, { useState, useEffect, useRef } from "react";

interface NumberInputProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  "data-task-id"?: number;
  "data-field"?: string;
}

type ValidationState = "neutral" | "typing" | "invalid" | "valid";

export function NumberInput({
  value,
  min,
  max,
  onChange,
  onFocus,
  onBlur,
  className = "",
  placeholder,
  disabled = false,
  ...props
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState<string>(value.toString());
  const [validationState, setValidationState] = useState<ValidationState>("neutral");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value.toString());
    setValidationState("neutral");
  }, [value]);

  const validateValue = (val: string): { isValid: boolean; numValue: number; error: string } => {
    if (val === "") {
      return { isValid: false, numValue: min, error: `Value required (${min}-${max})` };
    }

    const numValue = parseInt(val, 10);

    if (isNaN(numValue)) {
      return { isValid: false, numValue: min, error: "Must be a number" };
    }

    if (numValue < min) {
      return { isValid: false, numValue, error: `Minimum: ${min}` };
    }

    if (numValue > max) {
      return { isValid: false, numValue, error: `Maximum: ${max}` };
    }

    return { isValid: true, numValue, error: "" };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    setValidationState("typing");
    setErrorMessage("");

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Validate and save after 300ms of no typing
    saveTimeoutRef.current = setTimeout(() => {
      const validation = validateValue(val);

      if (validation.isValid) {
        setValidationState("valid");
        onChange(validation.numValue);

        // Reset to neutral after 1s
        setTimeout(() => setValidationState("neutral"), 1000);
      } else if (val !== "") {
        // Don't show error while empty (user is typing)
        setValidationState("invalid");
        setErrorMessage(validation.error);
      }
    }, 300);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Auto-select all text for easy replacement
    e.target.select();
    setValidationState("typing");
    setErrorMessage("");
    onFocus?.();
  };

  const handleBlur = () => {
    const validation = validateValue(localValue);

    if (!validation.isValid) {
      // Reset to original value if invalid
      setLocalValue(value.toString());
      setValidationState("invalid");
      setErrorMessage(validation.error);

      // Clear error after 2s
      setTimeout(() => {
        setValidationState("neutral");
        setErrorMessage("");
      }, 2000);
    } else {
      setValidationState("neutral");
      setErrorMessage("");
      onChange(validation.numValue);
    }

    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setLocalValue(value.toString());
      setValidationState("neutral");
      setErrorMessage("");
      inputRef.current?.blur();
    }
  };

  // Border color based on validation state
  const getBorderClass = () => {
    switch (validationState) {
      case "typing":
        return "border-yellow-400 ring-2 ring-yellow-200";
      case "invalid":
        return "border-red-500 ring-2 ring-red-200";
      case "valid":
        return "border-green-500 ring-2 ring-green-200";
      default:
        return "border-gray-200 focus:ring-2 focus:ring-blue-500";
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="number"
        min={min}
        max={max}
        value={localValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || `${min}-${max}`}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${getBorderClass()} ${className}`}
        {...props}
      />

      {/* Validation icon */}
      {validationState !== "neutral" && validationState !== "typing" && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {validationState === "valid" && (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {validationState === "invalid" && (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <p className="absolute -bottom-5 left-0 text-xs text-red-500 animate-shake">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
