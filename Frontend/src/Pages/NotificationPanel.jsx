import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import { clearNotificationBadge } from "@/redux/rtnSlice";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import noProfile from "@/assets/Profile.png";
import moment from "moment";

const NotificationPanel = ({ open, onOpenChange }) => {
  const dispatch = useDispatch();

  const notifications =
    useSelector((state) => state.realTimeNotifications.allNotifications) || [];

  const filtered = notifications.filter((n) => n.type !== "dislike");

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  useEffect(() => {
    if (open && sorted.length > 0) {
      dispatch(clearNotificationBadge());
    }
  }, [open, sorted.length, dispatch]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full sm:w-[400px] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white"
      >
        <SheetHeader>
          <SheetTitle className="text-xl sm:text-2xl font-bold mb-2">
            Notifications
          </SheetTitle>
        </SheetHeader>

        {sorted.length === 0 ? (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
            No new notifications.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {sorted.map((n, i) => (
              <div
                key={`${n.userId}-${n.postId || i}-${n.timestamp}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <Avatar className="h-9 w-9">
                  {n.userDetails?.profilePicture ? (
                    <AvatarImage src={n.userDetails.profilePicture} />
                  ) : (
                    <AvatarFallback>
                      <img
                        src={noProfile}
                        alt="fallback"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className="text-sm">
                  <span className="font-semibold">
                    {n.userDetails?.userName || "Unknown User"}
                  </span>{" "}
                  {n.message ||
                    (n.type === "like"
                      ? "liked your post "
                      : n.type === "follow"
                      ? "started following you"
                      : " ")}
                  <span className="text-xs text-gray-400 ml-2">
                    {moment(n.timestamp).fromNow()}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;
