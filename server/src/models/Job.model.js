import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    preferredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    experience: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },

    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    employmentType: {
      type: String,
      enum: [
        "full_time",
        "part_time",
        "contract",
        "internship",
        "remote",
        "hybrid",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "open", "closed"],
      default: "draft",
    },

    hiringManager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

export default mongoose.model("Job", jobSchema);
