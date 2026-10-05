import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type InterviewStatus = "setup" | "in_progress" | "completed" | "abandoned";
export type InterviewExperience = "junior" | "mid" | "senior";
export type InterviewDifficulty = "beginner" | "intermediate" | "advanced";

export interface IInterviewTurn {
  question: string;
  answer?: string;
  evaluatedScore?: number;
}

export interface IInterviewReport {
  overallScore: number;
  technicalKnowledge: number;
  communication: number;
  strengths: string[];
  improvements: string[];
}

export interface IInterview extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  role: string;
  experience: InterviewExperience;
  difficulty: InterviewDifficulty;
  questionCount: number;
  status: InterviewStatus;
  startedAt: Date;
  completedAt?: Date;
  turns: IInterviewTurn[];
  finalReport?: IInterviewReport;
}

const InterviewTurnSchema = new Schema<IInterviewTurn>(
  {
    question: { type: String, required: true },
    answer: { type: String },
    evaluatedScore: { type: Number, min: 0, max: 100 },
  },
  { _id: false }
);

const InterviewReportSchema = new Schema<IInterviewReport>(
  {
    overallScore: { type: Number, min: 0, max: 100 },
    technicalKnowledge: { type: Number, min: 0, max: 100 },
    communication: { type: Number, min: 0, max: 100 },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
  },
  { _id: false }
);

const InterviewSchema = new Schema<IInterview>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  role: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    enum: ["junior", "mid", "senior"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  questionCount: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
  },
  status: {
    type: String,
    enum: ["setup", "in_progress", "completed", "abandoned"],
    default: "setup",
    index: true,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  turns: {
    type: [InterviewTurnSchema],
    default: [],
  },
  finalReport: InterviewReportSchema,
});

InterviewSchema.index({ userId: 1, status: 1 });

const Interview: Model<IInterview> =
  (mongoose.models.Interview as Model<IInterview>) ||
  mongoose.model<IInterview>("Interview", InterviewSchema);

export default Interview;
