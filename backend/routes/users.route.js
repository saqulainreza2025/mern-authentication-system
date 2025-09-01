import express from "express";
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
  deleteAllUser,
  sendVerifyOTP,
  getUserProfile,
  verifyEmail,
  isUserAuthenticated,
  resetOTP,
  changePassword,
} from "../controllers/users.controller.js";
import { authMiddleWare } from "../middleware/auth.middleware.js";

const router = Router();

//SOME BASIC ROUTES
router.route("/delete-database").get(deleteAllUser);
router.route("/profile/:userId").post(getUserProfile);

//SOME IMPORTANT ROUTES
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authMiddleWare, logout);
router.route("/send-otp").post(authMiddleWare, sendVerifyOTP);

router.route("/verify-email").post(authMiddleWare, verifyEmail);
router.route("/user-authenticated").post(authMiddleWare, isUserAuthenticated);
router.route("/reset-otp").post(authMiddleWare, resetOTP);
router.route("/change-password").post(changePassword);

export { router };
