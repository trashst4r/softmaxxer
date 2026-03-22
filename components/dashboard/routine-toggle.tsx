"use client";

interface RoutineToggleProps {
  active: "am" | "pm";
  onChange: (routine: "am" | "pm") => void;
}

export function RoutineToggle({ active, onChange }: RoutineToggleProps) {
  return (
    <div className="inline-flex bg-surface-container-low p-1.5 rounded-full">
      <button
        onClick={() => onChange("am")}
        className={`px-6 py-2 rounded-full text-xs font-bold font-headline transition-all ${
          active === "am"
            ? "bg-primary text-on-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        AM
      </button>
      <button
        onClick={() => onChange("pm")}
        className={`px-6 py-2 rounded-full text-xs font-bold font-headline transition-all ${
          active === "pm"
            ? "bg-primary text-on-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        PM
      </button>
    </div>
  );
}
