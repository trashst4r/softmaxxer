"use client";

interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

interface QuestionStepProps {
  question: string;
  description?: string;
  options: QuestionOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;
}

export function QuestionStep({
  question,
  description,
  options,
  value,
  onChange,
  multiSelect = false,
}: QuestionStepProps) {
  const handleSingleChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  const handleMultiChange = (selectedValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(selectedValue)) {
      onChange(currentValues.filter((v) => v !== selectedValue));
    } else {
      onChange([...currentValues, selectedValue]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-xl font-light text-foreground">{question}</h3>
        {description && (
          <p className="text-sm text-muted leading-relaxed">{description}</p>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = multiSelect
            ? Array.isArray(value) && value.includes(option.value)
            : value === option.value;

          return (
            <label
              key={option.value}
              className={`block cursor-pointer transition-all border rounded-sm ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/30"
              }`}
            >
              <input
                type={multiSelect ? "checkbox" : "radio"}
                name={question}
                value={option.value}
                checked={isSelected}
                onChange={() =>
                  multiSelect
                    ? handleMultiChange(option.value)
                    : handleSingleChange(option.value)
                }
                className="sr-only"
              />
              <div className="flex items-start gap-4 p-4">
                {/* Fixed-width selector column */}
                <div className="flex-shrink-0 w-5 pt-0.5">
                  {multiSelect ? (
                    // Checkbox visual
                    <div
                      className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 6L5 9L10 3"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  ) : (
                    // Radio visual
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-primary"
                          : "border-muted"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                  )}
                </div>

                {/* Flexible content column */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="font-medium text-sm text-foreground leading-snug">
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-muted leading-relaxed">
                      {option.description}
                    </div>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
