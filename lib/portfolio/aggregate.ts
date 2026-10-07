/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import User, { IUser } from "@/models/User";
import Project, { IProject } from "@/models/Project";
import Challenge, { IChallenge } from "@/models/Challenge";
import Interview, { IInterview } from "@/models/Interview";

export interface PortfolioGenerationContext {
  user: {
    name: string;
    bio?: string;
    githubUrl?: string;
    website?: string;
    primaryDomain?: string;
    selectedSkills: string[];
  };
  projects: {
    id: string;
    title: string;
    description: string;
    status: string;
    tags: string[];
    analysisSummary?: string;
  }[];
  challenges: {
    skillName: string;
    domain: string;
    difficulty: string;
    title: string;
    score: number;
    badgeSummary: string;
    submissionUrl?: string;
  }[];
  interviews: {
    role: string;
    experience: string;
    difficulty: string;
    overallScore: number;
    strengths: string[];
  }[];
}

export async function aggregatePortfolioData(userId: string): Promise<PortfolioGenerationContext> {
  const user = await User.findById(userId).lean() as any;
  if (!user) throw new Error("User not found");

  const projects = await Project.find({
    ownerId: new Types.ObjectId(userId),
    status: { $in: ["building", "completed"] },
  }).lean() as any[];

  const challenges = await Challenge.find({
    userId: new Types.ObjectId(userId),
    status: "evaluated",
    "evaluation.passed": true,
  }).lean() as any[];

  const interviews = await Interview.find({
    userId: new Types.ObjectId(userId),
    status: "completed",
  }).lean() as any[];

  return {
    user: {
      name: user.name,
      bio: user.bio,
      githubUrl: user.githubUrl,
      website: user.portfolioUrl,
      primaryDomain: user.primaryDomain,
      selectedSkills: user.selectedSkills || [],
    },
    projects: projects.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      status: p.status,
      tags: p.tags || [],
      analysisSummary: p.aiAnalysis?.summary,
    })),
    challenges: challenges.map((c) => ({
      skillName: c.skillName,
      domain: c.domain,
      difficulty: c.difficulty,
      title: c.challengeContent.title,
      score: c.evaluation.score,
      badgeSummary: c.evaluation.badgeSummary,
      submissionUrl: c.submission?.url,
    })),
    interviews: interviews.map((i) => ({
      role: i.role,
      experience: i.experience,
      difficulty: i.difficulty,
      overallScore: i.finalReport.overallScore,
      strengths: i.finalReport.strengths || [],
    })),
  };
}
