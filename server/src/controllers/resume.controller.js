import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import extractTextFromPdf from "../services/pdfParser.service.js";
import extractTextFromDocx from "../services/docxParser.service.js";
import parseResume from "../services/resumeParser.service.js";
import Job from "../models/Job.model.js";
import Candidate from "../models/Candidate.model.js";
import Application from "../models/Application.model.js";
import mongoose from "mongoose";
import screenCandidate from "../services/aiScreening.service.js";

const uploadResume = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  const job = await Job.findOne({
    _id: jobId,
    createdBy: req.user._id,
    isDeleted: false,
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "hiresense-ai/resumes",
        resource_type: "raw",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });

  let resumeText = "";

  if (req.file.mimetype === "application/pdf") {
    resumeText = await extractTextFromPdf(req.file.buffer);
  } else {
    resumeText = await extractTextFromDocx(req.file.buffer);
  }

  const parsedResume = parseResume(resumeText);

  let candidate = await Candidate.findOne({
    email: parsedResume.email.toLowerCase(),
  });

  if (!candidate) {
    candidate = await Candidate.create({
      fullName: parsedResume.fullName,
      email: parsedResume.email,
      phone: parsedResume.phone,
      github: parsedResume.github,
      linkedin: parsedResume.linkedin,
      portfolio: parsedResume.portfolio,
      skills: parsedResume.skills,
      education: parsedResume.education,
      experience: parsedResume.experience,
      projects: parsedResume.projects,
      certifications: parsedResume.certifications,
      languages: parsedResume.languages,
      summary: parsedResume.summary,
      resumeUrl: uploadResult.secure_url,
      resumePublicId: uploadResult.public_id,
    });
  }

  const application = await Application.create({
    candidate: candidate._id,
    job: job._id,
    recruiter: req.user._id,
  });

  // Run AI Screening
  const screeningResult = screenCandidate(job, candidate);

  // Update Application with AI Results
  application.aiScore = screeningResult.aiScore;
  application.matchedSkills = screeningResult.matchedSkills;
  application.missingSkills = screeningResult.missingSkills;
  application.recommendation = screeningResult.recommendation;
  application.aiSummary = screeningResult.aiSummary;

  await application.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        candidate,
        application,
        screeningResult,
      },
      "Resume screened successfully",
    ),
  );
});

export { uploadResume };
