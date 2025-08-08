import {
  Home,
  Search,
  PlusSquare,
  UserPlus2, // placeholder for reels
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import noProfile from "@/assets/Profile.png";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

const BottomNav = ({ setCreateDialogOpen }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleClick = (type) => {
    switch (type) {
      case "home":
        navigate("/");
        break;
      case "search":
        navigate("/explore");
        break;
      case "create":
        setCreateDialogOpen(true);
        break;
      case "reel":
        navigate("/suggestedUser");
        break;
      case "profile":
        navigate(`/profile/${user?._id}`);
        break;
      default:
        break;
    }
  };

  const icons = [
    { icon: Home, action: "home" },
    { icon: Search, action: "search" },
    { icon: PlusSquare, action: "create" },
    { icon: UserPlus2, action: "reel" },
    { icon: null, action: "profile" }, // Avatar goes here
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-gray-900 border-t dark:border-gray-700 z-50 flex justify-around items-center py-2 px-4 sm:hidden shadow-lg transition-colors duration-300">
      {icons.map(({ icon: Icon, action }, index) => {
        if (action === "profile") {
          return (
            <div key={index} onClick={() => handleClick("profile")} className="cursor-pointer">
              <Avatar className="w-7 h-7 border-2 border-transparent hover:border-blue-500 transition-all">
                <AvatarImage src={user?.profilePicture || noProfile } alt={user?.username} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </div>
          );
        }

        return (
          <Icon
            key={index}
            className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
            onClick={() => handleClick(action)}
          />
        );
      })}
    </div>
  );
};

export default BottomNav;
