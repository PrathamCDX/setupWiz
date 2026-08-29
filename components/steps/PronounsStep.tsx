"use client";

import { useFormContext } from "react-hook-form";

import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
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

  function handleChange(values: string[]) {
    let next = values;
    if (values.includes(PREFER_NOT_VALUE)) {
      next = [PREFER_NOT_VALUE];
    } else {
      next = values.filter((value) => value !== PREFER_NOT_VALUE);
    }
    setValue("pronouns", next);
    if (showErrors) void trigger("pronouns");
  }

  return (
    <div className="h-full min-h-0 flex flex-col mx-8 my-6">
      <div className="flex-1 w-full">
        <h2 className="text-2xl font-semibold mb-4">Your pronouns</h2>
        <p className="text-sm text-gray-500 mb-2">
          PRONOUNS
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <MultiSelectDropdown
              variant="dark"
              openDirection="down"
              aria-label="Select pronouns"
              placeholder="Select pronouns"
              options={PRONOUN_OPTIONS}
              value={pronouns ?? []}
              onChange={handleChange}
              error={showErrors && !!errors.pronouns}
            />
            {showErrors && errors.pronouns && (
              <p className="text-sm text-red-500 h-4 px-1">
                {errors.pronouns.message as string}
              </p>
            )}
          </div>
          {pronouns?.includes("custom") && (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Enter your pronouns"
                className="w-full rounded-lg border border-gray-100/20 placeholder:text-gray-100/20 px-4 py-3 text-base outline-none focus:border-gray-200/30"
                {...register("customPronouns")}
              />
              {showErrors && errors.customPronouns && (
                <p className="text-sm text-red-500">
                  {errors.customPronouns.message as string}
                </p>
              )}
            </div>
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
