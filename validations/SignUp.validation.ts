
import { z } from "zod";
import { calculateAge } from "@/components/SignUp";

export const signupSchema = z
    .object({
        email: z.string().min(1, "Please enter your email address").email("That doesn\u2019t look like a valid email address"),
        otp: z
            .string()
            .length(6, "The verification code must be exactly 6 digits")
            .regex(/^\d{6}$/, "The verification code must be exactly 6 digits"),
        username: z
            .string()
            .min(1, "Please choose a username")
            .regex(
                /^[a-zA-Z0-9_]{3,20}$/,
                "Your username must be 3\u201320 characters and can only include letters, numbers, and underscores"
            ),
        name: z.string().min(3, "Your name must be at least 3 characters"),
        dob: z.string().min(1, "Please select your date of birth"),
        pronouns: z.string().min(1, "Please select your pronouns"),
        customPronouns: z.string().optional(),
        referralCode: z
            .string()
            .regex(/^[a-zA-Z0-9]{4,16}$/, "Referral codes are 4\u201316 letters or numbers")
            .optional()
            .or(z.literal("")),
        newsletter: z.boolean(),
    })
    .refine(
        (data) =>
            data.pronouns !== "custom" ||
            (data.customPronouns && data.customPronouns.length > 0),
        { message: "Please type your pronouns", path: ["customPronouns"] }
    )
    .refine(
        (data) => {
            if (!data.dob) return false;
            const age = calculateAge(data.dob);
            return age >= 18 && age <= 120;
        },
        { message: "You must be at least 18 years old", path: ["dob"] }
    );

export type SignupFormDataType = z.infer<typeof signupSchema>;