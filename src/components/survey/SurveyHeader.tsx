"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function SurveyHeader() {
  const locale = useLocale();

  return (
    <header className="w-full">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--color-secondary-3)] via-[var(--color-secondary)] to-[var(--color-secondary-3)]" />

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <Image
              src="/Qafila-01.svg"
              alt="Qafila"
              width={110}
              height={44}
              className="h-8 w-auto transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
