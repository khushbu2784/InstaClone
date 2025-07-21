import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import noProfile from "@/assets/Profile.png";

const CreatePostDialog = ({
  open,
  setOpen,
  isEditMode = false,
  selectedPost = null,
}) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEditMode && selectedPost) {
      setCaption(selectedPost.caption || "");
      setImagePreview(selectedPost.image || "");
      setFile("");
    } else {
      setCaption("");
      setImagePreview("");
      setFile("");
    }
  }, [isEditMode, selectedPost, open]);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const closeDialog = () => {
    setCaption("");
    setImagePreview("");
    setFile("");
    setOpen(false);
  };

  const createPostHandler = async () => {
    if (!file) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/post/addpost`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        closeDialog();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const editPostHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/post/${selectedPost._id}`,
        { caption },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedPost = res.data.updatedPost;
        dispatch(
          setPosts(
            posts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
          )
        );
        toast.success("Post updated successfully");
        closeDialog();
      }
    } catch (error) {
      console.error("Edit post error:", error);
      toast.error(error?.response?.data?.message || "Failed to edit post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} className="">
      <DialogContent
        onInteractOutside={closeDialog}
        className="bg-white dark:bg-gray-900 text-black dark:border-gray-600 dark:text-white outline-none max-w-[60vh] rounded-xl w-full sm:max-w-lg sm:rounded-xl max-h-[90vh] overflow-y-auto border shadow-md backdrop-blur-md mx-auto p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <DialogHeader className="text-center font-bold text-lg flex-1">
            {isEditMode ? "Edit Post" : "Create New Post"}
          </DialogHeader>
          <button onClick={closeDialog}>
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex gap-3 items-center mb-3">
          <Avatar>
            <AvatarImage src={user?.profilePicture || noProfile} className="object-cover"/>
            <AvatarFallback>
              <img src={noProfile} alt="fallback" className="object-cover"/>
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.userName}</h1>
            <span className="text-gray-600 dark:text-gray-400 text-xs">
              {user?.bio}
            </span>
          </div>
        </div>

        {/* Caption Input */}
        <Textarea
          className="focus-visible:ring-transparent border border-gray-800 dark:border-gray-600 bg-white dark:bg-gray-800"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center my-3">
            <img
              src={imagePreview}
              alt="preview_img"
              className="object-cover h-full w-full rounded-md border dark:border-gray-700"
            />
          </div>
        )}

        {/* File Input (Only for Create Mode) */}
        {!isEditMode && (
          <>
            <input
              type="file"
              className="hidden"
              ref={imageRef}
              onChange={fileChangeHandler}
            />
            <Button
              onClick={() => imageRef.current.click()}
              className="w-full py-2 text-md font-medium bg-[#0095F6] hover:bg-[#007bd6] text-white rounded"
            >
              Select from computer
            </Button>
          </>
        )}

        {/* Submit Button */}
        {imagePreview &&
          (loading ? (
            <Button
              disabled
              className="w-full py-2 mt-2 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full py-2 mt-2 text-md font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded"
              onClick={isEditMode ? editPostHandler : createPostHandler}
            >
              {isEditMode ? "Update Post" : "Share"}
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
