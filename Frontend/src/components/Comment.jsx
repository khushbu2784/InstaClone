// import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import noProfile from "@/assets/Profile.png";
// import { Trash2 } from "lucide-react";

// const Comment = ({ comment, user, onDelete }) => {
//   const isAuthor = user?._id === comment?.author?._id;

//   return (
//     <div className="my-3">
//       <div className="flex gap-3 items-start">
//         <Avatar className="h-8 w-8">
//           <AvatarImage src={comment?.author?.profilePicture || noProfile} />
//           <AvatarFallback></AvatarFallback>
//         </Avatar>
//         <div className="flex flex-col">
//           <div className="flex gap-2 text-sm">
//             <h1 className="font-semibold text-black dark:text-white">
//               {comment?.author?.userName}
//             </h1>
//             <span className="text-black dark:text-gray-300">
//               {comment?.text}
//             </span>
//           </div>
//           {/* Optional: Add timestamp below comment */}
//           {/* <span className="text-xs text-gray-500 mt-0.5">2 hours ago</span> */}
//         </div>
//       </div>
//       {isAuthor && (
//         <button
//           onClick={() => onDelete(comment._id)}
//           className="absolute right-1 top-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
//         >
//           <Trash2 className="h-4 w-4" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default Comment;

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import noProfile from "@/assets/Profile.png";
import { Trash2 } from "lucide-react";

const Comment = ({ comment, user, onDelete }) => {
  const isAuthor = user?._id === comment?.author?._id;

  return (
    <div className="my-3 relative group">
      <div className="flex gap-3 items-start">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment?.author?.profilePicture || noProfile} />
          <AvatarFallback />
        </Avatar>
        <div className="flex flex-col">
          <div className="flex gap-2 text-sm">
            <h1 className="font-semibold text-black dark:text-white">
              {comment?.author?.userName}
            </h1>
            <span className="text-black dark:text-gray-300">
              {comment?.text}
            </span>
          </div>
        </div>
      </div>

      {isAuthor && (
        <button
          onClick={() => onDelete(comment._id)}
          className="absolute right-1 top-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Comment;
