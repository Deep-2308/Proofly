import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { successResponse, handleApiError } from "@/lib/api/responses";
import { UnauthorizedError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const inputSchema = z.object({
  role: z.string().min(2).max(100),
  experience: z.enum(["junior", "mid", "senior"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  questionCount: z.number().int().min(1).max(20).default(5),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new UnauthorizedError();

    const body = await request.json();
    const parsed = inputSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid interview setup configuration");
    }

    await dbConnect();

    const interview = await Interview.create({
      userId,
      role: parsed.data.role,
      experience: parsed.data.experience,
      difficulty: parsed.data.difficulty,
      questionCount: parsed.data.questionCount,
      status: "setup",
      turns: [],
    });

    logger.info("interview.create", { userId, interviewId: interview._id });

    return successResponse({
      id: interview._id.toString(),
    });
  } catch (error) {
    return handleApiError(error, { error: "Failed to create interview", status: 500 });
  }
}
