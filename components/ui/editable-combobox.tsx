"use client";

import { useEffect, useRef, useState } from "react";

interface EditableComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | string[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  strict?: boolean;
}

export function EditableCombobox({
  value,
  onChange,
  options,
  placeholder = "Type or select...",
  label,
  required = false,
  disabled = false,
  error,
  helpText,
  className = "",
  strict = false,
}: EditableComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmedValue = (value || "").trim().toLowerCase();

  // Filter options based on input value (case-insensitive substring search)
  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(trimmedValue),
  );

  // Check if current typed value is valid against available options
  const hasExactMatch =
    !trimmedValue ||
    options.some((item) => item.toLowerCase() === trimmedValue);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectOption = (option: string) => {
    if (disabled) return;
    onChange(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1,
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isInvalid = Boolean(
    error || (strict && trimmedValue && filteredOptions.length === 0 && !hasExactMatch),
  );

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label ? (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">
          {label.split("*").map((part, idx, arr) => (
            <span key={idx}>
              {part}
              {idx < arr.length - 1 ? (
                <span className="text-red-500 font-bold ml-0.5">*</span>
              ) : null}
            </span>
          ))}
          {required && !label.includes("*") ? (
            <span className="text-red-500 font-bold ml-0.5">*</span>
          ) : null}
        </label>
      ) : null}

      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-3 flex items-center text-[#94a3b8]">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full rounded-lg border pl-9 pr-14 py-2 text-sm transition focus:outline-none ${
            disabled
              ? "border-[#cbd5e1] bg-[#f1f5f9] text-[#64748b] cursor-not-allowed font-medium"
              : isInvalid
                ? "border-red-500 bg-[#fff5f5] text-[#991b1b] focus:border-red-600 focus:ring-1 focus:ring-red-600"
                : "border-[#cbd5e1] bg-white text-[#0f172a] placeholder-[#94a3b8] focus:border-[#1f6fa8] focus:ring-1 focus:ring-[#1f6fa8]"
          } uppercase`}
        />

        {!disabled ? (
          <div className="absolute right-2 flex items-center gap-0.5">
            {value ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                  setIsOpen(false);
                }}
                className="p-1 text-[#94a3b8] hover:text-[#0f172a] focus:outline-none"
                title="Clear selection"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : null}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-1 text-[#64748b] hover:text-[#0f172a] focus:outline-none"
              title="Toggle dropdown"
            >
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        ) : (
          <span className="absolute right-2.5 rounded bg-[#e2e8f0] px-1.5 py-0.5 text-[10px] font-bold text-[#64748b]">
            LOCKED
          </span>
        )}
      </div>

      {/* Inline Validation Error Message */}
      {error ? (
        <p className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>
      ) : strict && trimmedValue && filteredOptions.length === 0 && !hasExactMatch ? (
        <p className="mt-1 text-[11px] font-semibold text-red-600">
          Not in official records. Please select a valid option.
        </p>
      ) : helpText ? (
        <p className="mt-1 text-[11px] text-[#64748b]">{helpText}</p>
      ) : null}

      {/* Floating Suggestions Dropdown */}
      {!disabled && isOpen && filteredOptions.length > 0 ? (
        <ul className="absolute left-0 z-[100] mt-1 max-h-56 min-w-full w-max max-w-[320px] overflow-y-auto rounded-xl border border-[#cbd5e1] bg-white py-1.5 shadow-2xl ring-1 ring-black/10 transition-all uppercase">
          {filteredOptions.map((option, idx) => {
            const isHighlighted = idx === highlightedIndex;
            const isSelected = option.toLowerCase() === trimmedValue;

            return (
              <li
                key={`${option}-${idx}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectOption(option);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`cursor-pointer px-3.5 py-2 text-xs transition flex items-center justify-between gap-3 whitespace-nowrap ${
                  isHighlighted
                    ? "bg-[#1f6fa8] text-white font-medium"
                    : isSelected
                      ? "bg-[#f0f7fc] font-semibold text-[#1f6fa8]"
                      : "text-[#1e293b] hover:bg-[#f8fafc]"
                }`}
              >
                <span>{option}</span>
                {isSelected ? (
                  <svg
                    className={`h-3.5 w-3.5 shrink-0 ${
                      isHighlighted ? "text-white" : "text-[#1f6fa8]"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : !disabled && strict && isOpen && trimmedValue && filteredOptions.length === 0 ? (
        <div className="absolute left-0 z-[100] mt-1 min-w-full w-max max-w-[320px] rounded-xl border border-red-200 bg-[#fff5f5] p-3 text-xs text-red-700 shadow-2xl">
          ⚠️ No record matches <span className="font-bold">&ldquo;{value}&rdquo;</span>. Please select from the suggestion list.
        </div>
      ) : null}
    </div>
  );
}
