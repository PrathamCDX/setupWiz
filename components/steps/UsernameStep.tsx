"use client";

import { useFormContext } from "react-hook-form";

export default function UsernameStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
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
        {errors.username && (
          <p className="text-sm text-red-500">
            {errors.username.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
