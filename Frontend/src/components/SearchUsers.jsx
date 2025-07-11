import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import noProfile from "@/assets/Profile.png";

const SearchUsers = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

useEffect(() => {
  const fetchUsers = async () => {
    if (!query.trim()) {
      setResults([]);
      setNoResults(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/search?query=${query}`,
        { withCredentials: true }
      );

      const foundUsers = Array.isArray(res.data.users) ? res.data.users : [];
      setResults(foundUsers);
      setNoResults(foundUsers.length === 0);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const delay = setTimeout(fetchUsers, 300);

  return () => clearTimeout(delay);
}, [query]);


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full sm:w-[400px] overflow-y-auto bg-white dark:bg-gray-900 dark:text-white"
      >
        <SheetHeader>
          <SheetTitle className="text-xl sm:text-2xl font-bold mb-2">
            Search
          </SheetTitle>
        </SheetHeader>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2 mt-4 mb-2">
          <SearchIcon className="text-gray-400 w-5 h-5" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="bg-transparent border-none focus:outline-none w-full text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 text-black dark:text-white"
          />
        </div>

        {loading && (
          <div className="mt-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 animate-pulse rounded-lg"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && noResults && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 ml-1">
            No users found.
          </p>
        )}

        <div className="mt-3 space-y-2">
          {results.map((user) => (
            <Link
              to={`/profile/${user._id}`}
              key={user._id}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-[#222] rounded-lg"
              onClick={() => onOpenChange(false)}
            >
              <Avatar className="h-9 w-9">
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
                {user.bio?.trim() && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.bio}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchUsers;
