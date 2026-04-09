import { getTranslations } from "next-intl/server";

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "survey" });
  const isAr = locale === "ar";

  return (
    <div
      className="flex-1 flex items-center justify-center py-16 px-4"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-md w-full">
        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-1.5 w-full"
            style={{
              background:
                "linear-gradient(90deg, var(--color-secondary-3), var(--color-secondary))",
            }}
          />

          <div className="px-8 py-10 text-center">
            {/* Animated success icon */}
            <div
              className="relative w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(235,166,86,0.1)" }}
            >
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px solid rgba(235,166,86,0.25)",
                  animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
              {/* Inner glow */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-secondary-3), var(--color-secondary))",
                  boxShadow: "0 8px 24px rgba(192,131,103,0.4)",
                }}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-dark)" }}
            >
              {t("thankYou")}
            </h1>

            {/* Body */}
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: "var(--text-gray)" }}
            >
              {t("responseRecorded")}
            </p>

            {/* Divider with icon */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex-1 h-px"
                style={{ background: "var(--border)" }}
              />
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--color-secondary)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <div
                className="flex-1 h-px"
                style={{ background: "var(--border)" }}
              />
            </div>

            {/* Branding note */}
            <p className="text-xs" style={{ color: "var(--text-gray)" }}>
              Powered by{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--color-secondary)" }}
              >
                Qafila
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Inline keyframe for the ping animation */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
