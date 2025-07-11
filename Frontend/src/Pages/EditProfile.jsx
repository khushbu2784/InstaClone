import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import noProfile from "@/assets/Profile.png";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || "",
    gender: user?.gender || "male",
  });
  const [preview, setPreview] = useState(user?.profilePicture);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });
      setPreview(URL.createObjectURL(file)); // ✅ Show preview
    }
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("gender", input.gender);
    formData.append("bio", input.bio);
    if (input.profilePhoto && typeof input.profilePhoto !== "string") {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/profile/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        toast.success(res.data.message);
        navigate(`/profile/${user?._id}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-10">
      <section className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 space-y-6">
        {/* <h1 className="font-bold text-2xl text-center">Edit Profile</h1> */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            className="text-lg text-black dark:text-white bg-gray-100 hover:bg-gray-200 rounded-xl border-gray-500 font-medium dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            ← Back
          </Button>
          <h1 className="font-bold text-2xl text-center flex-1">
            Edit Profile
          </h1>
        </div>

        {/* Profile Picture + Name */}
        <div className="flex items-center justify-between flex-wrap gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${user?._id}`}>
              <Avatar className="w-14 h-14">
                <AvatarImage src={preview} />
                <AvatarFallback>
                  <img
                    src={noProfile}
                    alt="No profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className="font-semibold text-sm">
                <Link to={`/profile/${user?._id}`}>{user?.userName}</Link>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {user?.bio || "Bio here..."}
              </p>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => imageRef.current.click()}
            className="bg-[#0095F6] h-9 rounded-md text-white hover:bg-[#2a8ccd]"
          >
            Change Photo
          </Button>
        </div>

        {/* Bio */}
        <div>
          <h2 className="font-semibold mb-1">Bio</h2>
          <Textarea
            className="focus-visible:ring-transparent border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            placeholder="Tell something about yourself..."
          />
        </div>

        {/* Gender */}
        <div>
          <h2 className="font-semibold mb-1">Gender</h2>
          <Select value={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-[200px] border-gray-300 dark:border-gray-700 focus-visible:ring-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="dark:text-white dark:border-gray-700">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            onClick={editProfileHandler}
            disabled={loading}
            className="bg-[#0095F6] hover:bg-[#2a8ccd] text-white"
          >
            {loading ? "Updating..." : "Submit"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
