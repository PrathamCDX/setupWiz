"use client";

import { useFormContext } from "react-hook-form";

import StepNav from "@/components/steps/StepNav";

type ReferralStepProps = {
  showErrors?: boolean;
  onForward?: () => void;
  onBackward?: () => void;
};

export default function ReferralStep({
  showErrors,
  onForward,
  onBackward,
}: ReferralStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-4 mx-8 my-6">
      <h2 className="text-2xl font-semibold">Have a referral code?</h2>
      <p className="text-sm text-gray-500">Optional &mdash; you can skip this.</p>
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Referral code"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          {...register("referralCode")}
        />
        {showErrors && errors.referralCode && (
          <p className="text-sm text-red-500">
            {errors.referralCode.message as string}
          </p>
        )}
      </div>
      <StepNav
        onForward={onForward}
        onBackward={onBackward}
        forwardLabel="Submit"
      />
    </div>
  );
}
