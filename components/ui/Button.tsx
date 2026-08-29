"use client";

import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "custom";

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  className?: string;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_STYLES =
  "mx-8 w-full rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors";

const VARIANT_STYLES: Record<ButtonVariant, { enabled: string; disabled: string }> = {
  primary: {
    enabled: "border-white/10 transition-colors duration-300 text-gray-800 hover:text-gray-200 bg-white hover:bg-white/10 hover:cursor-pointer",
    disabled: "border-white/5 text-gray-500 cursor-not-allowed transition-colors duration-300",
  },
  secondary: {
    enabled: "border-white border-2 text-white transition-colors duration-300 hover:text-gray-200 hover:bg-white/20 hover:border-white/30 hover:cursor-pointer",
    disabled: "border-white/10 text-gray-300 cursor-not-allowed transition-colors duration-300",
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
  loading,
  type = "button",
  ...rest
}: ButtonProps) {
  const stateStyles = disabled || loading ? VARIANT_STYLES[variant].disabled : VARIANT_STYLES[variant].enabled;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${variant === "custom" ? "" : BASE_STYLES} ${stateStyles} ${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent align-middle" />
      )}
      <span className="align-middle">{loading ? "Submitting..." : label}</span>
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
