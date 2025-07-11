import multer from "multer";
import path from "path";

// Disk storage for profile photos (optional usage)
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Default: use memory storage for posts/stories (since you process buffer via sharp)
const memoryStorage = multer.memoryStorage();

const disk = multer({ storage: diskStorage });
const memory = multer({ storage: memoryStorage });

// 🟢 Export: default is memory (used in posts), disk is optional
export default Object.assign(multer({ storage: memoryStorage }), {
  disk,
  memory,
});
