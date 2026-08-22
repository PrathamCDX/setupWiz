"use client";

import { useRef } from "react";
import type {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
} from "react";

const LENGTH = 6;
const NON_DIGITS = /\D/g;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

export default function OtpInput({ value, onChange, error }: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focusBox = (index: number) => {
    inputsRef.current[Math.min(Math.max(index, 0), LENGTH - 1)]?.focus();
  };

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(NON_DIGITS, "");
    if (!digits) return;
    onChange(value.slice(0, index) + digits.slice(-1) + value.slice(index + 1));
    focusBox(index + 1);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
        return;
      }
      if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        focusBox(index - 1);
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(NON_DIGITS, "");
    if (!digits) return;
    onChange(digits.slice(0, LENGTH));
    focusBox(Math.min(digits.length, LENGTH - 1));
  };

  return (
    <div className="grid grid-cols-6 gap-3">
      {Array.from({ length: LENGTH }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1}`}
          value={value[index] ?? ""}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className={`rounded-lg border px-4 py-3 text-center text-2xl font-mono outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
            error ? "border-red-400" : "border-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
