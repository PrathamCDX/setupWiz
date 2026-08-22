"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import EmailStep from "@/components/steps/EmailStep";
import OtpStep from "@/components/steps/OtpStep";
import UsernameStep from "@/components/steps/UsernameStep";
import NameStep from "@/components/steps/NameStep";
import AgeStep from "@/components/steps/AgeStep";
import PronounsStep from "@/components/steps/PronounsStep";
import ReferralStep from "@/components/steps/ReferralStep";
import Button from "@/components/ui/Button";
import Image from "next/image";
import SignUpHeader from "./steps/SignUpHeader";

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
        username: z
            .string()
            .min(1, "Username is required")
            .regex(
                /^[a-zA-Z0-9_]{3,20}$/,
                "3\u201320 characters; letters, numbers and _ only"
            ),
        name: z.string().min(3, "Name must be at least 3 characters long"),
        dob: z.string().min(1, "Date of birth is required"),
        pronouns: z.string().min(1, "Please select pronouns"),
        customPronouns: z.string().optional(),
        referralCode: z
            .string()
            .regex(/^[a-zA-Z0-9]{4,16}$/, "4\u201316 letters or numbers")
            .optional()
            .or(z.literal("")),
        newsletter: z.boolean(),
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
            return age >= 18 && age <= 120;
        },
        { message: "You must be atleast 18", path: ["dob"] }
    );

type SignupFormData = z.infer<typeof signupSchema>;

const stepFields: Record<number, (keyof SignupFormData)[]> = {
    0: ["email"],
    1: ["otp"],
    2: ["username"],
    3: ["name"],
    4: ["dob"],
    5: ["pronouns", "customPronouns"],
    6: ["referralCode"],
};

const STORAGE_FIELDS: (keyof SignupFormData)[] = [
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
    const [showErrors, setShowErrors] = useState(false);
    const mountedRef = useRef(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const methods = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            otp: "",
            username: "",
            name: "",
            dob: "",
            pronouns: "",
            customPronouns: "",
            referralCode: "",
            newsletter: false,
        },
        mode: "onChange",
        reValidateMode: "onChange",

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
                username: "",
                name: "",
                dob: "",
                pronouns: "",
                customPronouns: "",
                referralCode: "",
                newsletter: false,
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
        const fields = stepFields[step];
        const valid = await methods.trigger(fields);
        if (!valid) return;

        if (step === STEPS.length - 1) {
            localStorage.removeItem(STORAGE_KEY);
            methods.reset({
                email: "",
                otp: "",
                username: "",
                name: "",
                dob: "",
                pronouns: "",
                customPronouns: "",
                referralCode: "",
                newsletter: false,
            });
            setCompleted(true);
            return;
        }



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
        <div className="relative h-full grid grid-rows-2 ">

            {/* Step content */}
            <div ref={contentRef} className=" flex-1 overflow-hidden">
                <SignUpHeader />
                <FormProvider {...methods}>
                    <div
                        className={`w-full transition-all duration-200 ease-in-out ${isAnimating
                            ? direction === "forward"
                                ? "translate-x-8 opacity-0"
                                : "-translate-x-8 opacity-0"
                            : "opacity-100"
                            }`}
                    >
                        <StepComponent onComplete={handleNext} showErrors={showErrors} />
                    </div>
                </FormProvider>
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col items-center justify-end gap-y-4 px-8 py-4">
                <Button
                    onClick={handleNext}
                    label={step === STEPS.length - 1 ? "Submit" : "Next"}
                />
                <Button
                    variant="secondary"
                    onClick={handleBack}
                    disabled={!canGoBack(step)}
                    label="Back"
                />
            </div>
        </div>
    );
}
