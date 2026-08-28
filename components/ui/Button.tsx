"use client";

import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "custom";

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_STYLES =
  "mx-8 w-full rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors";

const VARIANT_STYLES: Record<ButtonVariant, { enabled: string; disabled: string }> = {
  primary: {
    enabled: "border-white/10 text-gray-800 hover:text-gray-200 bg-white hover:bg-white/10 hover:cursor-pointer",
    disabled: "border-white/5 text-gray-500 cursor-not-allowed",
  },
  secondary: {
    enabled: "border-white/10 text-white hover:text-gray-800 hover:bg-gray-100 hover:cursor-pointer",
    disabled: "border-white/10 text-gray-300 cursor-not-allowed",
  },
  custom: {
    enabled: "",
    disabled: ""
  }
};

export default function Button({
  label,
  variant = "primary",
  className,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const stateStyles = disabled ? VARIANT_STYLES[variant].disabled : VARIANT_STYLES[variant].enabled;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${variant === "custom" ? "" : BASE_STYLES} ${stateStyles} ${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {label}
    </button>
  );
}

export function LandingButtonSignUp() {
  const router = useRouter();

  return (
    <Button
      label="Continue"
      variant="custom"
      onClick={() => router.push('/signup')}
      className=" font-semibold mb-16 text-lg mx-8 w-full rounded-lg border px-6 py-1.5  transition-colors border-white/10 text-gray-800 hover:text-gray-200 bg-white hover:bg-white/10 hover:cursor-pointer"
    />
  )
}
