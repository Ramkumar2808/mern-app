import express from "express";
import {
  login,
  register,
  forgotPassword,
  logout,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("", login);

router.get("/register", register);

router.post("/forgotPassword", forgotPassword);

router.post("/resetPassword/:token", resetPassword);

router.get("/logout", logout);

export default router;
