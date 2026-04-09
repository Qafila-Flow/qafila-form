"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SingleChoiceQuestion } from "./questions/SingleChoiceQuestion";
import { MCQQuestion } from "./questions/MCQQuestion";
import { ScaleQuestion } from "./questions/ScaleQuestion";
import { TextQuestion } from "./questions/TextQuestion";
import { surveyApi } from "@/lib/api/survey-api";

interface SurveyQuestion {
  id: string;
  type: "SINGLE_CHOICE" | "MCQ" | "SCALE" | "TEXT";
  text: string;
  textAr?: string;
  options: string[];
  optionsAr: string[];
  required: boolean;
  sortOrder: number;
}

interface SurveyData {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  questions: SurveyQuestion[];
}

interface SurveyFormProps {
  survey: SurveyData;
  locale: string;
}

type AnswerState = {
  textValue?: string;
  selectedOptions?: string[];
  scaleValue?: number;
};

const TYPE_LABELS: Record<string, string> = {
  SINGLE_CHOICE: "Single Choice",
  MCQ: "Multiple Choice",
  SCALE: "Rating Scale",
  TEXT: "Open Answer",
};

export function SurveyForm({ survey, locale }: SurveyFormProps) {
  const t = useTranslations("survey");
  const router = useRouter();
  const isAr = locale === "ar";

  const [respondentName, setRespondentName] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sortedQuestions = [...survey.questions].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  const displayTitle = isAr && survey.titleAr ? survey.titleAr : survey.title;
  const displayDesc =
    isAr && survey.descriptionAr ? survey.descriptionAr : survey.description;

  function setAnswer(questionId: string, answer: AnswerState) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: false }));
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, boolean> = {};
    for (const q of sortedQuestions) {
      if (!q.required) continue;
      const a = answers[q.id];
      let missing = false;
      if (q.type === "TEXT") missing = !a?.textValue?.trim();
      else if (q.type === "SINGLE_CHOICE")
        missing = !a?.selectedOptions?.length;
      else if (q.type === "MCQ") missing = !a?.selectedOptions?.length;
      else if (q.type === "SCALE") missing = a?.scaleValue === undefined;
      if (missing) newErrors[q.id] = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await surveyApi.submitResponse(survey.slug, {
        respondentName: respondentName.trim() || undefined,
        respondentEmail: respondentEmail.trim() || undefined,
        answers: sortedQuestions
          .filter((q) => answers[q.id])
          .map((q) => ({
            questionId: q.id,
            textValue: answers[q.id]?.textValue,
            selectedOptions: answers[q.id]?.selectedOptions,
            scaleValue: answers[q.id]?.scaleValue,
          })),
      });
      router.push(`/${locale}/survey/${survey.slug}/thank-you`);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit");
      setSubmitting(false);
    }
  }

  const answeredCount = sortedQuestions.filter((q) => {
    const a = answers[q.id];
    if (!a) return false;
    if (q.type === "TEXT") return !!a.textValue?.trim();
    if (q.type === "SCALE") return a.scaleValue !== undefined;
    return !!a.selectedOptions?.length;
  }).length;
  const progressPct =
    sortedQuestions.length > 0
      ? Math.round((answeredCount / sortedQuestions.length) * 100)
      : 0;

  return (
    <div className="py-8 px-4 sm:px-6" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Survey hero card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary) 0%, #2d2d2a 100%)",
          }}
        >
          {/* Decorative circle accents */}
          <div
            className="absolute -top-8 -end-8 w-40 h-40 rounded-full opacity-10"
            style={{ background: "var(--color-secondary)" }}
          />
          <div
            className="absolute -bottom-10 -start-6 w-28 h-28 rounded-full opacity-10"
            style={{ background: "var(--color-secondary-2)" }}
          />

          <div className="relative px-7 py-8">
            {/* Question count badge */}
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{
                background: "rgba(235,166,86,0.15)",
                color: "var(--color-secondary)",
                border: "1px solid rgba(235,166,86,0.3)",
              }}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {sortedQuestions.length} Question
              {sortedQuestions.length !== 1 ? "s" : ""}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              {displayTitle}
            </h1>
            {displayDesc && (
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "#c8c8c8" }}
              >
                {displayDesc}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {sortedQuestions.length > 0 && (
          <div className="space-y-1.5">
            <div
              className="flex justify-between text-xs"
              style={{ color: "var(--text-gray)" }}
            >
              <span>
                {answeredCount} of {sortedQuestions.length} answered
              </span>
              <span>{progressPct}%</span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--border)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background:
                    "linear-gradient(90deg, var(--color-secondary-3), var(--color-secondary))",
                }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Respondent Info */}
          <div
            className="rounded-2xl border p-6 space-y-4"
            style={{
              background: "var(--background)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-1 h-5 rounded-full"
                style={{ background: "var(--color-secondary)" }}
              />
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-body)" }}
              >
                About You{" "}
                <span
                  className="font-normal text-xs"
                  style={{ color: "var(--text-gray)" }}
                >
                  (optional)
                </span>
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "var(--text-gray-50)" }}
                >
                  {t("yourName")}
                </label>
                <input
                  type="text"
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--input-bg)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  placeholder={t("yourName")}
                />
              </div>
              <div>
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "var(--text-gray-50)" }}
                >
                  {t("yourEmail")}
                </label>
                <input
                  type="email"
                  value={respondentEmail}
                  onChange={(e) => setRespondentEmail(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--input-bg)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  placeholder={t("yourEmail")}
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          {sortedQuestions.map((q, index) => {
            const displayText = isAr && q.textAr ? q.textAr : q.text;
            const answer = answers[q.id] ?? {};
            const hasError = errors[q.id];

            return (
              <div
                key={q.id}
                className="rounded-2xl border p-6 transition-colors"
                style={{
                  background: "var(--background)",
                  borderColor: hasError ? "#ef4444" : "var(--border)",
                  boxShadow: hasError
                    ? "0 0 0 3px rgba(239,68,68,0.08)"
                    : undefined,
                }}
              >
                {/* Question header */}
                <div className="flex items-start gap-3 mb-4">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(235,166,86,0.12)",
                      color: "var(--color-secondary)",
                    }}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium leading-snug text-sm sm:text-base"
                      style={{ color: "var(--text-dark)" }}
                    >
                      {displayText}
                      {q.required && (
                        <span className="text-red-500 ms-1">*</span>
                      )}
                    </p>
                    <span
                      className="text-xs mt-0.5 inline-block"
                      style={{ color: "var(--text-gray)" }}
                    >
                      {TYPE_LABELS[q.type]}
                    </span>
                  </div>
                </div>

                {hasError && (
                  <div
                    className="flex items-center gap-1.5 text-xs mb-3 px-3 py-2 rounded-lg"
                    style={{
                      background: "rgba(239,68,68,0.06)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.15)",
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t("requiredField")}
                  </div>
                )}

                {q.type === "SINGLE_CHOICE" && (
                  <SingleChoiceQuestion
                    questionId={q.id}
                    options={q.options}
                    optionsAr={q.optionsAr}
                    value={answer.selectedOptions?.[0]}
                    onChange={(v) => setAnswer(q.id, { selectedOptions: [v] })}
                    locale={locale}
                  />
                )}
                {q.type === "MCQ" && (
                  <MCQQuestion
                    options={q.options}
                    optionsAr={q.optionsAr}
                    value={answer.selectedOptions ?? []}
                    onChange={(v) => setAnswer(q.id, { selectedOptions: v })}
                    locale={locale}
                  />
                )}
                {q.type === "SCALE" && (
                  <ScaleQuestion
                    value={answer.scaleValue}
                    onChange={(v) => setAnswer(q.id, { scaleValue: v })}
                    locale={locale}
                  />
                )}
                {q.type === "TEXT" && (
                  <TextQuestion
                    value={answer.textValue ?? ""}
                    onChange={(v) => setAnswer(q.id, { textValue: v })}
                    locale={locale}
                    placeholder={t("enterResponse")}
                  />
                )}
              </div>
            );
          })}

          {submitError && (
            <div
              className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.06)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {submitError}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
            style={{
              background: submitting
                ? "var(--color-secondary-3)"
                : "linear-gradient(135deg, var(--color-secondary-3), var(--color-secondary))",
              color: "#ffffff",
              boxShadow: submitting
                ? "none"
                : "0 4px 14px rgba(192,131,103,0.35)",
            }}
          >
            {submitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {t("submitting")}
              </>
            ) : (
              <>
                {t("submitSurvey")}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isAr ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                  />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
