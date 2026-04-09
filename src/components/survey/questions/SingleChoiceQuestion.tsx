"use client";

interface SingleChoiceQuestionProps {
  questionId: string;
  options: string[];
  optionsAr: string[];
  value?: string;
  onChange: (value: string) => void;
  locale: string;
  placeholder?: string;
}

export function SingleChoiceQuestion({
  questionId,
  options,
  optionsAr,
  value,
  onChange,
  locale,
  placeholder,
}: SingleChoiceQuestionProps) {
  const displayOptions = locale === "ar" && optionsAr.length ? optionsAr : options;

  return (
    <div className="space-y-2" role="radiogroup">
      {displayOptions.map((opt, i) => {
        const optValue = options[i];
        const isSelected = value === optValue;
        return (
          <label
            key={i}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              type="radio"
              name={questionId}
              value={optValue}
              checked={isSelected}
              onChange={() => onChange(optValue)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isSelected ? "border-primary" : "border-muted-foreground"
              }`}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <span className="text-sm">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}
