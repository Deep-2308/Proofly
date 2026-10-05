import { NextRequest } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { runAICompletion } from "@/lib/ai/orchestrator";
import {
  buildInterviewTurnSystemPrompt,
  interviewTurnResponseSchema,
} from "@/lib/prompts/interview";
import { successResponse, handleApiError } from "@/lib/api/responses";
import { UnauthorizedError, NotFoundError, ForbiddenError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const MAX_AUDIO_SIZE = 5 * 1024 * 1024; // 5MB limit
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// A simple in-memory rate limiter for MVP (Use Redis in true production)
const rateLimits = new Map<string, number>();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new UnauthorizedError();

    // 1. Mandatory Rate Limiting (Cooldown)
    const now = Date.now();
    const lastCall = rateLimits.get(userId) || 0;
    if (now - lastCall < 3000) {
      throw new ValidationError("Please wait a moment before speaking again. (Rate limited)");
    }
    rateLimits.set(userId, now);

    const { id } = await params;
    await dbConnect();

    // 2. State Validation & Ownership
    const interview = await Interview.findById(id);
    if (!interview) throw new NotFoundError("Interview not found");
    if (interview.userId.toString() !== userId) throw new ForbiddenError();
    if (interview.status === "completed" || interview.status === "abandoned") {
      throw new ValidationError("Interview is already finished.");
    }

    // 3. Audio Extraction & STT
    let transcript = "";
    const contentType = request.headers.get("content-type") || "";
    
    // If it's the very first turn, it's okay to have no audio. 
    // Otherwise, expect FormData with audio.
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const audioBlob = formData.get("audio") as Blob | null;
      const fallbackText = formData.get("text") as string | null; // For a11y or testing
      const turnIndexStr = formData.get("turnIndex") as string | null;
      
      // Lightweight idempotency/sync check
      if (turnIndexStr !== null) {
        const turnIndex = parseInt(turnIndexStr, 10);
        if (interview.turns.length !== turnIndex) {
          throw new ValidationError("Duplicate request or out-of-sync interview state. Please refresh.");
        }
      }

      if (audioBlob) {
        if (audioBlob.size > MAX_AUDIO_SIZE) {
          throw new ValidationError("Audio file is too large (max 5MB).");
        }
        
        // Convert Blob to File for the OpenAI SDK
        const file = new File([audioBlob], "audio.webm", { type: audioBlob.type || "audio/webm" });
        
        const transcription = await groq.audio.transcriptions.create({
          file,
          model: "whisper-large-v3-turbo",
          response_format: "json",
        });
        transcript = transcription.text;
      } else if (fallbackText) {
        transcript = fallbackText;
      }
    }

    // If it's in_progress but we got no transcript, it's an error.
    if (interview.status === "in_progress" && !transcript.trim()) {
      throw new ValidationError("Could not transcribe audio or no answer provided.");
    }

    // Update the last turn with the user's answer
    if (interview.status === "in_progress" && interview.turns.length > 0) {
      interview.turns[interview.turns.length - 1].answer = transcript;
    } else if (interview.status === "setup") {
      interview.status = "in_progress";
      interview.startedAt = new Date();
    }

    // 4. Compact Context & Build Prompt
    // Only send the last 3 turns to prevent context bloat
    const recentTurns = interview.turns.slice(-3);
    const currentQuestion = interview.turns.length > 0 ? interview.turns[interview.turns.length - 1].question : undefined;

    // We don't have evaluation summaries implemented yet, so we pass empty string
    const systemPrompt = buildInterviewTurnSystemPrompt({
      role: interview.role,
      experience: interview.experience,
      difficulty: interview.difficulty,
      totalQuestions: interview.questionCount,
      remainingQuestions: interview.questionCount - interview.turns.length,
      recentTurns,
      currentQuestion,
      userAnswer: transcript || undefined,
    });

    // 5. AI Call
    const aiResponse = await runAICompletion({
      task: "interview-turn",
      request: {
        systemPrompt,
        userPrompt: "Generate the next interview turn.",
      },
      schema: interviewTurnResponseSchema,
    });

    // 6. Persist Internal Evaluation & New Turn
    if (interview.turns.length > 0 && aiResponse.internalEvaluationOfLastAnswer !== undefined) {
      interview.turns[interview.turns.length - 1].evaluatedScore = aiResponse.internalEvaluationOfLastAnswer;
    }

    if (!aiResponse.isComplete) {
      interview.turns.push({
        question: aiResponse.nextQuestion,
      });
    } else {
      interview.status = "completed";
      interview.completedAt = new Date();
    }

    await interview.save();

    logger.info("interview.turn.success", { userId, interviewId: id, isComplete: aiResponse.isComplete });

    // 7. Return payload to client (Client handles TTS via SpeechSynthesis)
    return successResponse({
      spokenText: aiResponse.spokenText,
      nextQuestion: aiResponse.nextQuestion,
      isComplete: aiResponse.isComplete,
      transcript, // Return transcript so user sees what the AI heard
    });
  } catch (error) {
    return handleApiError(error, { error: "Failed to process interview turn", status: 500 });
  }
}
