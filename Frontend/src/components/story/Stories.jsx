import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogClose } from "../ui/dialog";
import { X, Eye, Trash2 } from "lucide-react";
import UploadStoryDialog from "./UploadStoryDialog";
import noProfile from "@/assets/Profile.png";
import { Link } from "react-router-dom";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [myId, setMyId] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [myFollowing, setMyFollowing] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewers, setViewers] = useState([]);
  const [showViewers, setShowViewers] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  const getSeenStories = (userId) =>
    JSON.parse(localStorage.getItem(`seenStories_${userId}`) || "[]");

  const setSeenStories = (userId, stories) =>
    localStorage.setItem(`seenStories_${userId}`, JSON.stringify(stories));

  useEffect(() => {
    if (selectedUser) setStoryIndex(0);
  }, [selectedUser]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/story/all`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setStories(res.data.stories);
          setMyId(res.data.myId);
          setMyProfile(res.data.myProfile);
          setMyFollowing(res.data.myFollowing);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const myStory = stories.find((s) => s.user._id === myId);
  const others = stories.filter(
    (s) => s.user._id !== myId && myFollowing.includes(s.user._id)
  );
  const currentStory = selectedUser?.stories?.[storyIndex];

  useEffect(() => {
    if (currentStory && myId) {
      const seen = getSeenStories(myId);
      if (!seen.includes(currentStory._id)) {
        seen.push(currentStory._id);
        setSeenStories(myId, seen);
      }

      axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/story/view/${currentStory._id}`,
        {},
        { withCredentials: true }
      );
    }
  }, [currentStory, myId]);

  const fetchViewers = async (storyId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/story/viewers/${storyId}`,
        { withCredentials: true }
      );
      setViewers(res.data.viewers || []);
      setShowViewers(true);
    } catch (err) {
      console.error("Error fetching viewers", err);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex gap-4 overflow-x-auto px-4 py-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
              <div className="h-3 w-12 mt-2 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto px-4 py-2 border-b border-gray-200 dark:border-gray-700 no-scrollbar bg-white dark:bg-gray-900">
          {myId && (
            <div
              className="flex flex-col items-center cursor-pointer relative"
              onClick={() =>
                myStory ? setSelectedUser(myStory) : setOpenUpload(true)
              }
            >
              <div
                className={`p-[2px] rounded-full ${
                  myStory
                    ? getSeenStories(myId).some((id) =>
                        myStory.stories.some((s) => s._id === id)
                      )
                      ? "bg-gray-400"
                      : "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400"
                    : "bg-gray-400"
                }`}
              >
                <img
                  src={
                    myStory?.user?.profilePicture ||
                    myProfile?.profilePicture ||
                    noProfile
                  }
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div
                className="absolute bottom-5 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm border-2 border-white dark:border-gray-900"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenUpload(true);
                }}
              >
                +
              </div>
              <span className="text-xs mt-1 dark:text-white">
                {myStory ? "Your Story" : "Add Story"}
              </span>
            </div>
          )}

          {others.map((storyGroup) => {
            const seenStories = getSeenStories(myId);
            const seenAll = storyGroup.stories.every((s) =>
              seenStories.includes(s._id)
            );
            const borderClass = seenAll
              ? "bg-gray-400"
              : "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400";

            return (
              <div
                key={storyGroup.user._id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedUser(storyGroup)}
              >
                <div className={`p-[2px] rounded-full ${borderClass}`}>
                  <img
                    src={storyGroup.user.profilePicture || noProfile}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <span className="text-xs mt-1 truncate max-w-[60px] text-center dark:text-white">
                  {storyGroup.user.userName}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <UploadStoryDialog open={openUpload} setOpen={setOpenUpload} />

      <Dialog
        open={!!selectedUser}
        onOpenChange={() => {
          setSelectedUser(null);
          setShowViewers(false);
        }}
      >
        {selectedUser && (
          <>
            {/* ✖ Mobile Close Button */}
            <DialogClose asChild>
              <button
                className="sm:hidden fixed top-3 right-3 z-50 p-1 text-white"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </DialogClose>

            {/* ✖ Desktop Close Button */}
            <DialogClose asChild>
              <button className="hidden sm:flex fixed top-3 right-5 z-50 p-1 text-gray-800 dark:text-white">
                <X className="w-8 h-8" />
              </button>
            </DialogClose>
          </>
        )}

        <DialogContent className="dark:bg-gray-900 bg-white sm:mx-auto rounded-lg overflow-hidden sm:w-[600px] w-[390px]">
          {selectedUser && (
            <div className="flex flex-col">
              <Link
                to={`/profile/${selectedUser.user._id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium dark:text-white"
              >
                <img
                  src={selectedUser.user.profilePicture || noProfile}
                  className="w-8 h-8 rounded-full"
                />
                {selectedUser.user._id === myId
                  ? "Your Story"
                  : selectedUser.user.userName}
              </Link>
                  <DialogClose asChild>
              <button className="sm:hidden fixed top-3 right-5 z-50 p-1 text-gray-800 dark:text-white">
                <X className="w-4 h-4" />
              </button>
            </DialogClose>
              <div className="relative flex items-center justify-center bg-white dark:bg-gray-900">
                {storyIndex > 0 && (
                  <button
                    className="absolute left-2 text-white bg-black bg-opacity-50 p-2 rounded-full z-10"
                    onClick={() => setStoryIndex((prev) => prev - 1)}
                  >
                    ‹
                  </button>
                )}
                {currentStory &&
                  (currentStory.mediaType === "image" ? (
                    <img
                      src={currentStory.mediaUrl}
                      className="w-full sm:max-h-[400px] max-h-[250px] object-contain"
                    />
                  ) : (
                    <video
                      src={currentStory.mediaUrl}
                      className="w-full max-h-[400px] object-contain"
                      controls
                      autoPlay
                    />
                  ))}
                {storyIndex < selectedUser.stories.length - 1 && (
                  <button
                    className="absolute right-2 text-white bg-black bg-opacity-50 p-2 rounded-full z-10"
                    onClick={() => setStoryIndex((prev) => prev + 1)}
                  >
                    ›
                  </button>
                )}
              </div>

              {selectedUser.user._id === myId && currentStory && (
                <div className="px-4 pt-2">
                  <p
                    onClick={() => fetchViewers(currentStory._id)}
                    className="text-xs text-gray-500 hover:text-gray-600 cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> Viewed by {viewers.length}
                  </p>

                  {showViewers && (
                    <div className="mt-3 space-y-3">
                      {viewers.map((v) => (
                        <Link
                          key={v._id}
                          to={`/profile/${v._id}`}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={v.profilePicture || noProfile}
                            className="w-8 h-8 rounded-full object-cover"
                            alt={v.userName}
                          />
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            {v.userName}
                          </span>
                        </Link>
                      ))}
                      {viewers.length === 0 && (
                        <p className="text-sm text-gray-400 italic">
                          No viewers yet
                        </p>
                      )}
                    </div>
                  )}

                  <p
                    onClick={() => setShowDeleteSheet(true)}
                    className="text-xs text-red-500 mt-6 font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Story
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteSheet} onOpenChange={setShowDeleteSheet}>
        <DialogContent
          className="rounded-t-xl bottom-0 mx-4 right-0 w-[300px] h-[100px] sm:max-w-md bg-white dark:bg-gray-900 p-0 overflow-hidden"
          style={{ position: "fixed" }}
        >
          <div className="p-4">
            <button
              onClick={async () => {
                try {
                  const res = await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/story/delete/${
                      currentStory._id
                    }`,
                    { withCredentials: true }
                  );
                  if (res.data.success) {
                    setSelectedUser(null);
                    setShowDeleteSheet(false);
                    window.location.reload();
                  }
                } catch (err) {
                  console.error("Delete error:", err);
                }
              }}
              className="w-full py-3 text-red-600 font-semibold text-sm border-b border-gray-300 dark:border-gray-700"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteSheet(false)}
              className="w-full py-3 text-sm text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Stories;

