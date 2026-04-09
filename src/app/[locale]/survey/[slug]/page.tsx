import { SurveyForm } from "@/components/survey/SurveyForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getSurvey(slug: string) {
  try {
    const res = await fetch(`${API_URL}/v1/surveys/public/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function SurveyPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const survey = await getSurvey(slug);

  if (!survey) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(235,166,86,0.1)" }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--color-secondary)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--text-dark)" }}>
            Survey not found
          </h1>
          <p className="text-sm" style={{ color: "var(--text-gray)" }}>
            This survey may have been closed or does not exist.
          </p>
        </div>
      </div>
    );
  }

  return <SurveyForm survey={survey} locale={locale} />;
}
