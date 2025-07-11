import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User not authorized", success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded?.userId) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }
    req.id = decoded.userId; // ✅ assign user ID to req.id
    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ message: "Unauthorized", success: false });
  }
};

export default isAuthenticated;

// import jwt from "jsonwebtoken";

// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     console.log("🟡 Token:", token); // DEBUG: See if token exists

//     if (!token) {
//       return res.status(401).json({ message: "User not authorized", success: false });
//     }

//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     console.log("🟢 Decoded:", decoded); // DEBUG: Check decoded result

//     if (!decoded?.userId) {
//       return res.status(401).json({ message: "Invalid token", success: false });
//     }

//     req.id = decoded.userId;
//     next();
//   } catch (err) {
//     console.error("🔴 JWT error:", err);
//     res.status(401).json({ message: "Unauthorized", success: false });
//   }
// };

// export default isAuthenticated;
