import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { InterviewReport } from "@/components/interviews/InterviewReport";

export const metadata: Metadata = {
  title: "Interview Report | Proofly",
  description: "Your AI voice mock interview performance report.",
};

export default async function InterviewReportPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await props.params;

  try {
    await dbConnect();
    const interview = await Interview.findById(id).lean();
    
    if (!interview || interview.userId.toString() !== session.user.id) {
      notFound();
    }

    if (interview.status !== "completed") {
      redirect(`/interviews/${id}`);
    }

    // Map _id to id for the client component
    const mappedInterview = {
      ...interview,
      id: interview._id.toString(),
      userId: interview.userId.toString(),
      _id: undefined,
    } as any;

    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">
        <InterviewReport data={mappedInterview} />
      </main>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
