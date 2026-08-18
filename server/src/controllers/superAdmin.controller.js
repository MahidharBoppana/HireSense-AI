import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import User from "../models/User.model.js";
import Job from "../models/Job.model.js";
import Candidate from "../models/Candidate.model.js";
import Application from "../models/Application.model.js";

const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalAdmins,
    activeAdmins,
    totalRecruiters,
    activeRecruiters,
    totalHiringManagers,
    activeHiringManagers,
    totalJobs,
    totalCandidates,
    totalApplications,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments({
      role: "admin",
    }),

    User.countDocuments({
      role: "admin",
      isActive: true,
    }),

    User.countDocuments({
      role: "recruiter",
    }),

    User.countDocuments({
      role: "recruiter",
      isActive: true,
    }),

    User.countDocuments({
      role: "hiring_manager",
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

    User.find()
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users: {
          totalAdmins,
          activeAdmins,
          inactiveAdmins: totalAdmins - activeAdmins,

          totalRecruiters,
          activeRecruiters,
          inactiveRecruiters: totalRecruiters - activeRecruiters,

          totalHiringManagers,
          activeHiringManagers,
          inactiveHiringManagers: totalHiringManagers - activeHiringManagers,
        },

        recruitment: {
          totalJobs,
          totalCandidates,
          totalApplications,
        },

        recentUsers,
      },
      "Super admin dashboard fetched successfully",
    ),
  );
});

export { getDashboard };
