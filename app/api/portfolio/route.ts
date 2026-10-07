import { NextRequest } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { successResponse, handleApiError } from "@/lib/api/responses";
import { UnauthorizedError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new UnauthorizedError();

    await dbConnect();
    const portfolio = await Portfolio.findOne({ userId }).lean();

    if (!portfolio) {
      return successResponse({ portfolio: null });
    }

    return successResponse({
      portfolio: {
        id: portfolio._id.toString(),
        slug: portfolio.slug,
        theme: portfolio.theme,
        isPublic: portfolio.isPublic,
        draftContent: portfolio.draftContent,
        publishedContent: portfolio.publishedContent,
      }
    });

  } catch (error) {
    return handleApiError(error, { error: "Failed to fetch portfolio", status: 500 });
  }
}
