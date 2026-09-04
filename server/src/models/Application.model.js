import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hiringManager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    aiScore: {
      type: Number,
      default: 0,
    },

    rank: {
      type: Number,
      default: null,
    },

    recommendation: {
      type: String,
      enum: ["highly_recommended", "recommended", "consider", "not_suitable"],
      default: "consider",
    },

    matchedSkills: [
      {
        type: String,
      },
    ],

    missingSkills: [
      {
        type: String,
      },
    ],

    aiSummary: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["screening", "shortlisted", "interview", "rejected", "hired"],
      default: "screening",
    },

    interviewNotes: {
      type: String,
      default: "",
    },

    interviewRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    interviewRecommendation: {
      type: String,
      enum: ["hire", "hold", "reject"],
      default: null,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index(
  {
    candidate: 1,
    job: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model("Application", applicationSchema);
