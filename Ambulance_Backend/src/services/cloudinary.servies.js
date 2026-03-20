import { v2 as storage } from "cloudinary";
import fs from "fs";
import apiError from "../Utils/apiError.utils";

storage.config({
  cloud_name: process.env.Cloudinary_Cloud_Name,
  api_key: process.env.Cloudinary_Api_Key,
  api_secret: process.env.Cloudinary_Api_Secret,
});

const uploadFileCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new apiError(
        400,
        "No file found with this path. Source:(cloudinary.servies)",
      );
    }
    const fileStore = await storage.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded successfully on cloudinary");
    return fileStore;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new apiError(500, "error while uploading file to cloudinary");
  }
};

export default uploadFileCloudinary;
