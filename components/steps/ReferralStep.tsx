"use client";

import { useFormContext } from "react-hook-form";
import { useMutationState } from "@tanstack/react-query";

import StepNav from "@/components/steps/StepNav";
import { SignupFormDataType } from "@/validations/SignUp.validation";
import { SIGNUP_MUTATION_KEY } from "@/lib/queryKeys";

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
  } = useFormContext<SignupFormDataType>();

  const [{ isPending, error }] = useMutationState({
    filters: { mutationKey: SIGNUP_MUTATION_KEY },
    select: (state) => ({
      isPending: state.state.status === "pending",
      error: state.state.error ?? null,
    }),
  });

  const submitError = error?.message;

  return (
    <div className="h-full min-h-0 flex flex-col  mx-8 my-6">
      <div className="flex-1 w-full ">
        <h2 className="text-2xl font-semibold mb-4">Have a referral code?</h2>
        <div className="text-xl relative font-semibold  tracking-wide text-gray-100 mb-4">
          KINDNESS = GOOD <span className="text-[#8e28d7]">HAIR</span> DAY SIP IN? <span>CHIP</span> IN GHOSTING IS
          FOR <span className="text-[#8e28d7]">HALLOWEEN</span>. OUTFITS LOUD, <span className="text-[#8e28d7]">INTENTIONS</span> CLEAR.
          JOINING FREE. HOSTING <span className="text-[#8e28d7]">ALSO</span>  FREE.
          EARLLY IS <span className="text-[#8e28d7]">ICONINC</span>. YES <span className="text-[#8e28d7]">SPELLING</span> MISTAKE
          <div className="absolute bg-linear-to-b to-black/60 from-transparent h-full w-full top-0 ">

          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">{`ENTER INVITE CODE (Optional)`}</p>
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Referral code"
            className="w-full rounded-lg border border-gray-100/20 placeholder:text-gray-100/20 px-4 py-3 text-base outline-none focus:border-gray-200/30"
            {...register("referralCode")}
          />
          {showErrors && errors.referralCode && (
            <p className="text-sm text-red-500 h-4 px-1">
              {errors.referralCode.message as string}
            </p>
          )}
          <p className="text-sm text-gray-500 mb-2">
            Enter invite code and get upto +30 HVTs
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {submitError && (
          <p className="mx-8 text-sm text-red-500">{submitError}</p>
        )}
        <StepNav
          onForward={onForward}
          onBackward={onBackward}
          forwardLabel="Let's Go"
          loading={isPending}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
