"use client";

import { useFormContext } from "react-hook-form";

export default function OtpStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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
        {errors.otp && (
          <p className="text-sm text-red-500">
            {errors.otp.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
