import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validate";
import instaLogo from "@/assets/Logo.png";
import { Link } from "react-router-dom";
import.meta.env.VITE_API_BASE_URL

const Login = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showResend, setShowResend] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/login`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        reset();
        navigate("/");
      }
    } catch (error) {
      const resData = error?.response?.data;

      if (resData?.unverified) {
        toast.warning(resData.message || "Email not verified");
        setShowResend(true);
        setUnverifiedEmail(data.email);
      } else {
        toast.error(resData?.message || "Login failed");
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/resendVerification`,
        { email: unverifiedEmail },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Verification email sent");
      setShowResend(false);
      navigate("/verifyEmail", { state: { email: unverifiedEmail } });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to resend verification"
      );
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="mt-6">
          <img src={instaLogo} alt="Logo" className="h-10 w-36 mb-10 mx-auto" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              className="block mb-1 text-sm text-gray-700 font-semibold"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm font-semibold mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block mb-1 text-sm text-gray-700 font-semibold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm font-semibold mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Link
            to="/forgotPassword"
            className="text-blue-500 text-sm ml-2 mt-2 hover:text-blue-600"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 text-white font-medium rounded-md transition duration-200 ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* 🔁 Resend Verification Section */}
        {showResend && (
          <div className="text-center text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-2">
            <p>Your email is not verified.</p>
            <button
              onClick={handleResendVerification}
              className="text-blue-600 hover:underline mt-1 font-medium"
            >
              Resend Verification Email
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline hover:text-blue-600"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
