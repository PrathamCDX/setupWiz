"use client";

import { useFormContext } from "react-hook-form";

import Dropdown, { type DropdownOption } from "@/components/ui/Dropdown";
import StepNav from "@/components/steps/StepNav";

const PRONOUN_OPTIONS: DropdownOption[] = [
  { value: "he/him", label: "He/Him" },
  { value: "she/her", label: "She/Her" },
  { value: "they/them", label: "They/Them" },
  { value: "prefer-not", label: "Prefer not to say" },
  { value: "custom", label: "Custom" },
];

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
  } = useFormContext();

  const pronouns = watch("pronouns");

  return (
    <div className="flex flex-col gap-4 mx-8 my-6">
      <h2 className="text-2xl font-semibold">Your pronouns</h2>
      <p className="text-sm text-gray-500">
        How would you like to be addressed?
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Dropdown
            variant="dark"
            openDirection="down"
            aria-label="Select pronouns"
            placeholder="Select pronouns"
            options={PRONOUN_OPTIONS}
            value={pronouns ?? ""}
            onChange={(value) => {
              setValue("pronouns", value);
              if (showErrors) void trigger("pronouns");
            }}
          />
          {showErrors && errors.pronouns && (
            <p className="text-sm text-red-500">
              {errors.pronouns.message as string}
            </p>
          )}
        </div>
        {pronouns === "custom" && (
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
      </div>
      <StepNav onForward={onForward} onBackward={onBackward} />
    </div>
  );
}
