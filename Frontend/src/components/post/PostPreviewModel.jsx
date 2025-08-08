import React from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "../ui/dialog"; // ✅ Update path if needed
import { X } from "lucide-react";
import Post from "./Post";

const PostPreviewModal = ({ open, setOpen, post }) => {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg w-[70%] p-0 bg-white dark:bg-gray-900 dark:text-white overflow-hidden">
        <DialogClose asChild>
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white z-50">
            <X className="sm:h-10 h-3" />
          </button>
        </DialogClose>

        <div className="sm:w-[400px] w-auto my-2 mx-2 items-center justify-center sm:mx-auto">
          <Post post={post} mode="modal" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostPreviewModal;
