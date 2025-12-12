import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import uploadToCloudinary from "../utils/cloudinary.js";
import crypto from "crypto";
import { getReceiverSocketId, io } from "../socket/socket.js";
import sendEmail from "../utils/sendEmail.js";
import { getResetToken } from "../utils/token.js";
import { sendVerifyEmail } from "../utils/sendVerifyEmail.js";
import { sendWelcomeEmail } from "../utils/sendWelcomeEmail.js";
import { sendPassChangeEmail } from "../utils/sendPassChangeEmail.js";

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(409).json({ message: "Username already taken", success: false });
    }

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const otpCode = crypto.randomInt(100000, 999999).toString();

    const newUser = await User.create({
      userName,
      email: trimmedEmail,
      password: hashedPassword,
      isVerified: false,
      otp: {
        code: otpCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    await sendVerifyEmail(trimmedEmail, userName, otpCode);

    res.status(201).json({
      message: "Signup successful! OTP sent to your email.",
      success: true,
      email: trimmedEmail,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedOtp = user.otp?.code;
    const expiresAt = user.otp?.expiresAt;

    // OTP Checks
    if (!storedOtp || !expiresAt) {
      return res.status(400).json({ message: "No OTP found. Please resend verification." });
    }
    if (new Date() > new Date(expiresAt)) {
      return res.status(400).json({ message: "OTP has expired. Please resend verification." });
    }
    if (String(storedOtp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Mark verified and remove OTP
    user.isVerified = true;
    user.otp = null;
    await user.save();

    // ✅ Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailErr) {
      console.error("❌ Failed to send welcome email:", emailErr.message);
    }

    // ✅ Generate token and set cookie
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
      user,
    });
  } catch (err) {
    console.error("❌ Server error in verifyEmail:", err.message);
    return res.status(500).json({ message: "Server error during email verification" });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified." });
    }

    // ✅ Generate new OTP as object (not number directly)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
    };
    await user.save();

    // ✅ Send OTP email
    await sendVerifyEmail(user.email, user.userName, otpCode);

    res.status(200).json({ success: true, message: "Verification email resent successfully." });
  } catch (err) {
    console.error("🔴 Resend Error:", err);
    res.status(500).json({ success: false, message: "Failed to resend verification email." });
  }
};

// export const login = async (req, res) => {
//   try {
//     const email = req.body.email?.trim();
//     const password = req.body.password?.trim();

//     if (!email || !password) {
//       return res.status(401).json({ message: "Email and password are required.", success: false });
//     }

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) return res.status(401).json({ message: "Incorrect email", success: false });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Incorrect password", success: false });
//     }

//     if (!user.isVerified) {
//       return res.status(403).json({
//         message: "Please verify your email before logging in.",
//         success: false,
//         unverified: true, // ✅ needed by frontend to trigger "resend" option
//       });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

//     user.password = undefined;

//     return res
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       })
//       .status(200)
//       .json({
//         message: `Welcome ${user.userName}`,
//         success: true,
//         user,
//       });

//   } catch (err) {
//     console.error("🔴 Login Error:", err);
//     return res.status(500).json({ message: "Internal Server Error", success: false });
//   }
// };

export const login = async (req, res) => {
  try {
    const loginValue = req.body.email?.trim(); // this can be email OR username
    const password = req.body.password?.trim();

    if (!loginValue || !password) {
      return res.status(401).json({
        message: "Email/Username and password are required.",
        success: false
      });
    }

    // ✔ find using email OR username
    const user = await User.findOne({
      $or: [{ email: loginValue }, { userName: loginValue }]
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or username",
        success: false
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false
      });
    }

    // email verify check
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        success: false,
        unverified: true,
        email: user.email
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    user.password = undefined;

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: `Welcome ${user.userName}`,
        success: true,
        user,
      });

  } catch (err) {
    console.error("🔴 Login Error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const { token, hash, expire } = getResetToken();
  user.resetPasswordToken = hash;
  user.resetPasswordExpire = expire;
  await user.save();

  const resetURL = `${process.env.FRONTEND_URL}/resetPassword/${token}`;
  const html =
    `<div style="background-color: #f2f2f2; padding: 40px 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
      <tr>
        <td style="padding: 30px 30px 20px; text-align: center;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/120px-Instagram_icon.png" width="48" height="48" alt="Instagram" style="margin-bottom: 16px;" />
          <h2 style="font-size: 20px; font-weight: 600; margin: 0;">Reset your password</h2>
        </td>
      </tr>

      <tr>
        <td style="padding: 0 30px 30px; text-align: center; color: #444; font-size: 14px;">
          <p style="margin-bottom: 16px;">
            Hi ${user.name || user.userName || "there"},
            <br/>
            Sorry to hear you’re having trouble logging into your account. If this was you, click the button below to reset your password.
          </p>

          <a href="${resetURL}"
            style="display: inline-block; background-color: #0095f6; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 14px; border-radius: 6px; margin-bottom: 24px;">
            Reset your password
          </a>

          <p style="font-size: 12px; color: #888;">
            If that doesn’t work, copy and paste this link into your browser:<br/>
            <a href="${resetURL}" style="color: #00376b; word-break: break-all;">${resetURL}</a>
          </p>

          <p style="font-size: 12px; color: #888; margin-top: 24px;">
            If you didn’t request a password reset, you can safely ignore this email.
          </p>
        </td>
      </tr>

      <tr>
        <td style="border-top: 1px solid #eee; padding: 20px 30px; text-align: center; font-size: 12px; color: #999;">
          from<br/>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Meta_Platforms_Inc._logo.svg" height="16" alt="Meta" style="margin-top: 4px;" />
          <br/><br/>
          Meta Platforms, Inc., 1601 Willow Road, Menlo Park, CA 94025, US
        </td>
      </tr>
    </table>
  </div> ;`

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset Your Password - InstaClone",
      html,
    });

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error("Failed to send email", err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ message: "Failed to send email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired" });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }
    if (newPassword.length < 8 || !/\d/.test(newPassword) || !/\W/.test(newPassword)) {
      return res.status(400).json({ message: "New password must be at least 8 characters, contain a number and a special character." });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    await sendPassChangeEmail(user);

    return res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out successfully",
      success: true
    })
  } catch (err) {
    console.log(err)
  }
};

export const getProfile = async (req, res) => {
  try {
    const profileUserId = req.params.id;
    const currentUserId = req.id;

    const profileUser = await User.findById(profileUserId)
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: "author",
            select: "userName profilePicture",
          },
          {
            path: "comments",
            populate: {
              path: "author",
              select: "userName profilePicture",
            },
          },
        ],
      })
      .populate({
        path: "bookmarks",
        populate: [
          { path: "author", select: "userName profilePicture" },
          {
            path: "comments",
            populate: {
              path: "author",
              select: "userName profilePicture",
            },
          },
        ],
        options: { sort: { createdAt: -1 } },
      })

      .populate("followers", "userName profilePicture")
      .populate("following", "userName profilePicture");

    const currentUser = await User.findById(currentUserId);
    const isSelfProfile = currentUserId === profileUserId;

    if (
      !isSelfProfile &&
      (profileUser.blockedUsers.includes(currentUserId) ||
        currentUser.blockedUsers.includes(profileUserId))
    ) {
      return res.status(403).json({
        message: "Access denied",
        success: false,
        blocked: true,
      });
    }

    const blockedIds = [...currentUser.blockedUsers, ...currentUser.blockedBy].map(id =>
      id.toString()
    );

    profileUser.bookmarks = profileUser.bookmarks.filter(
      (post) => post?.author && !blockedIds.includes(post.author._id.toString())
    );

    profileUser.followers = profileUser.followers.filter(
      (f) => !blockedIds.includes(f._id.toString())
    );
    profileUser.following = profileUser.following.filter(
      (f) => !blockedIds.includes(f._id.toString())
    );

    const mutualFollowers = profileUser.followers.filter((follower) =>
      currentUser.following.includes(follower._id)
    );

    return res.status(200).json({
      success: true,
      user: profileUser,
      mutualFollowers: mutualFollowers.slice(0, 3),
      mutualCount: mutualFollowers.length,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to fetch profile",
      success: false,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender, userName } = req.body;
    const profilePicture = req.file;
    let clouseResponse;

    if (profilePicture) {
      clouseResponse = await uploadToCloudinary(req.file.buffer);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (userName) user.userName = userName;
    if (profilePicture) user.profilePicture = clouseResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile Updated",
      success: true,
      user
    });
  } catch (err) {
    console.log(err)
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const me = await User.findById(req.id).select("blockedUsers blockedBy");

    if (!me) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const blockedUserIds = [...me.blockedUsers, ...me.blockedBy];
    ;

    const suggestedUsers = await User.find({
      _id: { $nin: [...blockedUserIds, req.id] }
    }).select("-password");

    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
      })
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    })
  } catch (err) {
    console.log(err)
  }
}

export const search = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "No query provided" });

  try {
    const me = await User.findById(req.id).select("blockedUsers blockedBy");
    if (!me) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const blockedUserIds = [...me.blockedUsers, ...me.blockedBy];
    const users = await User.find({
      _id: { $nin: blockedUserIds },
      $or: [
        { userName: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).select("userName name profilePicture  bio");
    return res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const own = req.id;
    const myfollowing = req.params.id;
    if (own === myfollowing) {
      return res.status(400).json({
        message: "You can't follow/unfollow yourself",
        success: false,
      });
    }
    const user = await User.findById(own);
    const targetUser = await User.findById(myfollowing);
    if (!user || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(myfollowing);
    if (isFollowing) {
      await Promise.all([
        User.updateOne({ _id: own }, { $pull: { following: myfollowing } }),
        User.updateOne({ _id: myfollowing }, { $pull: { followers: own } }),
      ]);
    } else {
      await Promise.all([
        User.updateOne({ _id: own }, { $push: { following: myfollowing } }),
        User.updateOne({ _id: myfollowing }, { $push: { followers: own } }),
      ]);

      //Real-time notification logic
      const userInfo = await User.findById(own).select("userName profilePicture");
      const targetSocketId = getReceiverSocketId(myfollowing);

      if (targetSocketId) {
        io.to(targetSocketId).emit("notification", {
          type: "follow",
          userId: own,
          userDetails: userInfo,
          message: "started following you",
        });
      }
    }

    //Updated user data to reflect follow/unfollow changes
    const updatedUser = await User.findById(own).select("-password");
    const updatedTargetUser = await User.findById(myfollowing)
      .select("-password")
      .populate("followers", "userName profilePicture")
      .populate("following", "userName profilePicture");

    return res.status(200).json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      success: true,
      user: updatedUser,
      targetUser: updatedTargetUser,
    });

  } catch (err) {
    console.error("Follow/Unfollow Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// export const removeFollower = async (req, res) => {
//   try {
//     const currentUserId = req.id;
//     const followerId = req.params.id;
//     const currentUser = await User.findById(currentUserId);
//     const followerUser = await User.findById(followerId);

//     if (!currentUser || !followerUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Remove followerId from currentUser.followers
//     currentUser.followers = currentUser.followers.filter(
//       (id) => id.toString() !== followerId
//     );

//     // Remove currentUserId from followerUser.following
//     followerUser.following = followerUser.following.filter(
//       (id) => id.toString() !== currentUserId
//     );

//     await currentUser.save();
//     await followerUser.save();

//     res.status(200).json({
//       message: "Follower removed successfully",
//       updatedCurrentUser: currentUser,
//       updatedFollowerUser: followerUser,
//     });
//   } catch (error) {
//     console.error("Error removing follower:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const removeFollower = async (req, res) => {
  try {
    const currentUserId = req.id;
    const followerId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const followerUser = await User.findById(followerId);

    if (!currentUser || !followerUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove followerId from currentUser.followers
    currentUser.followers = currentUser.followers.filter(
      (id) => id.toString() !== followerId
    );

    // Remove currentUserId from followerUser.following
    followerUser.following = followerUser.following.filter(
      (id) => id.toString() !== currentUserId
    );

    // Save both
    await currentUser.save();
    await followerUser.save();

    // 🔥 RELOAD updated user (VERY IMPORTANT)
    const updatedCurrent = await User.findById(currentUserId)
      .populate("followers", "_id userName profilePicture")
      .populate("following", "_id userName profilePicture");

    return res.status(200).json({
      message: "Follower removed successfully",
      updatedCurrentUser: updatedCurrent, // always fresh & accurate
    });
  } catch (error) {
    console.error("Error removing follower:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const profileUser = await User.findById(req.params.id).populate("followers", "userName profilePicture");
    const currentUser = await User.findById(req.id);

    if (!profileUser || !currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    //Combined blocked users logic
    const blockedUserIds = [
      ...currentUser.blockedUsers,
      ...currentUser.blockedBy,
      ...profileUser.blockedUsers,
      ...profileUser.blockedBy,
    ].map(id => id.toString());

    const filteredFollowers = profileUser.followers.filter(
      (f) => !blockedUserIds.includes(f._id.toString())
    );

    res.status(200).json({ success: true, followers: filteredFollowers });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ success: false, message: "Server error while fetching followers" });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const profileUser = await User.findById(req.params.id).populate("following", "userName profilePicture");
    const currentUser = await User.findById(req.id);

    if (!profileUser || !currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const blockedUserIds = [
      ...currentUser.blockedUsers,
      ...currentUser.blockedBy,
      ...profileUser.blockedUsers,
      ...profileUser.blockedBy,
    ].map(id => id.toString());

    const filteredFollowing = profileUser.following.filter(
      (f) => !blockedUserIds.includes(f._id.toString())
    );

    res.status(200).json({ success: true, following: filteredFollowing });
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json({ success: false, message: "Server error while fetching following" });
  }
};

export const blockOrUnblockUser = async (req, res) => {
  try {
    const myId = req.id;
    const targetId = req.params.id;

    if (myId === targetId)
      return res.status(400).json({ message: "Can't block yourself" });

    const me = await User.findById(myId);
    const target = await User.findById(targetId);
    const isBlocked = me.blockedUsers.includes(targetId);

    if (isBlocked) {
      // Unblock
      me.blockedUsers.pull(targetId);
      target.blockedBy.pull(myId);
    } else {
      // Block
      me.blockedUsers.push(targetId);
      target.blockedBy.push(myId);

      // Optional: also remove follow relationships
      me.following.pull(targetId);
      me.followers.pull(targetId);
      target.following.pull(myId);
      target.followers.pull(myId);
    }

    await me.save();
    await target.save();

    res.status(200).json({
      message: isBlocked ? "User unblocked" : "User blocked",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const getBlockedUsers = async (req, res) => {
  try {
    const me = await User.findById(req.id).populate({
      path: "blockedUsers",
      select: "userName name profilePicture",
    });

    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      blockedUsers: me.blockedUsers,
    });
  } catch (err) {
    console.error("Error fetching blocked users:", err);
    return res.status(500).json({ error: "Server error" });
  }
};



