import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

  try {
    if (!filePath) return null;

    // get file extension
    const ext = path.extname(filePath).toLowerCase();

    let options = {};

    if ([".mp4", ".mov", ".avi", ".ts", ".mkv"].includes(ext)) {
      // for video files
      options = {
        resource_type: "video",
        format: "mp4",  // convert all videos to mp4
      };
    } else {
      // for images
      options = {
        resource_type: "image",
      };
    }

    const uploadResult = await cloudinary.uploader.upload(filePath, options);

    fs.unlinkSync(filePath);
    return uploadResult.secure_url;

  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export default uploadOnCloudinary;
