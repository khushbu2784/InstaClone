import express from "express";
import { addStory, getAllStories,addStoryView,getStoryViewers,deleteStory} from "../controllers/storyController.js";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/add", isAuthenticated, upload.memory.single("media"), addStory);
router.get("/all", isAuthenticated, getAllStories);
router.put("/view/:storyId", isAuthenticated, addStoryView);
router.get("/viewers/:storyId", isAuthenticated, getStoryViewers);
router.delete("/delete/:storyId", isAuthenticated, deleteStory);

export default router;
