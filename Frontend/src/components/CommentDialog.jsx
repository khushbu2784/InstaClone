import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal, X } from "lucide-react";
import { Button } from "./ui/button";
import Comment from "./Comment";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";
import useFollowUnfollow from "@/hooks/useFollowUnfollow";
import noProfile from "@/assets/Profile.png";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();
  const { toggleFollow } = useFollowUnfollow();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trimStart());
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/post/${
          selectedPost?._id
        }/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/post/comments/${commentId}`,
        { withCredentials: true }
      );

      // Check both axios status and res.data.success
      if (res.status === 200 && res.data.success) {
        const updatedComments = comment.filter((c) => c._id !== commentId);
        setComment(updatedComments);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success("Comment deleted");
      } else {
        console.warn("Unexpected delete response:", res);
        toast.error(res.data?.message || "Something went wrong");
      }
    } catch (err) {
      console.error("❌ Failed to delete comment:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} className="relative mx-auto">
      {/* Close Button */}
      {open && (
        <DialogClose asChild>
          <button
            className="fixed right:1 sm:top-5 sm:right-10 z-50 text-black dark:text-white hover:text-black dark:hover:text-gray-300"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
        </DialogClose>
      )}

      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="w-[95vw] max-w-5xl h-[95vh] sm:h-[90vh] p-0 mx-auto flex flex-col md:flex-row rounded-md overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-700"
      >
        {/* Left Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-white dark:bg-gray-900 flex items-center justify-center">
          <img
            src={selectedPost?.image}
            alt="Post"
            className="w-full h-full sm:object-cover object-contain"
          />
          {open && (
            <DialogClose asChild>
              <button
                className="fixed sm:hidden top-0 left-1  z-50 text-black dark:text-white hover:text-black dark:hover:text-gray-200"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </DialogClose>
          )}
        </div>

        {/* Right Section */}
        <div className="flex flex-col w-full md:w-1/2 sm:max-h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Link to={`profile/${selectedPost?.author?._id}`}>
                <Avatar>
                  <AvatarImage
                    src={selectedPost?.author?.profilePicture || noProfile}
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </Link>
              <Link
                to={`profile/${selectedPost?.author?._id}`}
                className="font-semibold text-sm truncate max-w-[100px]"
              >
                {selectedPost?.author?.userName}
              </Link>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer w-5 h-5" />
              </DialogTrigger>
              <DialogContent className="bg-white text-black dark:bg-gray-800 dark:text-white p-4 rounded shadow-md space-y-2 text-center text-sm w-60">
                {selectedPost?.author &&
                  selectedPost.author._id !== user._id && (
                    <div
                      className="cursor-pointer font-semibold text-blue-500"
                      onClick={() => toggleFollow(selectedPost.author._id)}
                    >
                      {user.following.includes(selectedPost.author._id)
                        ? "Unfollow"
                        : "Follow"}
                    </div>
                  )}
                <div className="cursor-pointer">Add to favourite</div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[300px] sm:max-h-[400px]">
            {comment.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                user={user}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>

          {/* Add Comment */}
          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                <AvatarImage src={user.profilePicture || noProfile} />
                <AvatarFallback />
              </Avatar>
              <input
                type="text"
                placeholder="Add a comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessageHandler();
                  }
                }}
                onChange={changeEventHandler}
                value={text}
                className="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-500 text-sm"
              />
              <Button
                onClick={sendMessageHandler}
                disabled={!text.trim()}
                variant="outline"
                className="text-xs sm:text-sm px-3 py-1 border-gray-300 dark:border-gray-600"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
