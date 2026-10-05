import { NextRequest } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { runAICompletion } from "@/lib/ai/orchestrator";
import {
  buildInterviewReportSystemPrompt,
  interviewReportResponseSchema,
} from "@/lib/prompts/interview";
import { successResponse, handleApiError } from "@/lib/api/responses";
import { UnauthorizedError, NotFoundError, ForbiddenError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new UnauthorizedError();

    const { id } = await params;
    await dbConnect();

    const interview = await Interview.findById(id);
    if (!interview) throw new NotFoundError("Interview not found");
    if (interview.userId.toString() !== userId) throw new ForbiddenError();
    if (interview.status !== "completed") {
      throw new ValidationError("Interview is not yet complete.");
    }
    if (interview.finalReport) {
      // Already generated
      return successResponse({ report: interview.finalReport });
    }

    const systemPrompt = buildInterviewReportSystemPrompt({
      role: interview.role,
      experience: interview.experience,
      difficulty: interview.difficulty,
      turns: interview.turns.map(t => ({
        question: t.question,
        answer: t.answer,
        score: t.evaluatedScore,
      })),
    });

    const report = await runAICompletion({
      task: "interview-report",
      request: {
        systemPrompt,
        userPrompt: "Generate the final interview report based on the transcript.",
      },
      schema: interviewReportResponseSchema,
    });

    interview.finalReport = report;
    await interview.save();

    logger.info("interview.report.success", { userId, interviewId: id });

    return successResponse({ report });
  } catch (error) {
    return handleApiError(error, { error: "Failed to generate interview report", status: 500 });
  }
}
