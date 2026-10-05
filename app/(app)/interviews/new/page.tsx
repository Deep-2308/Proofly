import { Metadata } from "next";
import { InterviewSetup } from "@/components/interviews/InterviewSetup";

export const metadata: Metadata = {
  title: "New Mock Interview | Proofly",
  description: "Configure your AI voice mock interview.",
};

export default function NewInterviewPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <InterviewSetup />
      </div>
    </main>
  );
}
