"use client";

import { useFormContext } from "react-hook-form";

export default function NameStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">What&apos;s your name?</h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="First name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">
              {errors.firstName.message as string}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Last name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">
              {errors.lastName.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
