import { SurveyHeader } from "@/components/survey/SurveyHeader";
import { SurveyFooter } from "@/components/survey/SurveyFooter";

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background-secondary)" }}>
      <SurveyHeader />
      <main className="flex-1">{children}</main>
      <SurveyFooter />
    </div>
  );
}
