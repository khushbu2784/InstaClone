import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import noProfile from "@/assets/Profile.png";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages]);

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="p-4 dark:border-gray-700 bg-white dark:bg-gray-900 top-0 z-10">
        <div className="flex flex-col items-center">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={selectedUser?.profilePicture || noProfile}
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
          <span className="mt-1 font-semibold">{selectedUser?.userName}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button
              className="h-7 mt-2 bg-gray-300 text-black rounded-lg"
              variant="secondary"
            >
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      <div
        id="message-container"
        className="flex-1 min-h-0 overflow-y-auto px-4 py-2 pb-8 sm:pb-2 space-y-3 no-scrollbar"
      >
        {(messages || []).length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg) => {
            const isSender =
              msg.senderId === user._id || msg.senderId?._id === user._id;
            return (
              <div
                key={msg._id}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col items-start gap-1 max-w-[70%]">
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-md break-words ${
                      isSender
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-200 text-gray-900 self-start"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <div
                    className={`text-xs text-gray-400 ml-2 ${
                      isSender ? "text-right self-end" : "text-left self-start"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
