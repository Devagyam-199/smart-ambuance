import { v2 as cloudinary } from "cloudinary";
import apiError from "../Utils/apiError.utils.js";

/**
 *
 * @param {Buffer} fileBuffer
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */

const uploadToCloudinary = async (fileBuffer, options = {}) => {
  try {
    if (!fileBuffer || !Buffer.isBuffer(filebuffer)) {
      throw new apiError(400, "No valid file buffer provided");
    }

    const cloudinaryOptions = {
      folder: "resqride-app",
      resource_type: "auto",
      overwrite: true,
      ...options,
    };

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        cloudinaryOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      stream.end(fileBuffer);
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new ApiError(
      error.http_code || 500,
      error.message || "Failed to upload file to Cloudinary",
    );
  }
};
