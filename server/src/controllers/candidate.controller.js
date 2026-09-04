import Candidate from "../models/Candidate.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import APIFeatures from "../utils/APIFeatures.js";

const createCandidate = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    resumeUrl,
    resumePublicId,
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

  if (!fullName || !email || !resumeUrl || !resumePublicId) {
    throw new ApiError(
      400,
      "Full name, email, resume URL and resume public ID are required",
    );
  }

  const existingCandidate = await Candidate.findOne({
    email: email.toLowerCase().trim(),
    isDeleted: false,
  });

  if (existingCandidate) {
    throw new ApiError(409, "A candidate with this email already exists");
  }

  const candidate = await Candidate.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    phone: phone?.trim(),
    resumeUrl,
    resumePublicId,
    skills: skills || [],
    education: education || [],
    experience: experience || [],
    projects: projects || [],
    certifications: certifications || [],
    languages: languages || [],
    github,
    linkedin,
    portfolio,
    summary: summary || "",
    totalExperience: totalExperience || 0,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, candidate, "Candidate created successfully"));
});

const getCandidates = asyncHandler(async (req, res) => {
  const features = new APIFeatures(
    Candidate.find({
      createdBy: req.user._id,
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
    createdBy: req.user._id,
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
    createdBy: req.user._id,
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
    achievements,
    languages,
    github,
    linkedin,
    portfolio,
    summary,
    totalExperience,
  } = req.body;

  // Check duplicate email only when email is changed
  if (email !== undefined) {
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail !== candidate.email) {
      const existingCandidate = await Candidate.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (existingCandidate) {
        throw new ApiError(409, "A candidate with this email already exists");
      }

      candidate.email = normalizedEmail;
    }
  }

  if (fullName !== undefined) {
    candidate.fullName = fullName.trim();
  }

  if (phone !== undefined) {
    candidate.phone = phone.trim();
  }

  if (skills !== undefined) {
    candidate.skills = skills;
  }

  if (education !== undefined) {
    candidate.education = education;
  }

  if (experience !== undefined) {
    candidate.experience = experience;
  }

  if (projects !== undefined) {
    candidate.projects = projects;
  }

  if (certifications !== undefined) {
    candidate.certifications = certifications;
  }

  if (achievements !== undefined) {
    candidate.achievements = achievements;
  }

  if (languages !== undefined) {
    candidate.languages = languages;
  }

  if (github !== undefined) {
    candidate.github = github;
  }

  if (linkedin !== undefined) {
    candidate.linkedin = linkedin;
  }

  if (portfolio !== undefined) {
    candidate.portfolio = portfolio;
  }

  if (summary !== undefined) {
    candidate.summary = summary;
  }

  if (totalExperience !== undefined) {
    candidate.totalExperience = totalExperience;
  }

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
    createdBy: req.user._id,
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

export {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
