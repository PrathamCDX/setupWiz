"use client";

import Button from "@/components/ui/Button";

type StepNavProps = {
  onForward?: () => void;
  onBackward?: () => void;
  forwardLabel?: string;
};

export default function StepNav({
  onForward,
  onBackward,
  forwardLabel = "Next",
}: StepNavProps) {
  return (
    <div className="flex flex-col items-center justify-end gap-y-4 pb-4">
      {onForward && <Button onClick={onForward} label={forwardLabel} />}
      {onBackward && (
        <Button variant="secondary" onClick={onBackward} label="Back" />
      )}
    </div>
  );
}
