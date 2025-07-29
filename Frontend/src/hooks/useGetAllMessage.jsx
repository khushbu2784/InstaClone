import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages, resetUnread } from "@/redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAllMessages = async () => {
      if (!selectedUser?._id) return; // Exit if no user selected

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/message/all/${selectedUser._id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
          dispatch(resetUnread(selectedUser._id)); 
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchAllMessages();
  }, [selectedUser]); // Run only when selectedUser._id changes
};

export default useGetAllMessage;
