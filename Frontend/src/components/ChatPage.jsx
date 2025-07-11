import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { MessageCircleCode } from "lucide-react";
import Messages from "../Pages/Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import noProfile from "@/assets/Profile.png";
import { useNavigate } from "react-router-dom";
import { resetUnread } from "@/redux/chatSlice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay, or tie this to actual fetch
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/message/send/${receiverId}`,
        { textMessage },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...(messages || []), res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-900">
        {/* Sidebar skeleton */}
        <aside className="w-full md:w-1/4 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4 sm:ml-[260px] mt-[30px]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-2 flex-1">
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </aside>

        {/* Chat area skeleton */}
        <div className="flex-1 hidden md:flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-0 bg-white dark:bg-gray-900 text-black dark:text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col w-full md:w-1/4 border-r border-gray-300 dark:border-gray-700 sm:ml-[260px] ${
          selectedUser ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <h1 className="font-bold text-xl">{user?.userName}</h1>
          <hr className="my-4 border-gray-300 dark:border-gray-700" />
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-4">
          {suggestedUsers
            .filter((suggestedUser) => suggestedUser._id !== user._id)
            .map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div
                  key={suggestedUser._id}
                  onClick={() => {
                    dispatch(setSelectedUser(suggestedUser));
                    dispatch(resetUnread(suggestedUser._id));
                  }}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={suggestedUser?.profilePicture || noProfile}
                      alt="profile"
                    />
                    <AvatarFallback>
                      <img
                        src={noProfile}
                        alt="fallback"
                        className="w-full h-full object-cover"
                      />
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold">{suggestedUser?.userName}</p>
                    <p
                      className={`text-xs font-semibold ${
                        isOnline ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </aside>

      {/* Chat Area */}
      {selectedUser ? (
        <section className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-3 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10 cursor-pointer">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/profile/${selectedUser?._id}`)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={selectedUser?.profilePicture || noProfile}
                  alt="profile"
                />
                <AvatarFallback>
                  <img
                    src={noProfile}
                    alt="fallback"
                    className="w-full h-full object-cover"
                  />
                </AvatarFallback>
              </Avatar>

              <div className="ml-2">
                <p className="font-medium hover:underline">
                  {selectedUser?.userName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <Messages selectedUser={selectedUser} />
          </div>

          {/* Chat Input */}
          <div className="fixed bottom-10 left-0 right-0 z-10 sm:sticky sm:bottom-0 p-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center overflow-hidden">
              <input
                type="text"
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm rounded px-3 py-2 mr-2 focus:outline-none focus:ring focus:ring-blue-400"
                placeholder="Type your message..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessageHandler(selectedUser._id);
                  }
                }}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-all"
                onClick={() => sendMessageHandler(selectedUser._id)}
              >
                Send
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="flex-1 sm:flex flex-col hidden items-center justify-center text-center p-4">
          <MessageCircleCode className="w-24 h-24 text-gray-400 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">Your Messages</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Select a user to start chatting.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
