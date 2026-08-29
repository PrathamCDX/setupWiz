"use client";

import { useFormContext } from "react-hook-form";

import StepNav from "@/components/steps/StepNav";
import { SignupFormDataType } from "@/validations/SignUp.validation";

type UsernameStepProps = {
  showErrors?: boolean;
  onForward?: () => void;
  onBackward?: () => void;
};

export default function UsernameStep({
  showErrors,
  onForward,
  onBackward,
}: UsernameStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormDataType>();

  return (
    <div className="h-full min-h-0 flex flex-col gap- mx-8 my-6">
      <div className="flex-1 h- w-full">
        <h2 className="text-2xl font-semibold mb-4">Create a username that fits your vibe</h2>
        {/* <p className="text-sm text-gray-500">
        3&ndash;20 characters. Letters, numbers and underscores only.
      </p> */}
        <div className="font-light text-gray-400 mb-2 text-sm">
          USERNAME
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            className={`w-full rounded-lg border border-gray-100/20 placeholder:text-gray-100/20 px-4 py-3 text-base outline-none focus:border-gray-200/30 ${errors.username ? "border-red-400" : "border-gray-100/20"
              }`}
            {...register("username")}
          />
          {showErrors && errors.username &&
            <p className="text-sm text-red-500 min-h-4 px-1">
              {errors.username.message as string}
            </p>
          }
          <div className="w-full text-sm text-gray-500 mt-2 font-light tracking-wide">
            All your superlatives and invites will come your way with this name, so make it unforgettable!
          </div>
        </div>
      </div>
      <StepNav onForward={onForward} onBackward={onBackward} />
    </div>
  );
}
