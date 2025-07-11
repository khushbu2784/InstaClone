import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserProfile } from "../redux/authSlice";

const useGetUserProfile = (userId) => {
  const [mutualFollowers, setMutualFollowers] = useState([]);
  const [mutualCount, setMutualCount] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const dispatch = useDispatch();

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/${userId}/profile`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUserProfile(res.data.user));
        setMutualFollowers(res.data.mutualFollowers || []);
        setMutualCount(res.data.mutualCount || 0);
        setBlocked(false); // reset blocked
      }
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.blocked) {
        setBlocked(true); // user is blocked or was blocked
      } else {
        console.error("Failed to fetch user profile", error);
      }
    }
  }, [userId, dispatch]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    refetch: fetchUserProfile,
    mutualFollowers,
    mutualCount,
    blocked,
  };
};

export default useGetUserProfile;

