import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import instaLogo from "@/assets/Logo.png";
import.meta.env.VITE_API_BASE_URL

const Signup = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    criteriaMode: "all",
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      email: data.email.trim(),
      userName: data.userName.trim(),
      password: data.password.trim(),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/register`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        reset();
        navigate("/verifyEmail", { state: { email: res.data.email } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="flex items-center w-screen h-screen bg-gray-100 justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        {/* <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2> */}
        <div className="mt-6">
          <img src={instaLogo} alt="Logo" className="h-10 w-36 mb-10 mx-auto" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Username */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="userName"
            >
              Username
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              id="userName"
              placeholder="Enter your username"
              {...register("userName")}
            />
            {errors.userName && (
              <p className="text-red-500 text-sm font-semibold mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm font-semibold mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm font-semibold mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 flex justify-center items-center  ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
