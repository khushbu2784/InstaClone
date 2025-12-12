// // components/UserListDialog.jsx
// import { useState } from "react";
// import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
// import noProfile from "@/assets/Profile.png";
// import { SearchIcon, X } from "lucide-react";
// import { Link } from "react-router-dom";
// import useFollowUnfollow from "@/hooks/useFollowUnfollow";
// import { Button } from "../ui/button";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { toast } from "sonner";

// const UserListDialog = ({
//   visible,
//   onClose,
//   list = [],
//   type = "followers",
//   currentUserId,
//   isMyProfile = false,
//   refetchList,
//   onFollowChange,
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const { toggleFollow } = useFollowUnfollow();
//   const { user: authUser } = useSelector((state) => state.auth);

//   const handleUnfollow = async (userId) => {
//     const result = await toggleFollow(userId, authUser);

//     if (result) {
//       if (typeof refetchList === "function") {
//         refetchList(); // still useful to refetch the list
//       }

//       // ✅ Update counts in parent (Profile.jsx)
//       if (typeof onFollowChange === "function") {
//         onFollowChange({
//           followersCount: result.updatedTargetUser.followers.length,
//           followingCount: result.updatedCurrentUser.following.length,
//         });
//       }
//     }
//   };

//   const handleRemoveFollower = async (followerId) => {
//     try {
//       const res = await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/user/removeFollower/${followerId}`,
//         {}, // request body (empty in this case)
//         {
//           withCredentials: true, // send cookies including token
//         }
//       );

//       const data = res.data;
//       toast.success(data.message || "Follower removed successfully");

//       if (res.status === 200) {
//         if (typeof refetchList === "function") {
//           refetchList();
//         }
//         if (typeof onFollowChange === "function") {
//           onFollowChange({
//             followersCount: data.updatedCurrentUser.followers.length,
//             followingCount: data.updatedCurrentUser.following.length,
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Error removing follower:", err);
//       toast.error(err.response?.data?.message || "Failed to remove follower");
//     }
//   };

//   const filteredList = list.filter((u) =>
//     u.userName?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (!visible) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
//       <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-sm w-full max-h-[80vh] overflow-y-auto text-black dark:text-white relative">
//         <button
//           className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
//           onClick={() => {
//             setSearchQuery("");
//             onClose();
//           }}
//         >
//            <X className="w-6 h-6" />
//         </button>

//         <h2 className="text-lg font-bold mb-4 mr-8 capitalize">{type}</h2>

//         <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2 mt-4 mb-2">
//           <SearchIcon className="text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search users"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="bg-transparent border-none focus:outline-none w-full text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 text-black dark:text-white"
//           />
//         </div>

//         <div className="space-y-2">
//           {filteredList.length > 0 ? (
//             filteredList.map((u) => (
//               <div
//                 key={u._id}
//                 className="flex items-center justify-between gap-3"
//               >
//                 <Link
//                   to={`/profile/${u._id}`}
//                   className="flex items-center gap-3"
//                   onClick={onClose}
//                 >
//                   <Avatar className="w-11 h-11">
//                     <AvatarImage
//                       src={u?.profilePicture || noProfile}
//                       alt="profile"
//                       className="object-cover"
//                     />
//                     <AvatarFallback>
//                       <img
//                         src={noProfile}
//                         alt="fallback"
//                         className="w-full h-full object-cover"
//                       />
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="text-sm">{u.userName}</span>
//                 </Link>

//                 {type === "following" &&
//                   isMyProfile &&
//                   u._id !== currentUserId && (
//                     <Button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleUnfollow(u._id);
//                       }}
//                       className="text-sm text-black h-6 bg-gray-200 hover:bg-gray-300 dark:text-white dark:bg-gray-700 rounded-xl"
//                     >
//                       Unfollow
//                     </Button>
//                   )}

//                 {type === "followers" &&
//                   isMyProfile &&
//                   u._id !== currentUserId && (
//                     <Button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleRemoveFollower(u._id);
//                       }}
//                       className="text-sm text-black h-6 bg-gray-200 hover:bg-gray-300 dark:text-white dark:bg-gray-700 rounded-xl"
//                     >
//                       remove
//                     </Button>
//                   )}
//               </div>
//             ))
//           ) : (
//             <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
//               No users found.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserListDialog;

// components/UserListDialog.jsx
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import noProfile from "@/assets/Profile.png";
import { SearchIcon, X } from "lucide-react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "@/hooks/useFollowUnfollow";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

const UserListDialog = ({
  visible,
  onClose,
  list = [],
  type = "followers",
  currentUserId,
  isMyProfile = false,
  refetchList,
  onFollowChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleFollow } = useFollowUnfollow();
  const { user: authUser } = useSelector((state) => state.auth);

  // ==============================
  //    HANDLE UNFOLLOW (Following Tab)
  // ==============================
  const handleUnfollow = async (userId) => {
    const result = await toggleFollow(userId, authUser);

    if (result) {
      if (typeof refetchList === "function") refetchList();

      // ✅ Only update FOLLOWING count (NOT followers)
      if (typeof onFollowChange === "function") {
        onFollowChange({
          followingCount: result.updatedCurrentUser.following.length,
        });
      }
    }
  };

  // ==============================
  //    HANDLE REMOVE FOLLOWER
  // ==============================
  const handleRemoveFollower = async (followerId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/removeFollower/${followerId}`,
        {},
        { withCredentials: true }
      );

      const data = res.data;
      toast.success(data.message || "Follower removed successfully");

      if (res.status === 200) {
        if (typeof refetchList === "function") refetchList();

        // ✅ Only update FOLLOWERS count (NOT following)
        if (typeof onFollowChange === "function") {
          onFollowChange({
            followersCount: data.updatedCurrentUser.followers.length,
          });
        }
      }
    } catch (err) {
      console.error("Error removing follower:", err);
      toast.error(err.response?.data?.message || "Failed to remove follower");
    }
  };

  const filteredList = list.filter((u) =>
    u.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-sm w-full max-h-[80vh] overflow-y-auto text-black dark:text-white relative">
        
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
          onClick={() => {
            setSearchQuery("");
            onClose();
          }}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-lg font-bold mb-4 mr-8 capitalize">{type}</h2>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2 mt-4 mb-2">
          <SearchIcon className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none w-full text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 text-black dark:text-white"
          />
        </div>

        <div className="space-y-2">
          {filteredList.length > 0 ? (
            filteredList.map((u) => (
              <div key={u._id} className="flex items-center justify-between gap-3">
                
                <Link
                  to={`/profile/${u._id}`}
                  className="flex items-center gap-3"
                  onClick={onClose}
                >
                  <Avatar className="w-11 h-11">
                    <AvatarImage
                      src={u?.profilePicture || noProfile}
                      alt="profile"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <img
                        src={noProfile}
                        alt="fallback"
                        className="w-full h-full object-cover"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{u.userName}</span>
                </Link>

                {/* ============================== */}
                {/*   SHOW UNFOLLOW BUTTON         */}
                {/* ============================== */}
                {type === "following" &&
                  isMyProfile &&
                  u._id !== currentUserId && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnfollow(u._id);
                      }}
                      className="text-sm text-black h-6 bg-gray-200 hover:bg-gray-300 dark:text-white dark:bg-gray-700 rounded-xl"
                    >
                      Unfollow
                    </Button>
                  )}

                {/* ============================== */}
                {/*   SHOW REMOVE BUTTON           */}
                {/* ============================== */}
                {type === "followers" &&
                  isMyProfile &&
                  u._id !== currentUserId && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFollower(u._id);
                      }}
                      className="text-sm text-black h-6 bg-gray-200 hover:bg-gray-300 dark:text-white dark:bg-gray-700 rounded-xl"
                    >
                      remove
                    </Button>
                  )}
              </div>
            ))
          ) : (
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
              No users found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListDialog;
