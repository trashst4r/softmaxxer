interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export function ProgressHeader({ currentStep, totalSteps, title }: ProgressHeaderProps) {
  const progressPercent = ((currentStep) / totalSteps) * 100;

  return (
    <div className="space-y-6 mb-10">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted uppercase tracking-widest font-medium">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-muted font-mono">
          {Math.round(progressPercent)}%
        </span>
      </div>
      <div className="h-px bg-border relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <h2 className="text-2xl font-light tracking-tight text-foreground">{title}</h2>
    </div>
  );
}
