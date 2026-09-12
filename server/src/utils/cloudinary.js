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

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return response;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);

    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
