import express from "express";

const router = express.Router();

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login user & get token
router.post("/login", loginUser);

// @route   POST /api/auth/logout
// @desc    Logout user & clear token
router.post("/logout", logoutUser);

export default router;
