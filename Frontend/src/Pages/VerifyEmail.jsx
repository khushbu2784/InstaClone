// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { Loader2, CheckCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import instaLogo from "@/assets/Logo.png";

// const VerifyEmail = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email;

//   const [otp, setOtp] = useState("");
//   const [status, setStatus] = useState("idle"); // idle | verifying | success | error
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (status === "success") {
//       const timer = setTimeout(() => navigate("/login"), 2500);
//       return () => clearTimeout(timer);
//     }
//   }, [status, navigate]);

//   const handleVerify = async () => {
//     setStatus("verifying");
//     setMessage("");

//     try {
//       const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/verifyEmail`, {
//         email,
//         otp,
//       });

//       setStatus("success");
//       setMessage(res.data.message);
//     } catch (err) {
//       setStatus("error");
//       setMessage(err.response?.data?.message || "Verification failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="bg-white text-center p-6 rounded-xl shadow-lg w-full max-w-md space-y-5">
//         <img src={instaLogo} alt="InstaClone" className="h-10 mx-auto" />

//         <h2 className="text-xl font-bold text-gray-800">Verify Your Email</h2>
//         <p className="text-gray-600">Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span></p>

//         {status === "success" ? (
//           <div className="space-y-3">
//             <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
//             <p className="text-green-600 font-medium text-lg">Email verified successfully! 🎉</p>
//             <p className="text-gray-500 text-sm">Redirecting to login...</p>
//           </div>
//         ) : (
//           <>
//             <input
//               type="text"
//               maxLength={6}
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//               className="w-full p-3 text-lg text-center tracking-widest font-mono rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Enter OTP"
//             />

//             {status === "verifying" ? (
//               <div className="flex justify-center items-center gap-2 bg-blue-200 px-4 py-2">
//                 <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
//                 <p className="bg-blue-500 hover:bg-blue-600">Verifying...</p>
//               </div>
//             ) : (
//               <>
//                 {message && (
//                   <p className={`text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}>
//                     {message}
//                   </p>
//                 )}
//                 <Button
//                   onClick={handleVerify}
//                   className="bg-blue-500 hover:bg-blue-600 text-white w-full"
//                   disabled={otp.length !== 6}
//                 >
//                   Verify
//                 </Button>
//               </>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;


import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import instaLogo from "@/assets/Logo.png";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle"); // idle | verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => navigate("/login"), 2500);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  // Auto verify when OTP becomes 6 digits
  useEffect(() => {
    if (otp.length === 6 && status === "idle") {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async () => {
    setStatus("verifying");
    setMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/verifyEmail`,
        { email, otp }
      );

      setStatus("success");
      setMessage(res.data.message);
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Verification failed");
      setOtp(""); // Clear wrong OTP
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white text-center p-6 rounded-xl shadow-lg w-full max-w-md space-y-5">
        
        <img src={instaLogo} alt="InstaClone" className="h-10 mx-auto" />

        <h2 className="text-xl font-bold text-gray-800">Verify Your Email</h2>
        <p className="text-gray-600">
          Enter the 6-digit OTP sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        {status === "success" ? (
          <div className="space-y-3">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="text-green-600 font-medium text-lg">
              Email verified successfully! 🎉
            </p>
            <p className="text-gray-500 text-sm">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full p-3 text-lg text-center tracking-widest font-mono rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter OTP"
            />

            {status === "verifying" ? (
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2" disabled>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </Button>
            ) : (
              <>
                {message && (
                  <p
                    className={`text-sm ${
                      status === "error" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {message}
                  </p>
                )}

                <Button
                  onClick={handleVerify}
                  className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                  disabled={otp.length !== 6}
                >
                  Verify
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
