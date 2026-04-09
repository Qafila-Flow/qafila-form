"use client";

interface ScaleQuestionProps {
  value?: number;
  onChange: (value: number) => void;
  locale: string;
}

const SCALE_EN = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];
const SCALE_AR = [
  "لا أوافق بشدة",
  "لا أوافق",
  "محايد",
  "أوافق",
  "أوافق بشدة",
];

const SEGMENT_COLORS = [
  "bg-red-500 hover:bg-red-600",
  "bg-orange-400 hover:bg-orange-500",
  "bg-yellow-400 hover:bg-yellow-500",
  "bg-lime-500 hover:bg-lime-600",
  "bg-green-500 hover:bg-green-600",
];

const SELECTED_COLORS = [
  "bg-red-600",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-lime-600",
  "bg-green-600",
];

export function ScaleQuestion({ value, onChange, locale }: ScaleQuestionProps) {
  const labels = locale === "ar" ? SCALE_AR : SCALE_EN;

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((v) => {
          const isSelected = value === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`flex-1 h-12 rounded text-white text-sm font-semibold transition-all ${
                isSelected
                  ? SELECTED_COLORS[v - 1] + " ring-2 ring-offset-1 ring-current scale-105"
                  : SEGMENT_COLORS[v - 1] + " opacity-70"
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{labels[0]}</span>
        <span>{labels[4]}</span>
      </div>
      {value && (
        <p className="text-sm text-center font-medium">{labels[value - 1]}</p>
      )}
    </div>
  );
}
