"use client";

import { useFormContext } from "react-hook-form";

import StepNav from "@/components/steps/StepNav";

type EmailStepProps = {
  showErrors?: boolean;
  onForward?: () => void;
  onBackward?: () => void;
};

export default function EmailStep({
  showErrors,
  onForward,
  onBackward,
}: EmailStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();


  return (
    <div className="flex flex-col gap-4 mx-8 my-6">
      <h2 className="text-2xl font-[650] tracking-wider">Enter your email</h2>
      {/* <p className="text-sm text-gray-500">
        We&apos;ll send a verification code to this address.
      </p> */}
      <div className="flex flex-col gap-1">
        <input
          type="email"
          placeholder="EMAIL"
          className={`w-full rounded-lg border placeholder:text-gray-100/20 px-4 py-3 text-base outline-none ${errors.email ? "border-red-400 focus:border-red-400" : "border-gray-100/20 focus:border-gray-200/30"
            }`}
          {...register("email")}
        />
        <p className="text-sm text-red-500 h-4 px-1">
          {showErrors && errors.email && (
            errors.email.message as string
          )}
        </p>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-500">
        <input
          type="checkbox"
          // className="h-4 w-4 appearance-none  bg-gray-100 checked:bg-gray-500 checked:rounded rounded border border-gray-300 accent-gray-600 hover:cursor-pointer"
          className="appearance-none hover:cursor-pointer w-5 h-5 rounded border-2 border-gray-100 bg-gray-100 checked:bg-gray-500 checked:border-gray-500 relative  
          after:text-white after:text-sm after:absolute after:hidden checked:after:block after:left-0.5 after:-top-0.5"
          {...register("newsletter")}
        />
        Subscribe to our newsletter
      </label>
      <StepNav onForward={onForward} onBackward={onBackward} />
    </div>
  );
}
