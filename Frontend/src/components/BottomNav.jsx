import { Home, Search, PlusSquare, User, VideoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-gray-900 border-t dark:border-gray-700 z-50 flex justify-around items-center py-2 px-4 sm:hidden shadow-lg transition-colors duration-300">
      {[
        { icon: Home, action: "home" },
        { icon: Search, action: "search" },
        { icon: PlusSquare, action: "create" },
        { icon: VideoIcon, action: "reel" },
        { icon: User, action: "profile" },
      ].map(({ icon: Icon, action }, index) => (
        <Icon
          key={index}
          className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
          onClick={() => handleClick(action)}
        />
      ))}
    </div>
  );
};

export default BottomNav;
