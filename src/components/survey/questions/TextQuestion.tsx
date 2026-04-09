"use client";

interface TextQuestionProps {
  value: string;
  onChange: (value: string) => void;
  locale: string;
  placeholder?: string;
}

const MAX_LENGTH = 1000;

export function TextQuestion({
  value,
  onChange,
  locale,
  placeholder,
}: TextQuestionProps) {
  return (
    <div className="space-y-1">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={MAX_LENGTH}
        rows={4}
        dir={locale === "ar" ? "rtl" : "ltr"}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
      />
      <p className="text-xs text-muted-foreground text-end">
        {value.length} / {MAX_LENGTH}
      </p>
    </div>
  );
}
