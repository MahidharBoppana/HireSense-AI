import mongoose, { Schema } from "mongoose";

const candidateSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    resumePublicId: {
      type: String,
      required: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    education: [
      {
        degree: String,
        institution: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
      },
    ],

    experience: [
      {
        company: String,
        designation: String,
        startDate: Date,
        endDate: Date,
        currentlyWorking: Boolean,
        description: String,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        github: String,
        live: String,
      },
    ],

    certifications: [
      {
        name: String,
        organization: String,
        issueDate: Date,
      },
    ],

    languages: [
      {
        type: String,
      },
    ],

    github: String,

    linkedin: String,

    portfolio: String,

    summary: {
      type: String,
      default: "",
    },

    totalExperience: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

candidateSchema.index({ skills: 1 });

export default mongoose.model("Candidate", candidateSchema);
