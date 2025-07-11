import React, { useEffect, useState } from "react";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";

const Posts = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/post/all`,
          {
            withCredentials: true,
          }
        );
        dispatch(setPosts(res.data.posts));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [dispatch]);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-28">
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-white dark:bg-gray-800 rounded-md shadow p-4 space-y-4"
            >
              {/* Avatar + Username */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>

              {/* Image Placeholder */}
              <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded" />

              {/* Caption Line */}
              <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : Array.isArray(posts) &&
        posts.filter((post) => post && post._id).length > 0 ? (
        posts
          .filter((post) => post && post._id)
          .map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">No posts available.</p>
      )}
    </div>
  );
};

export default Posts;
