"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

type OtpStepProps = {
  onComplete?: () => void;
  showErrors?: boolean;
};

export default function OtpStep({ onComplete, showErrors }: OtpStepProps) {
  const {
    register,
    watch,
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
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Verify your email</h2>
      <p className="text-sm text-gray-500">
        Enter the 6-digit code sent to your email.
      </p>
      <div className="flex flex-col gap-1">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          {...register("otp")}
        />
        {showErrors && errors.otp && (
          <p className="text-sm text-red-500">
            {errors.otp.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
