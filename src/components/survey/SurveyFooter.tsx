import Image from "next/image";

export function SurveyFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto">
      {/* Subtle pattern band */}
      <div className="relative overflow-hidden h-px bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent opacity-40" />

      <div className="bg-background border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col items-center gap-4">
            {/* Logo */}
            <Image
              src="/Qafila-01.svg"
              alt="Qafila"
              width={90}
              height={36}
              className="h-6 w-auto  opacity-60"
            />

            {/* Tagline */}
            <p
              className="text-xs text-center"
              style={{ color: "var(--text-gray)" }}
            >
              Powered by{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--color-secondary)" }}
              >
                Qafila
              </span>{" "}
            </p>

            {/* Divider */}
            <div
              className="w-12 h-px"
              style={{ background: "var(--color-secondary)", opacity: 0.4 }}
            />

            {/* Copyright */}
            <p className="text-xs" style={{ color: "var(--text-gray)" }}>
              © {year} Qafila. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
