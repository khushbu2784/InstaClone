import sharp from "sharp";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import uploadToCloudinary from "../utils/cloudinary.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }

    // ✅ Resize image using Sharp
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // ✅ Upload to Cloudinary using helper function
    const cloudResponse = await uploadToCloudinary(optimizedImageBuffer);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    res.status(201).json({
      message: "Post added successfully",
      post,
      success: true,
    });
  } catch (err) {
    console.error("Error in addNewPost:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    if (!req.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const me = await User.findById(req.id).select("blockedUsers blockedBy");
    if (!me) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const blockedUserIds = [...me.blockedUsers, ...me.blockedBy].map((id) =>
      id.toString()
    );
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "userName profilePicture" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "userName profilePicture",
        },
      });
    const filteredPosts = posts.filter(
      (post) =>
        post.author && !blockedUserIds.includes(post.author._id.toString())
    );
    res.status(200).json({ posts: filteredPosts, success: true });
  } catch (err) {
    console.error("❌ Error in getAllPost:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get posts of specific user
export const getUserPost = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "userName profilePicture" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "userName profilePicture",
        },
      });
    res.status(200).json({ posts, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKrnewalaUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found", success: false });

    const alreadyLiked = post.likes.includes(likeKrnewalaUserId);

    if (!alreadyLiked) {
      await post.updateOne({ $addToSet: { likes: likeKrnewalaUserId } });
      await post.save();

      const user = await User.findById(likeKrnewalaUserId).select("userName profilePicture");
      const postOwnerId = post.author.toString();

      if (postOwnerId !== likeKrnewalaUserId) {
        const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        if (postOwnerSocketId) {
          const notification = {
            type: "like",
            userId: likeKrnewalaUserId,
            userDetails: user,
            postId,
            message: `liked your post`,
            timestamp: Date.now(),
          };
          io.to(postOwnerSocketId).emit("notification", notification);
        }
      }
    }

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const disLikePost = async (req, res) => {
  try {
    const likeKrnewalaUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post)
      return res.status(404).json({ message: "Post not found", success: false });

    await post.updateOne({ $pull: { likes: likeKrnewalaUserId } });
    await post.save();

    const user = await User.findById(likeKrnewalaUserId).select("userName profilePicture");
    const postOwnerId = post.author.toString();

    if (postOwnerId !== likeKrnewalaUserId) {
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        const notification = {
          type: "dislike",
          userId: likeKrnewalaUserId,
          userDetails: user,
          postId,
          message: `disliked your post`,
        };
        io.to(postOwnerSocketId).emit("notification", notification);
      }
    }

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserId = req.id;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Text is required", success: false });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found", success: false });

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserId,
      post: postId,
    });

    await comment.populate({ path: "author", select: "userName profilePicture" });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({ message: "Comment added", success: true, comment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

//delete comment
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
    }

    // Remove comment from post.comments array
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteComment:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get all comments of a post
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate("author", "userName profilePicture");

    if (!comments) return res.status(404).json({ message: "No comments found", success: false });

    return res.status(200).json({ success: true, comments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Edit post caption
export const updatePostCaption = async (req, res) => {
  try {
    const { caption } = req.body;
    const { id } = req.params;
   // const id = req.params.id; both valid

    const post = await Post.findById(id)
      .populate("author", "userName profilePicture")
      .populate("likes", "_id")
      //.populate("bookmarks", "_id")
      .populate("comments");

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    post.caption = caption;
    await post.save();

    // Re-populate after save to reflect changes
    await post.populate("author", "userName profilePicture");

    res.status(200).json({ success: true, updatedPost: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found", success: false });

    if (post.author.toString() !== authorId)
      return res.status(403).json({ message: "Unauthorized", success: false });

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Bookmark / Unbookmark post
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Post not found", success: false });

    const user = await User.findById(authorId);
    if (!user.bookmarks) user.bookmarks = [];

    const isBookmarked = user.bookmarks.includes(post._id);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (bookmarkId) => bookmarkId.toString() !== post._id.toString()
      );
    } else {
      user.bookmarks.push(post._id);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: isBookmarked ? "Bookmark removed" : "Bookmarked",
      bookmarks: user.bookmarks,
    });
  } catch (err) {
    console.error("Bookmark error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const getExplorePosts = async (req, res) => {
  try {
    const currentUserId = req.id;
    const currentUser = await User.findById(currentUserId);
    const blockedUsers = currentUser?.blockedUsers || [];

    let posts = await Post.find({
      author: { $nin: [...blockedUsers, currentUserId] },
      isDeleted: { $ne: true }, // ✅ Exclude deleted posts
    })
      .populate("author", "userName profilePicture")
      .sort({ createdAt: -1 })
      .limit(50);

    //Filter out posts with deleted users (author=null after populate)
    posts = posts.filter((post) => post.author !== null);

    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error("Explore error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
