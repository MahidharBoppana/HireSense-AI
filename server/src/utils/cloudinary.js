// src/utils/cloudinary.js
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Allows PDFs, Images, and Docs
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    // 👈 PRINT THE ACTUAL ERROR TO CONSOLE FOR DEBUGGING
    console.error("Cloudinary Upload Error Details:", error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
