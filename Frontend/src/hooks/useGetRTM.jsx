import { setMessages, incrementUnread } from "@/redux/chatSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { selectedUser } = useSelector((store) => store.auth);
  const messagesRef = useRef([]);

  // Keep messagesRef updated with latest messages
  const messages = useSelector((store) => store.chat.messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      dispatch(setMessages([...messagesRef.current, newMessage]));

      if (newMessage.senderId !== selectedUser?._id) {
        dispatch(incrementUnread(newMessage.senderId));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser, dispatch]);
};

export default useGetRTM;
