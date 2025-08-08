import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import {
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { setAuthUser } from "@/redux/authSlice";
import { Badge } from "../ui/badge";
import CommentDialog from "../comment/CommentDialog";
import { Link } from "react-router-dom";
import noProfile from "@/assets/Profile.png";
import CreatePostDialog from "./CreatePostDialog";
import useFollowUnfollow from "@/hooks/useFollowUnfollow";

const Post = ({ post, mode }) => {
  const { user } = useSelector((store) => store.auth);
  const updatedUser = useSelector((store) => store.auth.user);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [openEdit, setOpenEdit] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(user && post?.likes?.includes(user._id));
  const [postLike, setPostLike] = useState(post.likes.length || 0);
  const [comment, setComment] = useState(post.comments || []);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toggleFollow } = useFollowUnfollow();
  const [moreDialogOpen, setMoreDialogOpen] = useState(false);

  useEffect(() => {
    const isBookmarkedPost = user?.bookmarks?.includes(post._id);
    setIsBookmarked(isBookmarkedPost);
  }, [user?.bookmarks, post._id]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/post/${post._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setPosts(posts.filter((p) => p._id !== post._id)));
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const LikeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/post/${post._id}/${action}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const newLiked = !liked;
        setLiked(newLiked);
        setPostLike((prev) => prev + (newLiked ? 1 : -1));
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: newLiked
                  ? [...p.likes, user._id]
                  : p.likes.filter((id) => id !== user._id),
              }
            : p
        );
        dispatch(setPosts(updatedPosts));
        toast.success(newLiked ? "Post liked successfully" : "Post Disliked!");
      }
    } catch (error) {
      toast.error("Like/Dislike failed");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedComments = [...comment, res.data.comment];
        setComment(updatedComments);
        dispatch(
          setPosts(
            posts.map((p) =>
              p._id === post._id ? { ...p, comments: updatedComments } : p
            )
          )
        );
        setText("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Comment failed");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/post/${post._id}/bookmark`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const bookmarks = res.data.bookmarks;
        const isBookmarkedNow = bookmarks.includes(post._id);
        setIsBookmarked(isBookmarkedNow);

        dispatch(setAuthUser({ ...user, bookmarks }));
        toast.success(
          isBookmarkedNow ? "Added to bookmarks" : "Removed from bookmarks"
        );
      }
    } catch (error) {
      toast.error("Bookmark failed");
    }
  };

  // ✅ Don't render if author or required data is missing
  if (!post || !post.author || !post.author._id) return null;

  return (
    <div
      className={`w-full ${
        mode === "model" ? "max-w-4xl" : "max-w-md"
      } mx-auto bg-white rounded-lg overflow-hidden mb-3 dark:bg-gray-900`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author._id}`}>
            <Avatar className="w-10 h-10 cursor-pointer">
              <AvatarImage src={post.author?.profilePicture} />
              <AvatarFallback>
                <img src={noProfile} alt="fallback" />
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Link to={`/profile/${post.author._id}`}>
              {post.author?.userName}
            </Link>
            {user?._id === post.author._id && (
              <Badge
                variant="secondary"
                className="text-xs bg-gray-100 dark:bg-gray-600"
              >
                Author
              </Badge>
            )}
          </div>
        </div>
        <Dialog open={moreDialogOpen} onOpenChange={setMoreDialogOpen}>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm bg-white dark:bg-gray-900 dark:text-white">
            <button
              onClick={() => setMoreDialogOpen(false)}
              className="absolute top-2 right-4 text-xl font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
              &times;
            </button>
            {user?._id !== post.author._id && (
              <Button
                variant="ghost"
                className="font-bold"
                onClick={() => {
                  toggleFollow(post.author._id, user);
                  setMoreDialogOpen(false);
                }}
              >
                {updatedUser?.following?.includes(post.author._id)
                  ? "Unfollow"
                  : "Follow"}
              </Button>
            )}
            <Button variant="ghost" className="font-bold">
              Add to Favourite
            </Button>
            {user?._id === post.author._id && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    deletePostHandler();
                    setMoreDialogOpen(false);
                  }}
                  className="font-bold text-red-500"
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setOpenEdit(true);
                    setMoreDialogOpen(false);
                  }}
                  className="font-bold"
                >
                  Edit
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        src={post.image}
        alt="post"
        className={`aspect-square object-cover my-2 ${
          mode === "model" ? "" : ""
        }`}
      />

      {/* Action Icons */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4 text-2xl">
          {liked ? (
            <FaHeart
              onClick={LikeOrDislikeHandler}
              className="text-[#ED4956] cursor-pointer"
            />
          ) : (
            <FaRegHeart
              onClick={LikeOrDislikeHandler}
              className="cursor-pointer hover:text-gray-500"
            />
          )}
          <MessageCircle
            className="cursor-pointer hover:text-gray-500"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
          />
          <Send className="cursor-pointer hover:text-gray-500" />
        </div>
        {isBookmarked ? (
          <BookmarkCheck
            onClick={bookmarkHandler}
            className="cursor-pointer text-gray-600"
          />
        ) : (
          <Bookmark
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-500"
          />
        )}
      </div>

      {/* Likes, Caption, Comments */}
      <div className="px-4">
        <span className="block text-sm font-semibold mb-1">
          {postLike} likes
        </span>
        <p className="text-sm">
          <span className="font-semibold mr-2">{post.author?.userName}</span>
          {post.caption}
        </p>
        {comment.length > 0 && (
          <p
            className="text-sm text-gray-500 mt-1 cursor-pointer"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
          >
            View all {comment.length} comments
          </p>
        )}
      </div>

      {/* Comment Input */}
      <div className="flex items-center border-b px-4 py-3">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 outline-none text-sm bg-transparent"
          value={text}
          onChange={changeEventHandler}
        />
        {text && (
          <button
            onClick={commentHandler}
            className="text-sm text-[#3BADF8] font-semibold hover:opacity-80"
          >
            Post
          </button>
        )}
      </div>

      <CommentDialog open={open} setOpen={setOpen} />
      {openEdit && (
        <CreatePostDialog
          open={openEdit}
          setOpen={setOpenEdit}
          isEditMode={true}
          selectedPost={post}
        />
      )}
    </div>
  );
};

export default Post;
