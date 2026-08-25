
import { z } from "zod";
import { calculateAge } from "@/components/SignUp";

export const signupSchema = z
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

export type SignupFormDataType = z.infer<typeof signupSchema>;