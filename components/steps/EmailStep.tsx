"use client";

import { useFormContext } from "react-hook-form";

export default function EmailStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">What&apos;s your email?</h2>
      <p className="text-sm text-gray-500">
        We&apos;ll send a verification code to this address.
      </p>
      <div className="flex flex-col gap-1">
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
