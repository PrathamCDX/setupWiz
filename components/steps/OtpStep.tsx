"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import OtpInput from "@/components/ui/OtpInput";
import StepNav from "@/components/steps/StepNav";
import { SignupFormDataType } from "@/validations/SignUp.validation";

type OtpStepProps = {
  onComplete?: () => void;
  showErrors?: boolean;
  onForward?: () => void;
  onBackward?: () => void;
};

export default function OtpStep({
  onComplete,
  showErrors,
  onForward,
  onBackward,
}: OtpStepProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SignupFormDataType>();

  const otp = watch("otp");
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (/^\d{6}$/.test(otp ?? "")) {
      firedRef.current = true;
      onComplete?.();
    }
  }, [otp, onComplete]);

  return (
    <div className="flex flex-col gap-4 mx-8 my-6">
      <h2 className="text-xl font-semibold">ENTER OTP</h2>

      <div className="flex flex-col gap-1">
        <OtpInput
          value={otp ?? ""}
          error={showErrors && !!errors.otp}
          onChange={(v) => setValue("otp", v, { shouldValidate: true })}
        />
        <div className="w-full font-light text-sm text-white/50 mt-2.5 text-end">
          Resend OTP
        </div>
        <p className="text-sm text-red-500 min-h-4 px-1">
          {showErrors && errors.otp &&
            errors.otp.message as string
          }
        </p>
      </div>
      <StepNav onForward={onForward} onBackward={onBackward} />
      <p className="text-sm text-gray-500">
        A 6-digit otp has been sent to {watch('email')}
      </p>
    </div>
  );
}
