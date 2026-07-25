import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.model.js";

const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalAdmins,
    activeAdmins,
    totalRecruiters,
    activeRecruiters,
    totalHiringManagers,
    activeHiringManagers,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ role: "admin", isActive: true }),

    User.countDocuments({ role: "recruiter" }),
    User.countDocuments({ role: "recruiter", isActive: true }),

    User.countDocuments({ role: "hiring_manager" }),
    User.countDocuments({ role: "hiring_manager", isActive: true }),

    User.find()
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalAdmins,
        activeAdmins,
        inactiveAdmins: totalAdmins - activeAdmins,

        totalRecruiters,
        activeRecruiters,
        inactiveRecruiters: totalRecruiters - activeRecruiters,

        totalHiringManagers,
        activeHiringManagers,
        inactiveHiringManagers: totalHiringManagers - activeHiringManagers,

        recentUsers,
      },
      "Dashboard fetched successfully",
    ),
  );
});

export { getDashboard };
