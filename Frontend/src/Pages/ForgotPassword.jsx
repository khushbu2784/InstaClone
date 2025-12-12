import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmailSentPopup = ({ email, onClose }) => {
  const maskedEmail = (email) => {
    const [name, domain] = email.split("@");
    return (
      name[0] +
      "*".repeat(Math.max(name.length - 3, 1)) +
      name.slice(-1) +
      "@" +
      domain
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[22px] px-6 py-6 w-[60%] max-w-sm text-center shadow-xl">
        <h2 className="bg-white text-xl text-black mb-2">Email Sent</h2>
        <p className="bg-white text-sm text-gray-700 leading-relaxed">
          We sent an email to{" "}
          <span className="font-semibold">{maskedEmail(email)} </span>
          with a link to get back into your account.
        </p>
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full pt-2 text-sm text-blue-500 hover:text-blue-600 border-t border-gray-300 font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleForgotPassword = async () => {
    if (!email || !isEmailValid)
      return toast.error("Please enter a valid email");
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/forgotPassword`,
        { email }
      );  
      setShowConfirmation(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4 text-center">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 ">
            Trouble logging in?
          </h2>
          <p className="text-sm text-gray-600">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400 text-sm "
          />

          <Button
            onClick={handleForgotPassword}
            disabled={!isEmailValid || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </div>

      {/* ✅ Instagram-style popup */}
      {showConfirmation && (
        <EmailSentPopup
          email={email}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
};

export default ForgotPassword;
