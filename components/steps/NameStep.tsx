"use client";

import { useFormContext } from "react-hook-form";

import StepNav from "@/components/steps/StepNav";

type NameStepProps = {
  showErrors?: boolean;
  onForward?: () => void;
  onBackward?: () => void;
};

export default function NameStep({
  showErrors,
  onForward,
  onBackward,
}: NameStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-4 mx-8 my-6">
      <h2 className="text-2xl font-semibold">What&apos;s your name?</h2>
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Full name"
          className="w-full rounded-lg border border-gray-100/20 placeholder:text-gray-100/20 px-4 py-3 text-base outline-none focus:border-gray-200/30"
          {...register("name")}
        />
        {showErrors && errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message as string}
          </p>
        )}
      </div>
      <StepNav onForward={onForward} onBackward={onBackward} />
    </div>
  );
}
