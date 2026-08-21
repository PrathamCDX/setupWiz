"use client";

import { useFormContext } from "react-hook-form";

type PronounsStepProps = {
  showErrors?: boolean;
};

export default function PronounsStep({ showErrors }: PronounsStepProps) {
  const {
    register,
    watch,
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
          <select
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            {...register("pronouns")}
          >
            <option value="">Select pronouns</option>
            <option value="he/him">He/Him</option>
            <option value="she/her">She/Her</option>
            <option value="they/them">They/Them</option>
            <option value="prefer-not">Prefer not to say</option>
            <option value="custom">Custom</option>
          </select>
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
  );
}
