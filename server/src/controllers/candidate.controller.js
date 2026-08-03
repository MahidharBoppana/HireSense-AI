import Candidate from "../models/Candidate.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import APIFeatures from "../utils/APIFeatures.js";

const getCandidates = asyncHandler(async (req, res) => {
  const features = new APIFeatures(
    Candidate.find({
      isDeleted: false,
    }),
    req.query,
  )
    .search(["fullName", "email", "skills"])
    .filter()
    .sort()
    .paginate();

  const candidates = await features.query;

  return res
    .status(200)
    .json(new ApiResponse(200, candidates, "Candidates fetched successfully"));
});

const getCandidateById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const candidate = await Candidate.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "Candidate fetched successfully"));
});

const updateCandidate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const candidate = await Candidate.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  const {
    fullName,
    email,
    phone,
    skills,
    education,
    experience,
    projects,
    certifications,
    languages,
    github,
    linkedin,
    portfolio,
    summary,
    totalExperience,
  } = req.body;

  if (fullName !== undefined) candidate.fullName = fullName.trim();
  if (email !== undefined) candidate.email = email.toLowerCase().trim();
  if (phone !== undefined) candidate.phone = phone.trim();

  if (skills !== undefined) candidate.skills = skills;
  if (education !== undefined) candidate.education = education;
  if (experience !== undefined) candidate.experience = experience;
  if (projects !== undefined) candidate.projects = projects;
  if (certifications !== undefined) candidate.certifications = certifications;
  if (languages !== undefined) candidate.languages = languages;

  if (github !== undefined) candidate.github = github;
  if (linkedin !== undefined) candidate.linkedin = linkedin;
  if (portfolio !== undefined) candidate.portfolio = portfolio;
  if (summary !== undefined) candidate.summary = summary;
  if (totalExperience !== undefined)
    candidate.totalExperience = totalExperience;

  candidate.updatedBy = req.user._id;

  await candidate.save();

  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "Candidate updated successfully"));
});

const deleteCandidate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const candidate = await Candidate.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  candidate.isDeleted = true;
  candidate.updatedBy = req.user._id;

  await candidate.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Candidate deleted successfully"));
});

export { getCandidates, getCandidateById, updateCandidate, deleteCandidate };
