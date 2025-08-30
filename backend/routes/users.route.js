import express from "express";
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
} from "../controllers/users.controller.js";
import { authMiddleWare } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authMiddleWare, logout);

export { router };
