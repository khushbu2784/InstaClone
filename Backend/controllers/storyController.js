import uploadToCloudinary from "../utils/cloudinary.js"; 
import { Story } from "../models/storyModel.js";
import { User } from "../models/userModel.js"

export const addStory = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    // ✅ Use file.buffer instead of file.path
    const result = await uploadToCloudinary(file.buffer, file.mimetype);
    const mimeType = file.mimetype;
    const mediaType = mimeType.startsWith("video") ? "video" : "image";

    const story = await Story.create({
      user: req.id,
      mediaUrl: result.secure_url,
      mediaType,
    });

    const allowed = ["image/jpeg", "image/png", "video/mp4", "video/webm"];
    if (!allowed.includes(file.mimetype)) {
      return res.status(400).json({ success: false, message: "Unsupported file type" });
    }

    res.status(201).json({ success: true, story, message: "Story uploaded successfully" });
  } catch (error) {
    console.error("Error uploading story:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.id).select(
      "userName profilePicture blockedUsers blockedBy following"
    );

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please re-login.",
      });
    }

    const blockedUsers = currentUser.blockedUsers || [];
    const blockedBy = currentUser.blockedBy || [];
    const myFollowing = currentUser.following || [];

    // ✅ Get all stories excluding blocked users
    const stories = await Story.find({
      user: {
        $nin: [...blockedUsers, ...blockedBy],
      },
    })
      .populate("user", "userName profilePicture")
      .sort({ createdAt: -1 });

    // ✅ Group stories by user
    const grouped = {};
    for (const s of stories) {
      if (!s.user || !s.user._id) continue;

      const uid = s.user._id.toString();
      if (!grouped[uid]) {
        grouped[uid] = { user: s.user, stories: [] };
      }
      grouped[uid].stories.push(s);
    }

    const groupedArray = Object.values(grouped);

    res.status(200).json({
      success: true,
      stories: groupedArray,
      myId: req.id,
      myProfile: {
        userName: currentUser.userName,
        profilePicture: currentUser.profilePicture,
      },
      myFollowing: myFollowing.map((id) => id.toString()),
    });
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.status(500).json({ success: false, message: "Failed to fetch stories" });
  }
};

export const addStoryView = async (req, res) => {
  try {
    const { storyId } = req.params;
    const viewerId = req.id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    // ✅ Don't add the owner as viewer
    if (
      story.user.toString() !== viewerId &&
      !story.viewedBy.includes(viewerId)
    ) {
      story.viewedBy.push(viewerId);
      await story.save();
    }

    res.status(200).json({ success: true, message: "View recorded" });
  } catch (error) {
    console.error("Error adding story view:", error);
    res.status(500).json({ success: false, message: "Failed to record view" });
  }
};

export const getStoryViewers = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId)
      .populate("viewedBy", "userName profilePicture");

    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    if (story.user.toString() !== req.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, viewers: story.viewedBy });
  } catch (error) {
    console.error("Error fetching viewers:", error);
    res.status(500).json({ success: false, message: "Failed to fetch viewers" });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    if (story.user.toString() !== req.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Story.findByIdAndDelete(storyId);

    res.status(200).json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ success: false, message: "Failed to delete story" });
  }
};