import { getTranslations } from "next-intl/server";

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "survey" });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-muted/30"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">{t("thankYou")}</h1>
        <p className="text-muted-foreground mt-2">{t("responseRecorded")}</p>
      </div>
    </div>
  );
}
