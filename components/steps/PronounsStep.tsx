"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import Button from "@/components/ui/Button";
import type { DropdownOption } from "@/components/ui/Dropdown";
import StepNav from "@/components/steps/StepNav";
import { SignupFormDataType } from "@/validations/SignUp.validation";

const PRONOUN_OPTIONS: DropdownOption[] = [
  { value: "he", label: "He" },
  { value: "him", label: "Him" },
  { value: "she", label: "She" },
  { value: "her", label: "Her" },
  { value: "they", label: "They" },
  { value: "them", label: "Them" },
  { value: "ze", label: "Ze" },
  { value: "xe", label: "Xe" },
  { value: "ne", label: "Ne" },
  { value: "prefer-not", label: "Prefer not to say" },
  { value: "custom", label: "Custom" },
];

const PREFER_NOT_VALUE = "prefer-not";

type PronounsStepProps = {
  showErrors?: boolean;
  onForward?: () => void;
  onBackward?: () => void;
};

export default function PronounsStep({
  showErrors,
  onForward,
  onBackward,
}: PronounsStepProps) {
  const {
    watch,
    setValue,
    trigger,
    register,
    formState: { errors },
  } = useFormContext<SignupFormDataType>();

  const pronouns = watch("pronouns");
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabels = (pronouns ?? [])
    .map((v) => PRONOUN_OPTIONS.find((option) => option.value === v)?.label)
    .filter((label): label is string => Boolean(label));

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

  function openSheet() {
    setDraft(pronouns ?? []);
    setIsOpen(true);
  }

  function toggleOption(option: DropdownOption) {
    setDraft((current) => {
      let next = current.includes(option.value)
        ? current.filter((v) => v !== option.value)
        : [...current, option.value];
      if (next.includes(PREFER_NOT_VALUE)) {
        next = [PREFER_NOT_VALUE];
      } else {
        next = next.filter((v) => v !== PREFER_NOT_VALUE);
      }
      return next;
    });
  }

  function handleContinue() {
    setValue("pronouns", draft);
    if (showErrors) void trigger("pronouns");
    setIsOpen(false);
  }

  return (
    <div className="h-full min-h-0 flex flex-col mx-8 my-6">
      <div className="flex-1 w-full">
        <h2 className="text-2xl font-semibold mb-4">Your pronouns</h2>
        <p className="text-sm text-gray-500 mb-2">
          PRONOUNS
        </p>
        <div className="flex flex-col gap-2" ref={containerRef}>
          <button
            type="button"
            onClick={() => (isOpen ? setIsOpen(false) : openSheet())}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-base outline-none transition-colors ${showErrors && errors.pronouns ? "border-red-400 focus:border-red-400" : "border-gray-100/20 focus:border-gray-200/30"
              }`}
          >
            <span className={selectedLabels.length > 0 ? "text-white" : "text-gray-500"}>
              {selectedLabels.length > 0 ? selectedLabels.join(", ") : "Select pronouns"}
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
              aria-label="Select your pronouns"
              aria-modal="true"
              className={`absolute h-9/10 grid grid-rows-[1fr_auto] inset-x-0 bottom-0 rounded-t-2xl border-t border-white/10 bg-black p-6 shadow-2xl transition-transform duration-200 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"
                }`}
            >
              <div className="overflow-y-auto">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
                <p className="mb-4 text-sm font-medium text-white">
                  Select your pronouns
                </p>
                <div className="flex flex-col">
                  {PRONOUN_OPTIONS.map((option) => {
                    const isSelected = draft.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleOption(option)}
                        className="flex items-center gap-3 rounded-lg px-2 py-3 text-left text-base transition-colors hover:bg-white/10"
                      >
                        <input
                          type="checkbox"
                          tabIndex={-1}
                          readOnly
                          checked={isSelected}
                          aria-hidden="true"
                          className="appearance-none hover:cursor-pointer w-5 h-5 shrink-0 rounded border-2 border-white/20 bg-black checked:bg-white checked:border-white relative
                            after:absolute after:left-0.5 after:-top-0.5 after:text-sm after:text-black after:hidden  checked:after:block"
                        />
                        <span className={isSelected ? "text-white" : "text-gray-400"}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                  {draft.includes("custom") && (
                    <div className="flex flex-col gap-1 px-1 pt-2">
                      <input
                        type="text"
                        placeholder="Enter your pronouns"
                        className={`w-full rounded-lg border placeholder:text-gray-100/20 px-4 py-3 text-base outline-none ${showErrors && errors.customPronouns ? "border-red-400 focus:border-red-400" : "border-gray-100/20 focus:border-gray-200/30"
                          }`}
                        {...register("customPronouns")}
                      />
                      {showErrors && errors.customPronouns && (
                        <p className="text-sm text-red-500">
                          {errors.customPronouns.message as string}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-end mt-4 gap-y-4">
                <Button
                  variant="primary"
                  onClick={handleContinue}
                  disabled={draft.length === 0}
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

          {showErrors && errors.pronouns && (
            <p className="text-sm text-red-500 h-4 px-1">
              {errors.pronouns.message as string}
            </p>
          )}
          <p className="text-sm text-gray-500 mb-2">
            Select the pronouns that feel right for you
          </p>
        </div>
      </div>
      <StepNav onForward={onForward} onBackward={onBackward} />
    </div>
  );
}
