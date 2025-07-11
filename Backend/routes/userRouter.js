import express from "express";
import {
  editProfile, getProfile, getSuggestedUsers, login, logout, register,changePassword, followOrUnfollow, search, getFollowers, getFollowing, blockOrUnblockUser, getBlockedUsers,
  removeFollower, forgotPassword, resetPassword, verifyEmail, resendVerification
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register)
router.post("/verifyEmail", verifyEmail); // ✅ must be POST
router.post("/resendVerification", resendVerification);
router.put("/changePassword", isAuthenticated, changePassword);
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers)
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow)
router.route('/search').get(isAuthenticated, search)
router.get("/:id/followers", isAuthenticated, getFollowers);
router.get("/:id/following", isAuthenticated, getFollowing);
router.post("/block/:id", isAuthenticated, blockOrUnblockUser);
router.get("/blocked", isAuthenticated, getBlockedUsers);
router.put("/removeFollower/:id", isAuthenticated, removeFollower);

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

export default router;