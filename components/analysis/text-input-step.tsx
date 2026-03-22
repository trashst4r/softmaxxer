"use client";

interface TextInputStepProps {
  question: string;
  description?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextInputStep({
  question,
  description,
  placeholder,
  value,
  onChange,
}: TextInputStepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-xl font-light text-foreground">{question}</h3>
        {description && (
          <p className="text-sm text-muted leading-relaxed">{description}</p>
        )}
      </div>

      <div className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="clinical-input resize-none"
        />
        <p className="text-xs text-muted/70">
          List any active ingredients you currently use (e.g., retinol, niacinamide, salicylic acid, vitamin C). Separate with commas or new lines.
        </p>
      </div>
    </div>
  );
}
