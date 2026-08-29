"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import EmailStep from "@/components/steps/EmailStep";
import OtpStep from "@/components/steps/OtpStep";
import UsernameStep from "@/components/steps/UsernameStep";
import NameStep from "@/components/steps/NameStep";
import AgeStep from "@/components/steps/AgeStep";
import PronounsStep from "@/components/steps/PronounsStep";
import ReferralStep from "@/components/steps/ReferralStep";
import SignUpHeader from "./steps/SignUpHeader";
import { SignupFormDataType, signupSchema } from "@/validations/SignUp.validation";
import { SIGNUP_MUTATION_KEY } from "@/lib/queryKeys";

const STORAGE_KEY = "signup-wizard-data";

const EMPTY_VALUES: SignupFormDataType = {
    email: "",
    otp: "",
    username: "",
    name: "",
    dob: "",
    pronouns: [],
    customPronouns: "",
    referralCode: "",
    newsletter: false,
};

const FAIL_NEXT_CALL = false;

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


const stepFields: Record<number, (keyof SignupFormDataType)[]> = {
    0: ["email"],
    1: ["otp"],
    2: ["username"],
    3: ["name"],
    4: ["dob"],
    5: ["pronouns", "customPronouns"],
    6: ["referralCode"],
};

const STORAGE_FIELDS: (keyof SignupFormDataType)[] = [
    "email",
    "username",
    "name",
    "dob",
    "pronouns",
    "customPronouns",
    "referralCode",
    "newsletter",
];

const STEPS = [
    { component: EmailStep, label: "Email" },
    { component: OtpStep, label: "Verification" },
    { component: UsernameStep, label: "Username" },
    { component: NameStep, label: "Name" },
    { component: AgeStep, label: "Date of Birth" },
    { component: PronounsStep, label: "Pronouns" },
    { component: ReferralStep, label: "Referral" },
];

const SECTION_BOUNDARY = 2;

function canGoBack(step: number): boolean {
    return step !== 0 && step !== SECTION_BOUNDARY;
}

function loadStoredData(): Partial<SignupFormDataType> {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        // OTP is never restored
        delete parsed.otp;
        // Normalize legacy pronoun data to an array of strings
        if (typeof parsed.pronouns === "string") {
            parsed.pronouns = parsed.pronouns ? [parsed.pronouns] : [];
        }
        return parsed;
    } catch {
        return {};
    }
}

function saveToStorage(data: SignupFormDataType) {
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
    const [showErrors, setShowErrors] = useState(false);
    const mountedRef = useRef(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const methods = useForm<SignupFormDataType>({
        resolver: zodResolver(signupSchema),
        defaultValues: EMPTY_VALUES,
        mode: "onChange",
        reValidateMode: "onChange",

    });

    const apiCall = async () => {
        await new Promise((res) => setTimeout(res, 3000));
        if (FAIL_NEXT_CALL) throw new Error("Couldn't create your account. Try again.");
        return { ok: true };
    }

    const mutation = useMutation({
        mutationKey: SIGNUP_MUTATION_KEY,
        mutationFn: apiCall,
        onSuccess: () => {
            localStorage.removeItem(STORAGE_KEY);
            methods.reset(EMPTY_VALUES);
            setCompleted(true);
        },
    });

    // Hydrate from localStorage on mount
    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;
        const stored = loadStoredData();
        if (Object.keys(stored).length > 0) {
            methods.reset({
                ...EMPTY_VALUES,
                ...stored,
            });
        }
        setHydrated(true);
    }, [methods]);

    useEffect(() => {
        contentRef.current?.querySelector<HTMLElement>("input")?.focus();
    }, [step]);

    const goToStep = useCallback(
        (target: number) => {
            if (isAnimating) return;
            setDirection(target > step ? "forward" : "back");
            setIsAnimating(true);
            setTimeout(() => {
                setStep(target);
                setShowErrors(false);
                setIsAnimating(false);
            }, 200);
        },
        [step, isAnimating]
    );

    const handleNext = async () => {
        setShowErrors(true);
        if (step === STEPS.length - 1) {
            const valid = await methods.trigger();
            if (!valid) return;
            if (mutation.isPending) return;
            mutation.mutate();
            return;
        }

        const fields = stepFields[step];
        const valid = await methods.trigger(fields);
        if (!valid) return;

        const data = methods.getValues();
        saveToStorage(data);
        goToStep(step + 1);
    };

    const handleBack = () => {
        if (!canGoBack(step)) return;
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
        <div className="relative h-full w-full text-white ">

            {/* Step content */}
            <div ref={contentRef} className=" flex-1 flex flex-col h-full min-h-0 overflow-hidden">
                <SignUpHeader>
                    {(step >= 2) && <div className="w-full h-full flex justify-end items-center text-end font-bold text-lg tracking-wide">
                        GETTING READY
                    </div>}
                </SignUpHeader>
                <FormProvider {...methods}>
                    <div
                        className={`w-full flex flex-col transition-all flex-1 duration-200 ease-in-out ${isAnimating
                            ? direction === "forward"
                                ? "translate-x-8 opacity-0"
                                : "-translate-x-8 opacity-0"
                            : "opacity-100"
                            }`}
                    >
                        <StepComponent
                            onComplete={handleNext}
                            showErrors={showErrors}
                            onForward={handleNext}
                            onBackward={canGoBack(step) ? handleBack : undefined}
                        />
                    </div>
                </FormProvider>
            </div>
        </div>
    );
}
