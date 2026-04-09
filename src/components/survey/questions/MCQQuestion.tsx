"use client";

interface MCQQuestionProps {
  options: string[];
  optionsAr: string[];
  value: string[];
  onChange: (value: string[]) => void;
  locale: string;
}

export function MCQQuestion({
  options,
  optionsAr,
  value,
  onChange,
  locale,
}: MCQQuestionProps) {
  const displayOptions = locale === "ar" && optionsAr.length ? optionsAr : options;

  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  }

  return (
    <div className="space-y-2">
      {displayOptions.map((opt, i) => {
        const optValue = options[i];
        const isSelected = value.includes(optValue);
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
              type="checkbox"
              value={optValue}
              checked={isSelected}
              onChange={() => toggle(optValue)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                isSelected ? "border-primary bg-primary" : "border-muted-foreground"
              }`}
            >
              {isSelected && (
                <svg viewBox="0 0 12 10" className="w-3 h-3 text-white fill-current">
                  <polyline points="1,5 4,8 11,1" strokeWidth="1.5" stroke="currentColor" fill="none" />
                </svg>
              )}
            </div>
            <span className="text-sm">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}
