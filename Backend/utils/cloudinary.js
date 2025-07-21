import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = (buffer, mimetype = "image/jpeg") => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype?.startsWith("video") ? "video" : "image";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "posts",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readable = new Readable();
    readable._read = () => { };
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

export default uploadToCloudinary;
