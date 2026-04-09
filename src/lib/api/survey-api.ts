const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface SubmitAnswerPayload {
  questionId: string;
  textValue?: string;
  selectedOptions?: string[];
  scaleValue?: number;
}

export interface SubmitResponsePayload {
  respondentName?: string;
  respondentEmail?: string;
  answers: SubmitAnswerPayload[];
}

export const surveyApi = {
  getSurvey: async (slug: string) => {
    const res = await fetch(`${API_URL}/v1/surveys/public/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Survey not found");
    return res.json();
  },

  submitResponse: async (slug: string, payload: SubmitResponsePayload) => {
    const res = await fetch(`${API_URL}/v1/surveys/public/${slug}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Failed to submit response");
    }
    return res.json();
  },
};
