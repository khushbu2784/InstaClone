// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Dialog, DialogContent, DialogClose } from "./ui/dialog";
// import { X } from "lucide-react";
// import UploadStoryDialog from "./UploadStoryDialog";
// import noProfile from "@/assets/Profile.png";
// import { Link } from "react-router-dom";

// const Stories = () => {
//   const [stories, setStories] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [storyIndex, setStoryIndex] = useState(0);
//   const [myId, setMyId] = useState(null);
//   const [myProfile, setMyProfile] = useState(null);
//   const [myFollowing, setMyFollowing] = useState([]);
//   const [openUpload, setOpenUpload] = useState(false);

//   useEffect(() => {
//     const fetchStories = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/story/all`, {
//           withCredentials: true,
//         });

//         if (res.data.success) {
//           setStories(res.data.stories);
//           setMyId(res.data.myId);
//           setMyProfile(res.data.myProfile);
//           setMyFollowing(res.data.myFollowing); // ✅ Store followed user IDs
//         }
//       } catch (error) {
//         console.error("Error fetching stories:", error);
//       }
//     };

//     fetchStories();
//   }, []);

//   const myStory = stories.find((s) => s.user._id === myId);
//   const others = stories.filter(
//     (s) => s.user._id !== myId && myFollowing.includes(s.user._id)
//   );

//   const currentStory = selectedUser?.stories?.[storyIndex];

//   useEffect(() => {
//     if (selectedUser) setStoryIndex(0);
//   }, [selectedUser]);

//   return (
//     <>
//       {/* Story Avatars */}
//       <div className="flex gap-4 overflow-x-auto px-4 py-2 border-b border-gray-200 dark:border-gray-700 no-scrollbar bg-white dark:bg-gray-900">
//         {/* My Story */}
//         {myId && (
//           <div
//             className="flex flex-col items-center cursor-pointer"
//             onClick={() =>
//               myStory ? setSelectedUser(myStory) : setOpenUpload(true)
//             }
//           >
//             <div className="relative">
//               <img
//                 src={
//                   myStory?.user?.profilePicture ||
//                   myProfile?.profilePicture ||
//                   noProfile
//                 }
//                 alt="my story"
//                 className={`w-16 h-16 rounded-full object-cover border-2 ${
//                   myStory ? "border-pink-500" : "border-gray-400"
//                 }`}
//               />
//               <div
//                 className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setOpenUpload(true);
//                 }}
//               >
//                 +
//               </div>
//             </div>
//             <span className="text-xs mt-1 dark:text-white">
//               {myStory ? "Your Story" : "Add Story"}
//             </span>
//           </div>
//         )}

//         {/* Followed Users' Stories */}
//         {others.length === 0 ? (
//           <></>
//         ) : (
//           others.map((storyGroup) => (
//             <div
//               key={storyGroup.user._id}
//               className="flex flex-col items-center cursor-pointer px-4"
//               onClick={() => setSelectedUser(storyGroup)}
//             >
//               <img
//                 src={storyGroup.user.profilePicture || noProfile}
//                 alt="dp"
//                 className="w-16 h-16 rounded-full border-2 border-pink-500 object-cover"
//               />
//               <span className="text-xs mt-1 truncate max-w-[60px] text-center dark:text-white">
//                 {storyGroup.user.userName}
//               </span>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Upload Story Dialog */}
//       <UploadStoryDialog open={openUpload} setOpen={setOpenUpload} />

//       {/* Story Viewer Modal */}
//       <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)} className="px-auto mx-auto">
//         {/* Close button shown only when selectedUser is set */}
//         {selectedUser && (
//           <DialogClose asChild>
//             <button
//               className="fixed top-3 right-6 z-50 text-black dark:text-white p-2"
//               aria-label="Close"
//             >
//               <X className="h-8 w-8" />
//             </button>
//           </DialogClose>
//         )}
//         <DialogContent className="dark:bg-gray-900 bg-white max-w-md w-full">
//           {selectedUser && (
//             <div className="flex flex-col items-left">
//               <Link to={`/profile/${selectedUser.user._id}`}>
//                 <div className="w-full items-center text-white text-sm font-medium px-4 py-2 flex \ gap-2">
//                   <img
//                     src={selectedUser.user.profilePicture || noProfile}
//                     className="w-8 h-8 rounded-full"
//                   />
//                   {selectedUser.user._id === myId
//                     ? "Your Story"
//                     : selectedUser.user.userName}
//                 </div>
//               </Link>

//               {/* Story Viewer */}
//               <div className="relative w-full flex items-center justify-center dark:bg-gray-900 bg-white">
//                 {storyIndex > 0 && (
//                   <button
//                     className="absolute left-2 text-white bg-black bg-opacity-50 p-2 rounded-full z-10"
//                     onClick={() => setStoryIndex((prev) => prev - 1)}
//                   >
//                     ‹
//                   </button>
//                 )}

//                 {currentStory &&
//                   (currentStory.mediaType === "image" ? (
//                     <img
//                       src={currentStory.mediaUrl}
//                       className="w-full max-h-[400px] object-contain"
//                       alt="story"
//                     />
//                   ) : (
//                     <video
//                       src={currentStory.mediaUrl}
//                       className="w-full max-h-[400px] object-contain"
//                       controls
//                       autoPlay
//                     />
//                   ))}

//                 {storyIndex < selectedUser.stories.length - 1 && (
//                   <button
//                     className="absolute right-2 text-white bg-black bg-opacity-50 p-2 rounded-full z-10"
//                     onClick={() => setStoryIndex((prev) => prev + 1)}
//                   >
//                     ›
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Stories;

import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogClose } from "./ui/dialog";
import { X } from "lucide-react";
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

  // Get seen story IDs from localStorage
  const getSeenStories = () =>
    JSON.parse(localStorage.getItem("seenStories") || "[]");

  // Save current story to seen list
  useEffect(() => {
    if (selectedUser) setStoryIndex(0);
  }, [selectedUser]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true); // 👈 Start loading
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/story/all`,
          {
            withCredentials: true,
          }
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
        setLoading(false); // 👈 End loading
      }
    };

    fetchStories();
  }, []);

  const myStory = stories.find((s) => s.user._id === myId);
  const others = stories.filter(
    (s) => s.user._id !== myId && myFollowing.includes(s.user._id)
  );
  const currentStory = selectedUser?.stories?.[storyIndex];

  // Mark story as seen
  useEffect(() => {
    if (currentStory) {
      const seen = getSeenStories();
      if (!seen.includes(currentStory._id)) {
        seen.push(currentStory._id);
        localStorage.setItem("seenStories", JSON.stringify(seen));
      }
    }
  }, [currentStory]);

  return (
    <>
      {loading ? (
        // 🌟 Loader block while fetching stories
        <div className="flex gap-4 overflow-x-auto px-4 py-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="mt-1 h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ✅ Story Avatars */}
          <div className="flex gap-4 overflow-x-auto px-4 py-2 border-b border-gray-200 dark:border-gray-700 no-scrollbar bg-white dark:bg-gray-900">
            {/* 👤 My Story */}
            {myId && (
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() =>
                  myStory ? setSelectedUser(myStory) : setOpenUpload(true)
                }
              >
                <div className="relative">
                  <img
                    src={
                      myStory?.user?.profilePicture ||
                      myProfile?.profilePicture ||
                      noProfile
                    }
                    alt="my story"
                    className={`w-16 h-16 rounded-full object-cover border-2 ${
                      myStory
                        ? getSeenStories().some((id) =>
                            myStory.stories.some((s) => s._id === id)
                          )
                          ? "border-gray-400"
                          : "border-pink-500"
                        : "border-gray-400"
                    }`}
                  />
                  <div
                    className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenUpload(true);
                    }}
                  >
                    +
                  </div>
                </div>
                <span className="text-xs mt-1 dark:text-white">
                  {myStory ? "Your Story" : "Add Story"}
                </span>
              </div>
            )}

            {/* 👥 Others' Stories */}
            {others.map((storyGroup) => {
              const seenAll = storyGroup.stories.every((s) =>
                getSeenStories().includes(s._id)
              );
              return (
                <div
                  key={storyGroup.user._id}
                  className="flex flex-col items-center cursor-pointer px-2"
                  onClick={() => setSelectedUser(storyGroup)}
                >
                  <img
                    src={storyGroup.user.profilePicture || noProfile}
                    alt="dp"
                    className={`w-16 h-16 rounded-full border-2 object-cover ${
                      seenAll ? "border-gray-400" : "border-pink-500"
                    }`}
                  />
                  <span className="text-xs mt-1 truncate max-w-[60px] text-center dark:text-white">
                    {storyGroup.user.userName}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 📤 Upload Story Dialog */}
      <UploadStoryDialog open={openUpload} setOpen={setOpenUpload} />

      {/* 👁️ Story Viewer */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        {selectedUser && (
          <DialogClose asChild>
            <button
              className="fixed top-3 right-5 z-50 p-1 bg-black/50 text-white rounded-full sm:top-4 sm:right-6"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>
          </DialogClose>
        )}

        <DialogContent className="dark:bg-gray-900 bg-white max-w-md w-full mx-auto rounded-lg overflow-hidden">
          {selectedUser && (
            <div className="flex flex-col">
              {/* 🧑‍💼 User Info */}
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

              {/* ✖ Mobile Close Button */}
              <DialogClose asChild>
                <button
                  className="sm:hidden fixed top-3 right-3 z-50 p-1 text-white sm:top-4"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </DialogClose>

              {/* 🎞️ Story Display */}
              <div className="relative flex items-center justify-center bg-black">
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
                      alt="story"
                      className="w-full max-h-[400px] object-contain"
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Stories;
