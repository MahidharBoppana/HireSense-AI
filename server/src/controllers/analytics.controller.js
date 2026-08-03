import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import User from "../models/User.model.js";
import Job from "../models/Job.model.js";
import Candidate from "../models/Candidate.model.js";
import Application from "../models/Application.model.js";

const getSuperAdminDashboard = asyncHandler(async (req, res) => {
  const [admins, recruiters, hiringManagers, jobs, candidates, applications] =
    await Promise.all([
      User.countDocuments({
        role: "admin",
        isActive: true,
      }),

      User.countDocuments({
        role: "recruiter",
        isActive: true,
      }),

      User.countDocuments({
        role: "hiring_manager",
        isActive: true,
      }),

      Job.countDocuments({
        isDeleted: false,
      }),

      Candidate.countDocuments({
        isDeleted: false,
      }),

      Application.countDocuments(),
    ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users: {
          admins,
          recruiters,
          hiringManagers,
        },
        jobs,
        candidates,
        applications,
      },
      "Super admin dashboard fetched successfully",
    ),
  );
});

const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    recruiters,
    hiringManagers,
    activeJobs,
    totalApplications,
    shortlisted,
    interview,
    hired,
    rejected,
  ] = await Promise.all([
    User.countDocuments({
      role: "recruiter",
      isActive: true,
    }),

    User.countDocuments({
      role: "hiring_manager",
      isActive: true,
    }),

    Job.countDocuments({
      status: "open",
      isDeleted: false,
    }),

    Application.countDocuments(),

    Application.countDocuments({
      status: "shortlisted",
    }),

    Application.countDocuments({
      status: "interview",
    }),

    Application.countDocuments({
      status: "hired",
    }),

    Application.countDocuments({
      status: "rejected",
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        recruiters,
        hiringManagers,
        activeJobs,
        totalApplications,

        hiringPipeline: {
          shortlisted,
          interview,
          hired,
          rejected,
        },
      },
      "Admin dashboard fetched successfully",
    ),
  );
});

const getRecruiterDashboard = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  const myJobs = await Job.find({
    createdBy: recruiterId,
    isDeleted: false,
  }).select("_id");

  const jobIds = myJobs.map((job) => job._id);

  const [
    totalJobs,
    totalApplications,
    screening,
    shortlisted,
    interview,
    hired,
    rejected,
  ] = await Promise.all([
    Job.countDocuments({
      createdBy: recruiterId,
      isDeleted: false,
    }),

    Application.countDocuments({
      job: { $in: jobIds },
    }),

    Application.countDocuments({
      job: { $in: jobIds },
      status: "screening",
    }),

    Application.countDocuments({
      job: { $in: jobIds },
      status: "shortlisted",
    }),

    Application.countDocuments({
      job: { $in: jobIds },
      status: "interview",
    }),

    Application.countDocuments({
      job: { $in: jobIds },
      status: "hired",
    }),

    Application.countDocuments({
      job: { $in: jobIds },
      status: "rejected",
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalJobs,
        totalApplications,
        pipeline: {
          screening,
          shortlisted,
          interview,
          hired,
          rejected,
        },
      },
      "Recruiter dashboard fetched successfully",
    ),
  );
});

const getHiringManagerDashboard = asyncHandler(async (req, res) => {
  const hiringManagerId = req.user._id;

  const [
    assignedApplications,
    screening,
    shortlisted,
    interview,
    hired,
    rejected,
  ] = await Promise.all([
    Application.countDocuments({
      hiringManager: hiringManagerId,
    }),

    Application.countDocuments({
      hiringManager: hiringManagerId,
      status: "screening",
    }),

    Application.countDocuments({
      hiringManager: hiringManagerId,
      status: "shortlisted",
    }),

    Application.countDocuments({
      hiringManager: hiringManagerId,
      status: "interview",
    }),

    Application.countDocuments({
      hiringManager: hiringManagerId,
      status: "hired",
    }),

    Application.countDocuments({
      hiringManager: hiringManagerId,
      status: "rejected",
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        assignedApplications,

        pipeline: {
          screening,
          shortlisted,
          interview,
          hired,
          rejected,
        },
      },
      "Hiring manager dashboard fetched successfully",
    ),
  );
});

export { getSuperAdminDashboard, getAdminDashboard, getRecruiterDashboard, getHiringManagerDashboard };
