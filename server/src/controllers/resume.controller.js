import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import extractTextFromPdf from "../services/pdfParser.service.js";
import extractTextFromDocx from "../services/docxParser.service.js";
import parseResume from "../services/resumeParser.service.js";

const uploadResume = asyncHandler(async (req, res) => {
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

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        ...parsedResume,
        resumeUrl: uploadResult.secure_url,
        resumePublicId: uploadResult.public_id,
      },
      "Resume parsed successfully",
    ),
  );
});

export { uploadResume };
