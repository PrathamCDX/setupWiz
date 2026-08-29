"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import Button from "@/components/ui/Button";
import StepNav from "@/components/steps/StepNav";
import { calculateAge } from "@/components/SignUp";

const DOB_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type AgeStepProps = {
  showErrors?: boolean;
  onForward?: () => void;
  onBackward?: () => void;
};

function parseDob(value: string | undefined): Date | undefined {
  if (!value || !DOB_PATTERN.test(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysInMonth(month: number, year: number): number {
  if (!month) return 31;
  return new Date(year, month, 0).getDate();
}

export default function AgeStep({
  showErrors,
  onForward,
  onBackward,
}: AgeStepProps) {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [validatedOnce, setValidatedOnce] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dob = watch("dob");
  const selectedDate = parseDob(dob);
  const age = dob ? calculateAge(dob) : null;

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 120;

  const monthNum = month ? Number(month) : 0;
  const yearNum = year ? Number(year) : 0;
  const maxDay = daysInMonth(monthNum, yearNum || currentYear);

  const isDayValid = day !== "" && Number(day) >= 1 && Number(day) <= maxDay;
  const isMonthValid = month !== "" && Number(month) >= 1 && Number(month) <= 12;
  const isYearValid =
    year !== "" && Number(year) >= minYear && Number(year) <= currentYear;
  const canContinue = isDayValid && isMonthValid && isYearValid;

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

  const openSheet = () => {
    if (selectedDate) {
      setDay(String(selectedDate.getDate()));
      setMonth(String(selectedDate.getMonth() + 1));
      setYear(String(selectedDate.getFullYear()));
    } else {
      setDay("");
      setMonth("");
      setYear("");
    }
    setIsOpen(true);
  };

  const handleContinue = () => {
    if (!canContinue) return;
    setValue(
      "dob",
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    );
    setValidatedOnce(true);
    void trigger("dob");
    setIsOpen(false);
  };

  return (
    <div className="h-full min-h-0 flex flex-col  mx-8 my-6">
      <div className="flex-1 w-full">
        <h2 className="text-2xl font-semibold mb-4">How many years have you been partying?</h2>
        <p className="text-sm text-gray-500 mb-2">
          AGE
        </p>
        <div className=" flex flex-col gap-2" ref={containerRef}>
          <button
            type="button"
            onClick={() => (isOpen ? setIsOpen(false) : openSheet())}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-base outline-none transition-colors focus:border-gray-200/30 ${errors.dob ? "border-red-400" : "border-gray-100/20"
              }`}
          >
            <span className={age !== null ? "text-gray-400" : "text-gray-400"}>
              {age !== null ? age : "Enter your age"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                }`}
            >
              <path
                fillRule="evenodd"
                d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Bottom sheet */}
          <div
            className={`absolute overflow-y-hidden inset-0 z-10 transition-opacity duration-200 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            inert={!isOpen}
          >
            <div
              className="absolute inset-0 bg-black/10 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            <div
              role="dialog"
              aria-label="Enter your date of birth"
              aria-modal="true"
              className={`absolute h-125 grid grid-rows-[1fr_auto] inset-x-0 bottom-0 rounded-t-2xl border-t border-white/10 bg-black p-6 shadow-2xl transition-transform duration-200 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"
                }`}
            >
              <div className="">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
                <p className="mb-4 text-sm font-medium text-white">
                  Enter your date of birth
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={maxDay}
                      placeholder="Day"
                      aria-label="Day"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className={`w-full rounded-lg border bg-black px-4 py-3 text-base text-white outline-none transition-colors focus:border-gray-200/30 placeholder:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${(day.length == 0 || isDayValid) ? "border-white/20" : "border-red-400"
                        }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={12}
                      placeholder="Month"
                      aria-label="Month"
                      value={month}
                      onChange={(e) => {
                        const m = e.target.value;
                        setMonth(m);
                        const max = daysInMonth(m ? Number(m) : 0, yearNum || currentYear);
                        if (day !== "" && Number(day) > max) {
                          setDay(String(max));
                        }
                      }}
                      className={`w-full rounded-lg border bg-black px-4 py-3 text-base text-white outline-none transition-colors focus:border-gray-200/30 placeholder:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${(month.length == 0 || isMonthValid) ? "border-white/20" : "border-red-400"
                        }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={minYear}
                      max={currentYear}
                      placeholder="Year"
                      aria-label="Year"
                      value={year}
                      onChange={(e) => {
                        const y = e.target.value;
                        setYear(y);
                        const max = daysInMonth(monthNum, y ? Number(y) : 0);
                        if (day !== "" && Number(day) > max) {
                          setDay(String(max));
                        }
                      }}
                      className={`w-full rounded-lg border bg-black px-4 py-3 text-base text-white outline-none transition-colors focus:border-gray-200/30 placeholder:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${(year.length == 0 || isYearValid) ? "border-white/20" : "border-red-400"
                        }`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-end gap-y-4">
                <Button
                  variant="primary"
                  onClick={handleContinue}
                  disabled={!canContinue}
                  label="Continue"
                />
                <Button
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                  label="Back"
                />
              </div>
            </div>
          </div>

          {(showErrors || validatedOnce) && errors.dob && (
            <p className="text-sm text-red-500 h-4 px-1">
              {errors.dob.message as string}
            </p>
          )}
          <div className="text-sm text-gray-500 ">
            We need your age to verify you are eligible and help others know who they are connecting with

          </div>
        </div>
      </div>
      <StepNav onForward={onForward} onBackward={onBackward} />
    </div>
  );
}
