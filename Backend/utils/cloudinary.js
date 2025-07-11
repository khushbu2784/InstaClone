// import { v2 as cloudinary } from "cloudinary";
// import { Readable } from "stream";
// import dotenv from "dotenv";

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// const uploadToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: "posts", resource_type: "image" },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );

//     const readable = new Readable();
//     readable._read = () => { };
//     readable.push(buffer);
//     readable.push(null);
//     readable.pipe(uploadStream);
//   });
// };

// export default uploadToCloudinary;


import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Accept MIME type to detect if image or video
// const uploadToCloudinary = (buffer, mimetype) => {
//   return new Promise((resolve, reject) => {
//     const resourceType = mimetype.startsWith("video") ? "video" : "image";

//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: "posts",
//         resource_type: resourceType, // ✅ detect image/video
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );

//     const readable = new Readable();
//     readable._read = () => {};
//     readable.push(buffer);
//     readable.push(null);
//     readable.pipe(uploadStream);
//   });
// };
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
