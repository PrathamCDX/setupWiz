"use client";

import { useFormContext } from "react-hook-form";

import StepNav from "@/components/steps/StepNav";

type UsernameStepProps = {
  showErrors?: boolean;
  onForward?: () => void;
  onBackward?: () => void;
};

export default function UsernameStep({
  showErrors,
  onForward,
  onBackward,
}: UsernameStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-4 mx-8 my-6">
      <h2 className="text-2xl font-semibold">Choose a username</h2>
      <p className="text-sm text-gray-500">
        3&ndash;20 characters. Letters, numbers and underscores only.
      </p>
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Username"
          autoComplete="username"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          {...register("username")}
        />
        {showErrors && errors.username && (
          <p className="text-sm text-red-500">
            {errors.username.message as string}
          </p>
        )}
      </div>
      <StepNav onForward={onForward} onBackward={onBackward} />
    </div>
  );
}
