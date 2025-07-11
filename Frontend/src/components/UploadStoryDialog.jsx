// components/UploadStoryDialog.jsx
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogClose } from "./ui/dialog";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";

const UploadStoryDialog = ({ open, setOpen }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const uploadStory = async () => {
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("media", file);
    console.log("Selected file:", file);

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/story/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Story uploaded successfully");
      setOpen(false);
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setFile(null);
          setPreview(null);
        }
      }}
    >
      {/* Close button in transparent area */}
      {open && (
        <DialogClose asChild>
          <button
            className="fixed top-6 right-6 z-50 text-white p-2"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>
        </DialogClose>
      )}

      <DialogContent className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white max-w-md mx-auto flex flex-col items-center justify-center gap-4 p-6 rounded-lg">
        <DialogHeader className="font-bold text-xl text-center w-full">
          Upload a Story
        </DialogHeader>

        <input
          type="file"
          accept="image/*,video/*"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Select Button */}
        <Button
          onClick={() => inputRef.current.click()}
          className="w-full py-2 text-md font-medium bg-[#0095F6] hover:bg-[#007bd6] text-white rounded"
        >
          Select Media
        </Button>

        {/* Preview */}
        <div className="w-full flex items-center justify-center">
          {preview &&
            (file?.type.startsWith("image") ? (
              <img
                src={preview}
                alt="story preview"
                className="rounded-lg object-contain max-h-[400px] w-full"
              />
            ) : (
              <video
                src={preview}
                controls
                className="rounded-lg max-h-[400px] w-full"
              />
            ))}
        </div>

        {/* Upload Button */}
        {preview && (
          <Button
            className="w-full text-md font-medium bg-[#0095F6] hover:bg-[#007bd6] text-white rounded"
            disabled={loading}
            onClick={uploadStory}
          >
            {loading ? "Uploading..." : "Upload Story"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadStoryDialog;
