"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { DropdownOption } from "@/components/ui/Dropdown";

type MultiSelectDropdownProps = {
  options: DropdownOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  "aria-label"?: string;
  variant?: "light" | "dark";
  openDirection?: "up" | "down";
  error?: boolean;
};

const TRIGGER_STYLES = {
  light: "border-gray-300 bg-white text-gray-900",
  dark: "border-white/20 bg-black text-white",
};

const PLACEHOLDER_STYLES = {
  light: "text-gray-400",
  dark: "text-gray-500",
};

const PANEL_STYLES = {
  light: "border-gray-200 bg-white",
  dark: "border-white/10 bg-black",
};

const OPTION_STYLES = {
  light: {
    base: "text-gray-900",
    hover: "hover:bg-blue-50",
    active: "bg-blue-50",
  },
  dark: {
    base: "text-white",
    hover: "hover:bg-white/10",
    active: "bg-white/10",
  },
};

export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select",
  "aria-label": ariaLabel,
  variant = "light",
  openDirection = "down",
  error = false,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedValues = Array.isArray(value) ? value : [];

  const selectedLabels = selectedValues
    .map((v) => options.find((option) => option.value === v)?.label)
    .filter((label): label is string => Boolean(label));

  const summary =
    selectedLabels.length > 0 ? selectedLabels.join(", ") : "";

  // Close on outside click / Escape
  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Keep the active option visible while navigating with the keyboard
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen, listboxId]);

  function openListbox() {
    setActiveIndex(-1);
    setIsOpen(true);
  }

  function closeListbox() {
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function toggleOption(option: DropdownOption) {
    const isSelected = selectedValues.includes(option.value);
    const next = isSelected
      ? selectedValues.filter((v) => v !== option.value)
      : [...selectedValues, option.value];
    onChange(next);
  }

  function handleTriggerKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>
  ) {
    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openListbox();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          toggleOption(options[activeIndex]);
        }
        break;
      case "Tab":
        closeListbox();
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-activedescendant={
          isOpen && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        onClick={() => (isOpen ? closeListbox() : openListbox())}
        onKeyDown={handleTriggerKeyDown}
        className={` border flex w-full items-center justify-between rounded-lg  px-4 py-3 text-left text-base  transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${error ? "border-red-400" : TRIGGER_STYLES[variant]}`}
      >
        <span className={summary ? "" : PLACEHOLDER_STYLES[variant]}>
          {summary || placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 opacity-60 transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          aria-multiselectable="true"
          className={`absolute z-20 max-h-48 w-full overflow-y-auto rounded-lg border py-1 shadow-lg ${openDirection === "up" ? "bottom-full mb-2" : "top-full mt-1"
            } ${PANEL_STYLES[variant]}`}
        >
          {options.map((option, index) => {
            const isSelected = selectedValues.includes(option.value);
            const isActive = index === activeIndex;
            const styles = OPTION_STYLES[variant];
            return (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleOption(option)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-base ${styles.base} ${isActive ? styles.active : styles.hover
                  }`}
              >
                <input
                  type="checkbox"
                  tabIndex={-1}
                  readOnly
                  checked={isSelected}
                  aria-hidden="true"
                  className="appearance-none hover:cursor-pointer w-5 h-5 shrink-0 rounded border-2 border-gray-100 bg-gray-100 checked:bg-gray-500 checked:border-gray-500 relative
                    after:absolute after:left-0.5 after:-top-0.5 after:text-sm after:text-white after:hidden after:content-['✓'] checked:after:block"
                />
                <span>{option.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
