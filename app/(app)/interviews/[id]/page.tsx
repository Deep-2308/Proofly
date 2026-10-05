import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { InterviewRoom } from "@/components/interviews/InterviewRoom";

export const metadata: Metadata = {
  title: "Mock Interview | Proofly",
  description: "AI voice mock interview room.",
};

export default async function InterviewPage(props: { params: Promise<{ id: string }> }) {
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

    if (interview.status === "completed") {
      redirect(`/interviews/${id}/report`);
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
        <InterviewRoom initialData={mappedInterview} />
      </main>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
