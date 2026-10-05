import { NextRequest } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { successResponse, handleApiError } from "@/lib/api/responses";
import { UnauthorizedError, NotFoundError, ForbiddenError } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new UnauthorizedError();

    const { id } = await params;
    await dbConnect();

    const interview = await Interview.findById(id).lean();
    if (!interview) throw new NotFoundError("Interview not found");
    if (interview.userId.toString() !== userId) throw new ForbiddenError();

    // Map internal _id to id
    const mappedInterview = {
      ...interview,
      id: interview._id.toString(),
      _id: undefined,
    };

    return successResponse({ interview: mappedInterview });
  } catch (error) {
    return handleApiError(error, { error: "Failed to fetch interview", status: 500 });
  }
}
