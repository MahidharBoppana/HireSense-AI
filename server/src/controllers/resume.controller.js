import { uploadOnCloudinary } from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import fs from "fs/promises";
import path from "path";

import extractTextFromPdf from "../services/pdfParser.service.js";
import extractTextFromDocx from "../services/docxParser.service.js";
import parseResume from "../services/resumeParser.service.js";

const parseResumeFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const filePath = req.file.path;

  try {
    const buffer = await fs.readFile(filePath);

    let text = "";

    if (req.file.mimetype === "application/pdf") {
      text = await extractTextFromPdf(buffer);
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await extractTextFromDocx(buffer);
    } else {
      throw new ApiError(400, "Only PDF and DOCX files are supported");
    }

    if (!text?.trim()) {
      throw new ApiError(400, "Could not extract text from the resume");
    }

    const parsedResume = parseResume(text);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          text,
          parsedResume,
        },
        "Resume parsed successfully",
      ),
    );
  } finally {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Failed to remove temporary resume:", error);
    }
  }
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const result = await uploadOnCloudinary(req.file.path);

  if (!result) {
    throw new ApiError(500, "Failed to upload resume to cloud storage");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        resumeUrl: result.secure_url,
        resumePublicId: result.public_id,
        format: result.format,
      },
      "Resume uploaded successfully",
    ),
  );
});

export { uploadResume, parseResumeFile };
