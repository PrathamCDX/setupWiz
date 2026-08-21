"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import EmailStep from "@/components/steps/EmailStep";
import OtpStep from "@/components/steps/OtpStep";
import NameStep from "@/components/steps/NameStep";
import AgeStep from "@/components/steps/AgeStep";
import PronounsStep from "@/components/steps/PronounsStep";

const STORAGE_KEY = "signup-wizard-data";

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export { calculateAge };

const signupSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    otp: z
      .string()
      .length(6, "Must be 6 digits")
      .regex(/^\d{6}$/, "Must be 6 digits"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    pronouns: z.string().min(1, "Please select pronouns"),
    customPronouns: z.string().optional(),
  })
  .refine(
    (data) =>
      data.pronouns !== "custom" ||
      (data.customPronouns && data.customPronouns.length > 0),
    { message: "Please enter your pronouns", path: ["customPronouns"] }
  )
  .refine(
    (data) => {
      if (!data.dob) return false;
      const age = calculateAge(data.dob);
      return age >= 13 && age <= 120;
    },
    { message: "You must be between 13 and 120 years old", path: ["dob"] }
  );

type SignupFormData = z.infer<typeof signupSchema>;

const stepFields: Record<number, (keyof SignupFormData)[]> = {
  0: ["email"],
  1: ["otp"],
  2: ["firstName", "lastName"],
  3: ["dob"],
  4: ["pronouns", "customPronouns"],
};

const STORAGE_FIELDS: (keyof SignupFormData)[] = [
  "email",
  "firstName",
  "lastName",
  "dob",
  "pronouns",
  "customPronouns",
];

const STEPS = [
  { component: EmailStep, label: "Email" },
  { component: OtpStep, label: "Verification" },
  { component: NameStep, label: "Name" },
  { component: AgeStep, label: "Date of Birth" },
  { component: PronounsStep, label: "Pronouns" },
];

function loadStoredData(): Partial<SignupFormData> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // OTP is never restored
    delete parsed.otp;
    return parsed;
  } catch {
    return {};
  }
}

function saveToStorage(data: SignupFormData) {
  const subset: Record<string, unknown> = {};
  for (const key of STORAGE_FIELDS) {
    subset[key] = data[key];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subset));
}

export default function SignUp() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isAnimating, setIsAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const mountedRef = useRef(false);

  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      otp: "",
      firstName: "",
      lastName: "",
      dob: "",
      pronouns: "",
      customPronouns: "",
    },
    mode: "onSubmit",
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const stored = loadStoredData();
    if (Object.keys(stored).length > 0) {
      methods.reset({
        email: "",
        otp: "",
        firstName: "",
        lastName: "",
        dob: "",
        pronouns: "",
        customPronouns: "",
        ...stored,
      });
    }
    setHydrated(true);
  }, [methods]);

  const goToStep = useCallback(
    (target: number) => {
      if (isAnimating) return;
      setDirection(target > step ? "forward" : "back");
      setIsAnimating(true);
      setTimeout(() => {
        setStep(target);
        setIsAnimating(false);
      }, 200);
    },
    [step, isAnimating]
  );

  const handleNext = async () => {
    const fields = stepFields[step];
    const valid = await methods.trigger(fields);
    if (!valid) return;

    if (step === STEPS.length - 1) {
      localStorage.removeItem(STORAGE_KEY);
      methods.reset({
        email: "",
        otp: "",
        firstName: "",
        lastName: "",
        dob: "",
        pronouns: "",
        customPronouns: "",
      });
      setCompleted(true);
      return;
    }

    const data = methods.getValues();
    saveToStorage(data);
    goToStep(step + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    goToStep(step - 1);
  };

  if (!hydrated) return null;

  if (completed) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
            &#10003;
          </div>
          <h2 className="text-2xl font-semibold">You&apos;re all set!</h2>
          <p className="text-gray-500">Your account has been created.</p>
        </div>
      </div>
    );
  }

  const StepComponent = STEPS[step].component;

  return (
    <div className="flex h-full flex-col">
      {/* Step indicator */}
      <div className="flex items-center justify-between px-8 pt-6 pb-2">
        <span className="text-sm text-gray-400">
          Step {step + 1} of {STEPS.length}
        </span>
        <span className="text-sm font-medium text-gray-600">
          {STEPS[step].label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mx-8 h-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step content */}
      <div className="relative flex flex-1 overflow-hidden px-8 py-6">
        <FormProvider {...methods}>
          <div
            className={`w-full transition-all duration-200 ease-in-out ${
              isAnimating
                ? direction === "forward"
                  ? "translate-x-8 opacity-0"
                  : "-translate-x-8 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <StepComponent />
          </div>
        </FormProvider>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between border-t border-gray-200 px-8 py-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
            step === 0
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          {step === STEPS.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
