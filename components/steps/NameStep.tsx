"use client";

import { useFormContext } from "react-hook-form";

import StepNav from "@/components/steps/StepNav";
import { SignupFormDataType } from "@/validations/SignUp.validation";

type NameStepProps = {
  showErrors?: boolean;
  onForward?: () => void;
  onBackward?: () => void;
};

export default function NameStep({
  showErrors,
  onForward,
  onBackward,
}: NameStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormDataType>();

  return (
    <div className="h-full min-h-0 flex flex-col  mx-8 my-6">
      <div className="flex-1 h- w-full">
        <h2 className="text-2xl font-semibold mb-4">"Name, please, for the party check!"</h2>
        <div className="font-light text-gray-400 mb-2 text-sm">
          Name
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Full name"
            className={`w-full rounded-lg border placeholder:text-gray-100/20 px-4 py-3 text-base outline-none ${errors.name ? "border-red-400 focus:border-red-400" : "border-gray-100/20 focus:border-gray-200/30"
              }`}
            {...register("name")}
          />
          {showErrors && errors.name &&
            <p className="text-sm text-red-500 min-h-4 px-1 ">
              {errors.name.message as string}
            </p>
          }
          <div className="w-full text-sm text-gray-500 mt-2 font-light tracking-wide">
            This is the name shown as on members and requests. Cannot be changed later.
          </div>
        </div>
      </div>
      <StepNav onForward={onForward} onBackward={onBackward} />
    </div>
  );
}
