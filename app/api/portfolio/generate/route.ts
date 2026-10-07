import { NextRequest } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { aggregatePortfolioData } from "@/lib/portfolio/aggregate";
import { runAICompletion } from "@/lib/ai/orchestrator";
import { portfolioContentSchema } from "@/lib/portfolio/schema";
import { generatePortfolioSystemPrompt, generatePortfolioUserPrompt } from "@/lib/prompts/portfolio";
import { successResponse, handleApiError } from "@/lib/api/responses";
import { UnauthorizedError } from "@/lib/errors";
import { logger } from "@/lib/logger";

// In-memory rate limiting (matches existing project patterns if any)
const rateLimitCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000 * 60; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(userId: string) {
  const now = Date.now();
  const record = rateLimitCache.get(userId);

  if (!record) {
    rateLimitCache.set(userId, { count: 1, lastReset: now });
    return true;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitCache.set(userId, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new UnauthorizedError();

    if (!checkRateLimit(userId)) {
      return handleApiError(new Error("Rate limit exceeded. Try again later."), { error: "Rate limit exceeded", status: 429 });
    }

    await dbConnect();

    // Aggregate data securely
    const contextData = await aggregatePortfolioData(userId);

    // Call AI Orchestrator (No streaming for MVP as requested)
    const generatedContent = await runAICompletion({
      task: "portfolio-generation",
      request: {
        systemPrompt: generatePortfolioSystemPrompt,
        userPrompt: generatePortfolioUserPrompt(contextData),
      },
      schema: portfolioContentSchema,
    });

    // Generate slug from user name or generic
    const slugBase = contextData.user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "portfolio";
    let slug = slugBase;
    let counter = 1;
    
    // Find existing portfolio
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      // Find unique slug
      while (await Portfolio.exists({ slug })) {
        slug = `${slugBase}-${counter}`;
        counter++;
      }

      portfolio = await Portfolio.create({
        userId,
        slug,
        draftContent: generatedContent,
      });
    } else {
      portfolio.draftContent = generatedContent;
      await portfolio.save();
    }

    logger.info("portfolio.generate", { userId, portfolioId: portfolio._id });

    return successResponse({
      portfolio: {
        id: portfolio._id.toString(),
        slug: portfolio.slug,
        draftContent: portfolio.draftContent,
        isPublic: portfolio.isPublic,
      }
    });

  } catch (error) {
    return handleApiError(error, { error: "Failed to generate portfolio", status: 500 });
  }
}
