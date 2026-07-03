import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { z } from "zod";
import { PRIMARY_DOMAINS } from "@/lib/constants";

const optionalUrlSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((val) => {
    if (!val) return val;
    return /^https?:\/\//i.test(val) ? val : `https://${val}`;
  })
  .refine((val) => {
    if (!val) return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "Please enter a valid URL");

const userPatchSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  primaryDomain: z.enum(PRIMARY_DOMAINS).optional(),
  selectedSkills: z.array(z.string()).min(1).max(8).optional(),
  bio: z.string().max(300).optional().or(z.literal("")),
  githubUrl: optionalUrlSchema,
  portfolioUrl: optionalUrlSchema,
  onboardingCompleted: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: user.toPublicJSON() });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = userPatchSchema.parse(body);

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.primaryDomain !== undefined) user.primaryDomain = data.primaryDomain;
    if (data.selectedSkills !== undefined) user.selectedSkills = data.selectedSkills;
    if (data.bio !== undefined) user.bio = data.bio;
    if (data.githubUrl !== undefined) user.githubUrl = data.githubUrl;
    if (data.portfolioUrl !== undefined) user.portfolioUrl = data.portfolioUrl;
    if (data.onboardingCompleted !== undefined) {
      user.onboardingCompleted = data.onboardingCompleted;
    }

    await user.save();

    return NextResponse.json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("[users/me] PATCH failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
