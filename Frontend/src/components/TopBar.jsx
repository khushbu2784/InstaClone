import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import instaLogo from "@/assets/Logo.png";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaUser } from "react-icons/fa";
import NotificationPanel from "../Pages/NotificationPanel";
import { clearNotificationBadge } from "@/redux/rtnSlice";
import { useState } from "react";

const Topbar = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dispatch = useDispatch();

  const { unreadCount, recentTypes = [] } = useSelector(
    (state) => state.realTimeNotifications
  );

  const unreadMap = useSelector((store) => store.chat?.unreadMap || {});
  const totalUnreadMessages = Object.values(unreadMap).reduce(
    (a, b) => a + b,
    0
  );

  const handleOpenNotification = () => {
    setNotificationOpen(true);
    dispatch(clearNotificationBadge());
  };

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 px-4 py-4 flex items-center justify-between shadow-sm dark:shadow-md sm:hidden">
      <Link to="/" aria-label="Home">
        <img src={instaLogo} alt="Instagram" className="h-6 dark:invert" />
      </Link>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={handleOpenNotification}
          aria-label="Notifications"
          className="relative"
        >
          <Heart className="w-6 h-6 text-black dark:text-white cursor-pointer" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-[20px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold shadow z-10 gap-[2px]">
              {recentTypes.includes("like") && <FaHeart className="w-3 h-3" />}
              {recentTypes.includes("follow") && <FaUser className="w-3 h-3" />}
              <span>{unreadCount}</span>
            </span>
          )}
        </button>

        <Link to="/chat" aria-label="Messages" className="relative">
          <MessageCircle className="w-6 h-6 text-black dark:text-white cursor-pointer" />
          {totalUnreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center font-bold">
              {totalUnreadMessages}
            </span>
          )}
        </Link>
      </div>

      {/* Notification Modal */}
      <NotificationPanel
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
      />
    </div>
  );
};

export default Topbar;
