"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import OtpInput from "@/components/ui/OtpInput";
import StepNav from "@/components/steps/StepNav";

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
  } = useFormContext();

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
      <h2 className="text-2xl font-semibold">Verify your email</h2>
      <p className="text-sm text-gray-500">
        Enter the 6-digit code sent to your email.
      </p>
      <div className="flex flex-col gap-1">
        <OtpInput
          value={otp ?? ""}
          error={showErrors && !!errors.otp}
          onChange={(v) => setValue("otp", v, { shouldValidate: true })}
        />
        {showErrors && errors.otp && (
          <p className="text-sm text-red-500">
            {errors.otp.message as string}
          </p>
        )}
      </div>
      <StepNav onForward={onForward} onBackward={onBackward} />
    </div>
  );
}
