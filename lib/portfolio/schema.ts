import { z } from "zod";

export const portfolioContentSchema = z.object({
  hero: z.object({
    headline: z.string().max(100),
    subheadline: z.string().max(300),
  }),
  about: z.object({
    content: z.string().max(1000),
  }),
  skills: z.array(
    z.object({
      name: z.string().max(50),
      evidence: z.string().max(200).optional(),
    })
  ).max(20),
  projects: z.array(
    z.object({
      projectId: z.string().optional(),
      title: z.string().max(100),
      description: z.string().max(1000),
      technologies: z.array(z.string().max(50)).max(20),
      liveUrl: z.string().url().max(300).optional(),
      repositoryUrl: z.string().url().max(300).optional(),
    })
  ).max(10),
  evidence: z.array(
    z.object({
      title: z.string().max(100),
      description: z.string().max(500),
      url: z.string().url().max(300).optional(),
      badgeSummary: z.string().max(200).optional(),
    })
  ).max(10),
  experience: z.array(
    z.object({
      role: z.string().max(100),
      company: z.string().max(100),
      duration: z.string().max(100),
      description: z.string().max(1000),
    })
  ).max(10).optional().default([]),
  education: z.array(
    z.object({
      degree: z.string().max(100),
      institution: z.string().max(100),
      year: z.string().max(50),
    })
  ).max(5).optional().default([]),
  contact: z.object({
    github: z.string().url().max(300).optional().or(z.literal('')),
    linkedin: z.string().url().max(300).optional().or(z.literal('')),
    website: z.string().url().max(300).optional().or(z.literal('')),
  }).optional(),
});

export type PortfolioContent = z.infer<typeof portfolioContentSchema>;
