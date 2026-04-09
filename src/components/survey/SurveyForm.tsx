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
  const displayDesc = isAr && survey.descriptionAr ? survey.descriptionAr : survey.description;

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
      else if (q.type === "SINGLE_CHOICE") missing = !a?.selectedOptions?.length;
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

  return (
    <div
      className="min-h-screen bg-muted/30 py-10 px-4"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-2xl mx-auto">
        {/* Survey Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{displayTitle}</h1>
          {displayDesc && (
            <p className="text-muted-foreground mt-2">{displayDesc}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Respondent Info */}
          <div className="bg-background rounded-xl border p-6 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">{t("yourName")}</label>
              <input
                type="text"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={t("yourName")}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">{t("yourEmail")}</label>
              <input
                type="email"
                value={respondentEmail}
                onChange={(e) => setRespondentEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={t("yourEmail")}
              />
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
                className={`bg-background rounded-xl border p-6 ${
                  hasError ? "border-destructive" : ""
                }`}
              >
                <p className="font-medium mb-1">
                  <span className="text-muted-foreground me-2">{index + 1}.</span>
                  {displayText}
                  {q.required && <span className="text-destructive ms-1">*</span>}
                </p>

                {hasError && (
                  <p className="text-xs text-destructive mb-3">{t("requiredField")}</p>
                )}

                <div className="mt-3">
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
              </div>
            );
          })}

          {submitError && (
            <p className="text-sm text-destructive text-center">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {submitting ? t("submitting") : t("submitSurvey")}
          </button>
        </form>
      </div>
    </div>
  );
}
