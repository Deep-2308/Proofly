import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPortfolioContent {
  hero: {
    headline: string;
    subheadline: string;
  };
  about: {
    content: string;
  };
  skills: {
    name: string;
    evidence?: string;
  }[];
  projects: {
    projectId?: string;
    title: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    repositoryUrl?: string;
  }[];
  evidence: {
    title: string;
    description: string;
    url?: string;
    badgeSummary?: string;
  }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  contact?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface IPortfolio extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  slug: string;
  theme: string;
  isPublic: boolean;
  draftContent?: IPortfolioContent;
  publishedContent?: IPortfolioContent;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioContentSchema = new Schema<IPortfolioContent>(
  {
    hero: {
      headline: { type: String, default: "" },
      subheadline: { type: String, default: "" },
    },
    about: {
      content: { type: String, default: "" },
    },
    skills: [
      {
        name: { type: String, required: true },
        evidence: { type: String },
      },
    ],
    projects: [
      {
        projectId: { type: String },
        title: { type: String, required: true },
        description: { type: String, required: true },
        technologies: { type: [String], default: [] },
        liveUrl: { type: String },
        repositoryUrl: { type: String },
      },
    ],
    evidence: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        url: { type: String },
        badgeSummary: { type: String },
      },
    ],
    experience: [
      {
        role: { type: String, required: true },
        company: { type: String, required: true },
        duration: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: String, required: true },
      },
    ],
    contact: {
      github: { type: String },
      linkedin: { type: String },
      website: { type: String },
    },
  },
  { _id: false }
);

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    theme: {
      type: String,
      default: "default",
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    draftContent: {
      type: PortfolioContentSchema,
    },
    publishedContent: {
      type: PortfolioContentSchema,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio: Model<IPortfolio> =
  (mongoose.models.Portfolio as Model<IPortfolio>) ||
  mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);

export default Portfolio;
