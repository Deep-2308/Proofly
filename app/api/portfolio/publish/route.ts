import { NextRequest } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { successResponse, handleApiError } from "@/lib/api/responses";
import { UnauthorizedError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new UnauthorizedError();

    await dbConnect();

    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return handleApiError(new Error("Portfolio not found"), { error: "Portfolio not found", status: 404 });
    }

    if (!portfolio.draftContent) {
      throw new ValidationError("No content to publish. Generate a portfolio first.");
    }

    portfolio.publishedContent = portfolio.draftContent;
    portfolio.isPublic = true;
    portfolio.publishedAt = new Date();
    
    await portfolio.save();

    logger.info("portfolio.publish", { userId, portfolioId: portfolio._id });

    return successResponse({ success: true, slug: portfolio.slug });

  } catch (error) {
    return handleApiError(error, { error: "Failed to publish portfolio", status: 500 });
  }
}
