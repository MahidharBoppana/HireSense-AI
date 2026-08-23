import Job from "../models/Job.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import APIFeatures from "../utils/APIFeatures.js";

const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    department,
    description,
    requiredSkills,
    preferredSkills,
    experience,
    salary,
    location,
    employmentType,
    hiringManager,
    status,
  } = req.body;

  if (
    !title ||
    !company ||
    !department ||
    !description ||
    !experience ||
    !location ||
    !employmentType
  ) {
    throw new ApiError(400, "All required fields are mandatory");
  }

  const job = await Job.create({
    title: title.trim(),
    company: company.trim(),
    department: department.trim(),
    description: description.trim(),
    requiredSkills: requiredSkills || [],
    preferredSkills: preferredSkills || [],
    experience,
    salary,
    location: location.trim(),
    employmentType,
    hiringManager: hiringManager || null,
    status: status || "draft",
    createdBy: req.user._id,
  });

  const createdJob = await Job.findById(job._id)
    .populate("createdBy", "firstName lastName email")
    .populate("hiringManager", "firstName lastName email");

  return res
    .status(201)
    .json(new ApiResponse(201, createdJob, "Job created successfully"));
});

const getJobs = asyncHandler(async (req, res) => {
  const filter = {
    isDeleted: false,
  };

  switch (req.user.role) {
    case "recruiter":
      filter.createdBy = req.user._id;
      break;

    case "hiring_manager":
      filter.hiringManager = req.user._id;
      break;

    case "admin":
    case "super_admin":
      break;

    default:
      throw new ApiError(403, "Unauthorized");
  }

  const features = new APIFeatures(Job.find(filter), req.query)
    .search(["title", "company", "department", "location"])
    .filter()
    .sort()
    .paginate();

  const jobs = await features.query
    .populate("createdBy", "firstName lastName email")
    .populate("hiringManager", "firstName lastName email")
    .populate("updatedBy", "firstName lastName email");

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let filter = {
    _id: id,
    isDeleted: false,
  };

  switch (req.user.role) {
    case "recruiter":
      filter.createdBy = req.user._id;
      break;

    case "hiring_manager":
      filter.hiringManager = req.user._id;
      break;

    case "admin":
    case "super_admin":
      break;

    default:
      throw new ApiError(403, "Unauthorized");
  }

  const job = await Job.findOne(filter)
    .populate("createdBy", "firstName lastName email")
    .populate("updatedBy", "firstName lastName email")
    .populate("hiringManager", "firstName lastName email");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job fetched successfully"));
});

const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findOne({
    _id: id,
    createdBy: req.user._id,
    isDeleted: false,
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const {
    title,
    company,
    department,
    description,
    requiredSkills,
    preferredSkills,
    experience,
    salary,
    location,
    employmentType,
    hiringManager,
    status,
  } = req.body;

  if (title !== undefined) job.title = title.trim();
  if (company !== undefined) job.company = company.trim();
  if (department !== undefined) job.department = department.trim();
  if (description !== undefined) job.description = description.trim();
  if (requiredSkills !== undefined) job.requiredSkills = requiredSkills;
  if (preferredSkills !== undefined) job.preferredSkills = preferredSkills;
  if (experience !== undefined) job.experience = experience;
  if (salary !== undefined) job.salary = salary;
  if (location !== undefined) job.location = location.trim();
  if (employmentType !== undefined) job.employmentType = employmentType;
  if (hiringManager !== undefined) job.hiringManager = hiringManager;
  if (status !== undefined) job.status = status;

  job.updatedBy = req.user._id;

  await job.save();

  const updatedJob = await Job.findById(job._id)
    .populate("createdBy", "firstName lastName email")
    .populate("updatedBy", "firstName lastName email")
    .populate("hiringManager", "firstName lastName email");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});

const updateJobStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["draft", "open", "closed"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid job status");
  }

  const job = await Job.findOne({
    _id: id,
    createdBy: req.user._id,
    isDeleted: false,
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  job.status = status;
  job.updatedBy = req.user._id;

  await job.save();

  return res
    .status(200)
    .json(new ApiResponse(200, job, `Job ${status} successfully`));
});

const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findOne({
    _id: id,
    createdBy: req.user._id,
    isDeleted: false,
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  job.isDeleted = true;
  job.updatedBy = req.user._id;

  await job.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Job deleted successfully"));
});

export {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob,
};
