import express from "express";
import { addStory, getAllStories } from "../controllers/storyController.js";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/add", isAuthenticated, upload.memory.single("media"), addStory);
router.get("/all", isAuthenticated, getAllStories);

export default router;
