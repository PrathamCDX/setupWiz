"use client";

import { useEffect, useId, useRef, useState } from "react";

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
  variant?: "light" | "dark";
  openDirection?: "up" | "down";
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
    selected: "bg-blue-50 font-medium text-blue-600",
  },
  dark: {
    base: "text-white",
    hover: "hover:bg-white/10",
    active: "bg-white/10",
    selected: "bg-blue-500/20 font-medium text-blue-400",
  },
};

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select",
  "aria-label": ariaLabel,
  variant = "light",
  openDirection = "down",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : "";

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
    setActiveIndex(Math.max(selectedIndex, 0));
    setIsOpen(true);
  }

  function closeListbox() {
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function selectOption(option: DropdownOption) {
    onChange(option.value);
    closeListbox();
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
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          selectOption(options[activeIndex]);
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
        className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${TRIGGER_STYLES[variant]}`}
      >
        <span className={selectedLabel ? "" : PLACEHOLDER_STYLES[variant]}>
          {selectedLabel || placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 opacity-60 transition-transform ${
            isOpen ? "rotate-180" : ""
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
          className={`absolute z-20 max-h-48 w-full overflow-y-auto rounded-lg border py-1 shadow-lg ${
            openDirection === "up" ? "bottom-full mb-2" : "top-full mt-1"
          } ${PANEL_STYLES[variant]}`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            const styles = OPTION_STYLES[variant];
            return (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(option)}
                className={`cursor-pointer px-4 py-2 text-base ${styles.base} ${
                  isSelected
                    ? styles.selected
                    : isActive
                      ? styles.active
                      : styles.hover
                }`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
