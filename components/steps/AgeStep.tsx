"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

import { calculateAge } from "@/components/SignUp";

const DOB_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDob(value: string | undefined): Date | undefined {
  if (!value || !DOB_PATTERN.test(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDob(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AgeStep() {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dob = watch("dob");
  const selectedDate = parseDob(dob);
  const age = dob ? calculateAge(dob) : null;

  const now = new Date();
  const startMonth = new Date(now.getFullYear() - 120, now.getMonth());
  const endMonth = new Date(now.getFullYear(), now.getMonth());

  // Close on outside click
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

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    setValue("dob", formatDob(date));
    void trigger("dob");
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">How old are you?</h2>
      <p className="text-sm text-gray-500">
        Select your date of birth to calculate your age. You must be at least 13
        to create an account.
      </p>
      <div className="relative flex flex-col gap-2" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
            errors.dob ? "border-red-400" : "border-gray-300"
          }`}
        >
          <span className={age !== null ? "text-gray-900" : "text-gray-400"}>
            {age !== null ? age : "Enter your age"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className={`h-5 w-5 text-gray-400 transition-transform ${
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
          <div
            role="dialog"
            aria-label="Select your date of birth"
            className="absolute top-full left-0 z-10 mt-2 w-fit max-w-full rounded-xl border border-gray-200 bg-white p-3 shadow-lg [--rdp-accent-background-color:#eff6ff] [--rdp-accent-color:#3b82f6] [--rdp-day-width:36px] [--rdp-day_button-height:34px] [--rdp-day_button-width:34px] [--rdp-day-height:36px]"
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              startMonth={startMonth}
              endMonth={endMonth}
              disabled={{ after: now }}
              captionLayout="dropdown"
              defaultMonth={selectedDate}
            />
          </div>
        )}

        {errors.dob && (
          <p className="text-sm text-red-500">
            {errors.dob.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
