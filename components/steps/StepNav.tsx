"use client";

import Button from "@/components/ui/Button";

type StepNavProps = {
  onForward?: () => void;
  onBackward?: () => void;
  forwardLabel?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function StepNav({
  onForward,
  onBackward,
  forwardLabel = "Next",
  loading,
  disabled,
}: StepNavProps) {
  return (
    <div className="flex flex-col items-center justify-end gap-y-4 ">
      {onForward && (
        <Button onClick={onForward} label={forwardLabel} loading={loading} disabled={disabled} />
      )}
      {onBackward && (
        <Button variant="secondary" onClick={onBackward} label="Back" disabled={disabled || loading} />
      )}
    </div>
  );
}