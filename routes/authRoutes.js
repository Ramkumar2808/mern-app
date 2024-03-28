import express from "express";
import {
  login,
  register,
  forgotPassword,
  logout,
  resetPassword,
  generateQRCode,
  generateTOTPCode,
  validateTOTPCode,
} from "../controllers/authController.js";

const router = express.Router();

router.post("", login);

router.get("/mfa/setup", generateQRCode);

// router.get("/mfa/totp", totp);

// Route for generating TOTP code
router.post("/mfa/totp/generate", generateTOTPCode);

// Route for validating TOTP code
router.post("/mfa/totp/validate", validateTOTPCode);

router.get("/register", register);

router.post("/forgotPassword", forgotPassword);

router.post("/resetPassword/:token", resetPassword);

router.get("/logout", logout);

export default router;
