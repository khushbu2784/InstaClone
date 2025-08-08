import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import PostPreviewModel from "@/components/post/PostPreviewModel";
import { Link } from "react-router-dom";
import noProfile from "@/assets/Profile.png";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import.meta.env.VITE_API_BASE_URL;

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/post/explore`,
          {
            withCredentials: true,
          }
        );
        setPosts(res.data.posts);
      } catch (err) {
        console.error("Failed to load explore posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExplorePosts();
  }, []);

  // Search users
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        setUserLoading(true);
        axios
          .get(
            `${import.meta.env.VITE_API_BASE_URL}/user/search?query=${search}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => setUserResults(res.data.users || []))
          .catch(console.error)
          .finally(() => setUserLoading(false));
      } else {
        setUserResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="p-4 max-w-6xl sm:mx-60 sm:mr-10 mx-auto mt-3">
      <div className="flex items-center justify-between mb-6">
        {/* 🔝 Title */}
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Explore</h2>

        {/* 🔍 Search Bar */}
        <div className="mb-4 sm:w-1/2">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl w-full">
            <SearchIcon className="text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500 dark:placeholder:text-gray-400 text-black dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 👤 Search Results */}
      {search && (
        <div className="mb-6 space-y-2 max-w-md mx-auto">
          {userLoading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Searching...
            </p>
          ) : userResults.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No users found.
            </p>
          ) : (
            userResults.map((user) => (
              <Link
                to={`/profile/${user._id}`}
                key={user._id}
                className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profilePicture} alt={user.userName} />
                  <AvatarFallback>
                    <img src={noProfile} alt="fallback" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{user.userName}</p>
                  {user.name && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.name}
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* 🖼️ Posts Grid */}
      <div className="grid grid-cols-3 gap-[2px] sm:gap-2 md:gap-4">
        {loading ? (
          [...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-full aspect-square rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse"
            />
          ))
        ) : posts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No posts to explore.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="relative w-full aspect-square overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedPost(post);
                setOpen(true);
              }}
            >
              <img
                src={post.image}
                alt="explore"
                className="object-cover w-full h-full hover:brightness-75 transition"
              />
            </div>
          ))
        )}
      </div>

      {/* 📌 Post Modal */}
      <PostPreviewModel open={open} setOpen={setOpen} post={selectedPost} />
    </div>
  );
};

export default Explore;
