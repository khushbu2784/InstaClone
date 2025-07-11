import express from "express";
import isAuthenticate from "../middlewares/isAuthenticate.js"
import upload from "../middlewares/multer.js"
import { addComment, addNewPost, bookmarkPost, deletePost, getAllPost, getCommentsOfPost,deleteComment, getUserPost, likePost, disLikePost, updatePostCaption, getExplorePosts } from "../controllers/postController.js"

const router = express.Router();

router.post("/addpost", isAuthenticate, upload.memory.single('image'), addNewPost);     // Create
router.get("/all", isAuthenticate, getAllPost);                                   // All posts
router.get("/user/:userId", isAuthenticate, getUserPost);                         // User posts
router.put("/:id", isAuthenticate, updatePostCaption);

router.post("/:id/comment", isAuthenticate, addComment);                          // Add comment
router.delete("/comments/:id", isAuthenticate, deleteComment);                    // Delete comment    
router.get("/:id/comments", isAuthenticate, getCommentsOfPost);                   // Get comments

router.get("/:id/like", isAuthenticate, likePost);                                // Like
router.get("/:id/dislike", isAuthenticate, disLikePost);                          // Dislike

router.delete("/:id", isAuthenticate, deletePost);                                // Delete post
router.get("/:id/bookmark", isAuthenticate, bookmarkPost);                        // Bookmark

router.get("/explore", isAuthenticate, getExplorePosts);

export default router;
