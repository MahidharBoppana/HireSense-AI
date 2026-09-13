import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import User from "../models/User.model.js";
import Job from "../models/Job.model.js";
import Candidate from "../models/Candidate.model.js";
import Application from "../models/Application.model.js";

const getSuperAdminAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,

    admins,
    recruiters,
    hiringManagers,

    totalJobs,
    openJobs,
    draftJobs,
    closedJobs,

    totalCandidates,
    totalApplications,

    screening,
    shortlisted,
    interview,
    hired,
    rejected,
  ] = await Promise.all([
    // Users
    User.countDocuments({
      role: { $ne: "super_admin" },
    }),

    User.countDocuments({
      role: { $ne: "super_admin" },
      isActive: true,
    }),

    User.countDocuments({
      role: { $ne: "super_admin" },
      isActive: false,
    }),

    // User statistics
    User.countDocuments({
      role: "admin",
    }),

    User.countDocuments({
      role: "recruiter",
    }),

    User.countDocuments({
      role: "hiring_manager",
    }),

    // Recruitment statistics
    Job.countDocuments({
      isDeleted: false,
    }),

    Job.countDocuments({
      status: "open",
      isDeleted: false,
    }),

    Job.countDocuments({
      status: "draft",
      isDeleted: false,
    }),

    Job.countDocuments({
      status: "closed",
      isDeleted: false,
    }),

    Candidate.countDocuments({
      isDeleted: false,
    }),

    Application.countDocuments(),

    // Recruitment pipeline
    Application.countDocuments({
      status: "screening",
    }),

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
        userStatistics: {
          totalUsers,
          activeUsers,
          inactiveUsers,

          admins,
          recruiters,
          hiringManagers,
        },

        recruitmentStatistics: {
          totalJobs,
          openJobs,
          draftJobs,
          closedJobs,

          totalCandidates,
          totalApplications,
        },

        hiringPipeline: {
          screening,
          shortlisted,
          interview,
          hired,
          rejected,
        },
      },
      "Platform analytics fetched successfully",
    ),
  );
});

const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    recruiters,
    hiringManagers,
    activeJobs,
    totalApplications,
    screening,
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

    Application.countDocuments({
      status: "screening",
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
          screening,
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
    activeJobs,
    totalCandidates,
    totalApplications,
    screening,
    shortlisted,
    interview,
    hired,
    rejected,
    recommendationStats,
    scoreStats,
    applicationsByJob,
  ] = await Promise.all([
    // Jobs
    Job.countDocuments({
      createdBy: recruiterId,
      isDeleted: false,
    }),

    Job.countDocuments({
      createdBy: recruiterId,
      isDeleted: false,
      status: "open",
    }),

    // Candidates
    Candidate.countDocuments({
      createdBy: recruiterId,
      isDeleted: false,
    }),

    // Applications
    Application.countDocuments({
      recruiter: recruiterId,
    }),

    // Pipeline
    Application.countDocuments({
      recruiter: recruiterId,
      status: "screening",
    }),

    Application.countDocuments({
      recruiter: recruiterId,
      status: "shortlisted",
    }),

    Application.countDocuments({
      recruiter: recruiterId,
      status: "interview",
    }),

    Application.countDocuments({
      recruiter: recruiterId,
      status: "hired",
    }),

    Application.countDocuments({
      recruiter: recruiterId,
      status: "rejected",
    }),

    // AI Recommendations
    Application.aggregate([
      {
        $match: {
          recruiter: recruiterId,
        },
      },
      {
        $group: {
          _id: "$recommendation",
          count: { $sum: 1 },
        },
      },
    ]),

    // AI Scores
    Application.aggregate([
      {
        $match: {
          recruiter: recruiterId,
          aiScore: { $gte: 0 },
        },
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$aiScore" },
          highestScore: { $max: "$aiScore" },
          lowestScore: { $min: "$aiScore" },
        },
      },
    ]),

    // Applications by Job
    Application.aggregate([
      {
        $match: {
          recruiter: recruiterId,
          job: { $in: jobIds },
        },
      },
      {
        $group: {
          _id: "$job",
          applications: { $sum: 1 },
          averageScore: { $avg: "$aiScore" },
        },
      },
      {
        $sort: {
          applications: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $unwind: "$job",
      },
      {
        $project: {
          _id: 1,
          title: "$job.title",
          company: "$job.company",
          applications: 1,
          averageScore: {
            $round: ["$averageScore", 2],
          },
        },
      },
    ]),
  ]);

  const pipeline = {
    screening,
    shortlisted,
    interview,
    hired,
    rejected,
  };

  const aiRecommendations = {
    highly_recommended: 0,
    recommended: 0,
    consider: 0,
    not_suitable: 0,
  };

  recommendationStats.forEach((item) => {
    if (item._id in aiRecommendations) {
      aiRecommendations[item._id] = item.count;
    }
  });

  const score = scoreStats[0] || {
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        overview: {
          totalJobs,
          activeJobs,
          totalCandidates,
          totalApplications,
        },

        pipeline,

        aiRecommendations,

        aiScores: {
          average: Number((score.averageScore || 0).toFixed(2)),
          highest: Number((score.highestScore || 0).toFixed(2)),
          lowest: Number((score.lowestScore || 0).toFixed(2)),
        },

        applicationsByJob,
      },
      "Recruiter analytics fetched successfully",
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

export {
  getSuperAdminAnalytics,
  getAdminDashboard,
  getRecruiterDashboard,
  getHiringManagerDashboard,
};
