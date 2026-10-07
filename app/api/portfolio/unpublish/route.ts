import { NextRequest } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { successResponse, handleApiError } from "@/lib/api/responses";
import { UnauthorizedError } from "@/lib/errors";

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

    portfolio.isPublic = false;
    await portfolio.save();

    return successResponse({ success: true });

  } catch (error) {
    return handleApiError(error, { error: "Failed to unpublish portfolio", status: 500 });
  }
}
