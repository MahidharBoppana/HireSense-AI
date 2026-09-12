import Application from "../models/Application.model.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import APIFeatures from "../utils/APIFeatures.js";
import Candidate from "../models/Candidate.model.js";
import Job from "../models/Job.model.js";
import screenCandidate from "../services/aiScreening.service.js";
import rankApplications from "../services/aiRanking.service.js";

const createApplication = asyncHandler(async (req, res) => {
  const { candidate, job } = req.body;

  if (!candidate || !job) {
    throw new ApiError(400, "Candidate and job are required");
  }

  const candidateExists = await Candidate.findOne({
    _id: candidate,
    isDeleted: false,
  });

  if (!candidateExists) {
    throw new ApiError(404, "Candidate not found");
  }

  const jobExists = await Job.findOne({
    _id: job,
    isDeleted: false,
  });

  if (!jobExists) {
    throw new ApiError(404, "Job not found");
  }

  const existingApplication = await Application.findOne({
    candidate,
    job,
  });

  if (existingApplication) {
    throw new ApiError(409, "Candidate has already applied to this job");
  }

  const screeningResult = await screenCandidate(jobExists, candidateExists);

  const application = await Application.create({
    candidate: candidateExists._id,
    job: jobExists._id,
    recruiter: req.user._id,

    hiringManager: jobExists.hiringManager || null,

    aiScore: screeningResult.aiScore,

    recommendation: screeningResult.recommendation,

    matchedSkills: screeningResult.matchedSkills,

    missingSkills: screeningResult.missingSkills,

    aiSummary: screeningResult.aiSummary,

    screeningStatus: "completed",

    screenedAt: new Date(),

    status: "screening",

    updatedBy: req.user._id,
  });

  await rankApplications(jobExists._id);

  const populatedApplication = await Application.findById(application._id)
    .populate("candidate")
    .populate("job")
    .populate("recruiter", "-password -refreshToken")
    .populate("hiringManager", "-password -refreshToken");

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedApplication,
        "Application created and screened successfully",
      ),
    );
});

const getApplicationsByJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const filter = {
    job: jobId,
  };

  // TEMPORARILY REMOVE recruiter/hiring-manager filtering
  // We first need to confirm the application is being fetched.

  if (req.query.search) {
    const candidates = await Candidate.find({
      isDeleted: false,
      $or: [
        {
          fullName: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ],
    }).select("_id");

    filter.candidate = {
      $in: candidates.map((candidate) => candidate._id),
    };
  }

  const features = new APIFeatures(
    Application.find(filter)
      .populate("candidate")
      .populate("job")
      .populate("recruiter", "-password -refreshToken")
      .populate("hiringManager", "-password -refreshToken"),
    req.query,
  )
    .filter()
    .sort()
    .paginate();

  const applications = await features.query;

  console.log("APPLICATION FILTER:", filter);
  console.log("APPLICATIONS FOUND:", applications);

  return res
    .status(200)
    .json(
      new ApiResponse(200, applications, "Applications fetched successfully"),
    );
});

const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const filter = {
    _id: id,
  };

  if (req.user.role === "recruiter") {
    filter.recruiter = req.user._id;
  }

  if (req.user.role === "hiring_manager") {
    filter.hiringManager = req.user._id;
  }

  const application = await Application.findOne(filter)
    .populate("candidate")
    .populate("job")
    .populate("recruiter", "-password -refreshToken")
    .populate("hiringManager", "-password -refreshToken");

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, application, "Application fetched successfully"),
    );
});

const assignHiringManager = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { hiringManagerId } = req.body;

  const application = await Application.findOne({
    _id: id,
    recruiter: req.user._id,
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  const hiringManager = await User.findOne({
    _id: hiringManagerId,
    role: "hiring_manager",
    isActive: true,
  });

  if (!hiringManager) {
    throw new ApiError(404, "Hiring manager not found");
  }

  application.hiringManager = hiringManager._id;
  application.updatedBy = req.user._id;

  await application.save();

  const job = await Job.findById(application.job);

  if (job) {
    job.hiringManager = hiringManager._id;
    job.updatedBy = req.user._id;

    await job.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, application, "Hiring manager assigned successfully"),
    );
});

const addInterviewNotes = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { interviewNotes, interviewRating, interviewRecommendation } = req.body;

  const application = await Application.findOne({
    _id: id,
    hiringManager: req.user._id,
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  application.interviewNotes = interviewNotes;
  application.interviewRating = interviewRating;
  application.interviewRecommendation = interviewRecommendation;

  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();

  await application.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        application,
        "Interview feedback submitted successfully",
      ),
    );
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "screening",
    "shortlisted",
    "interview",
    "rejected",
    "hired",
  ];

  if (!status || !allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid application status");
  }

  const application = await Application.findOne({
    _id: id,
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Recruiter workflow
  if (req.user.role === "recruiter") {
    if (application.recruiter.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You are not authorized to update this application",
      );
    }

    const allowedRecruiterTransitions = {
      screening: ["shortlisted", "rejected"],
      shortlisted: ["interview", "rejected"],
    };

    const allowedNextStatuses =
      allowedRecruiterTransitions[application.status] || [];

    if (!allowedNextStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Cannot move application from ${application.status} to ${status}`,
      );
    }
  }

  // Hiring Manager workflow
  if (req.user.role === "hiring_manager") {
    if (
      !application.hiringManager ||
      application.hiringManager.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "You are not authorized to update this application",
      );
    }

    if (application.status !== "shortlisted" || status !== "interview") {
      throw new ApiError(
        400,
        "Hiring manager can only move a shortlisted application to interview",
      );
    }
  }

  application.status = status;
  application.updatedBy = req.user._id;

  await application.save();

  const populatedApplication = await Application.findById(application._id)
    .populate("candidate")
    .populate("job")
    .populate("recruiter", "-password -refreshToken")
    .populate("hiringManager", "-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        populatedApplication,
        "Application status updated successfully",
      ),
    );
});

const getAssignedApplications = asyncHandler(async (req, res) => {
  const filter = {
    hiringManager: req.user._id,
  };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.search) {
    const candidates = await Candidate.find({
      isDeleted: false,
      $or: [
        {
          fullName: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ],
    }).select("_id");

    filter.candidate = {
      $in: candidates.map((candidate) => candidate._id),
    };
  }

  const features = new APIFeatures(
    Application.find(filter)
      .populate("candidate")
      .populate("job")
      .populate("recruiter", "-password -refreshToken")
      .populate("hiringManager", "-password -refreshToken"),
    req.query,
  )
    .filter()
    .sort()
    .paginate();

  const applications = await features.query;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        applications,
        "Assigned applications fetched successfully",
      ),
    );
});

const getAssignedApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await Application.findOne({
    _id: id,
    hiringManager: req.user._id,
  })
    .populate("candidate")
    .populate("job")
    .populate("recruiter", "-password -refreshToken")
    .populate("hiringManager", "-password -refreshToken");

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, application, "Application fetched successfully"),
    );
});

const finalizeApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["hired", "rejected"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Final status must be either 'hired' or 'rejected'",
    );
  }

  const application = await Application.findOne({
    _id: id,
    hiringManager: req.user._id,
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.status !== "interview") {
    throw new ApiError(
      400,
      "Application must be in interview stage before final decision",
    );
  }

  if (
    !application.interviewNotes?.trim() ||
    !application.interviewRating ||
    !application.interviewRecommendation
  ) {
    throw new ApiError(
      400,
      "Interview feedback must be completed before final decision",
    );
  }

  application.status = status;
  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();

  await application.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, application, `Candidate ${status} successfully`),
    );
});

const rankJobApplications = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const applications = await rankApplications(jobId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, applications, "Applications ranked successfully"),
    );
});

export {
  createApplication,
  updateApplicationStatus,
  getApplicationsByJob,
  getApplicationById,
  assignHiringManager,
  addInterviewNotes,
  getAssignedApplications,
  getAssignedApplicationById,
  finalizeApplication,
  rankJobApplications,
};
