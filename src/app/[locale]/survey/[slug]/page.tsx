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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Survey not found</h1>
          <p className="text-muted-foreground mt-2">
            This survey may have been closed or does not exist.
          </p>
        </div>
      </div>
    );
  }

  return <SurveyForm survey={survey} locale={locale} />;
}
