import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner"; // Optional: show error to user
import.meta.env.VITE_API_BASE_URL; // Ensure this is set in your environment variables

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/post/all`,
          { withCredentials: true }
        );
        console.log("🌐 Fetching posts from:", import.meta.env.VITE_API_BASE_URL);


        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        } else {
          console.warn("⚠️ Posts fetch failed with success: false");
          toast.error("Failed to load posts");
        }
      } catch (error) {
        console.error("🔴 Fetch error in useGetAllPost:", error.message);
        toast.error("Unable to fetch posts right now.");
      }
    };

    fetchAllPost();
  }, [dispatch]);
};

export default useGetAllPost;
