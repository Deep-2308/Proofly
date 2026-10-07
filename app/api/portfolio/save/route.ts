import { NextRequest } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { portfolioContentSchema } from "@/lib/portfolio/schema";
import { successResponse, handleApiError } from "@/lib/api/responses";
import { UnauthorizedError, ValidationError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new UnauthorizedError();

    const body = await request.json();
    const parsed = portfolioContentSchema.safeParse(body.content);
    if (!parsed.success) {
      throw new ValidationError("Invalid portfolio content");
    }

    await dbConnect();

    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return handleApiError(new Error("Portfolio not found"), { error: "Portfolio not found", status: 404 });
    }

    portfolio.draftContent = parsed.data;
    await portfolio.save();

    return successResponse({
      success: true,
      draftContent: portfolio.draftContent,
    });

  } catch (error) {
    return handleApiError(error, { error: "Failed to save portfolio", status: 500 });
  }
}
