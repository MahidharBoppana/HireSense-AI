import Application from "../models/Application.model.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import APIFeatures from "../utils/APIFeatures.js";
import Candidate from "../models/Candidate.model.js";
import Job from "../models/Job.model.js";

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
    throw new ApiError(
      409,
      "This candidate has already been added to this job",
    );
  }

  const application = await Application.create({
    candidate,
    job,
    recruiter: req.user._id,
    hiringManager: jobExists.hiringManager || null,
    status: "screening",
  });

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
        "Application created successfully",
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

  await application.save();

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

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid application status");
  }

  let filter = {
    _id: id,
    isDeleted: false,
  };

  if (req.user.role === "recruiter") {
    filter.recruiter = req.user._id;
  }

  if (req.user.role === "hiring_manager") {
    filter.hiringManager = req.user._id;
  }

  const application = await Application.findOne(filter);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  const validTransitions = {
    screening: ["shortlisted", "rejected"],

    shortlisted: ["interview"],

    interview: ["hired", "rejected"],

    hired: [],

    rejected: [],
  };

  const currentStatus = application.status;

  if (!validTransitions[currentStatus].includes(status)) {
    throw new ApiError(
      400,
      `Cannot change status from ${currentStatus} to ${status}`,
    );
  }

  application.status = status;

  await application.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        application,
        "Application status updated successfully",
      ),
    );
});

const getAssignedApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    hiringManager: req.user._id,
  })
    .populate("candidate")
    .populate("job")
    .populate("recruiter", "-password -refreshToken")
    .sort({ updatedAt: -1 });

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
      "Only applications in interview stage can be finalized",
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
};
