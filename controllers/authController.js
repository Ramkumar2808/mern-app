import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

import User from "../database/models/UserModel.js";
import generateAuthToken from "../utils/generateAuthToken.js";
import transporter from "../config/mailConfig.js";
import PasswordResetToken from "../database/models/ResetPasswordTokenModel.js";
import { generateTOTP, validateTOTP } from "../utils/totpUtils.js";

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the provided password matches the user's hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate and issue a JWT token
    const token = generateAuthToken(user._id);

    // Set the JWT token in a cookie
    res.cookie("jwt", token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // 1 Hour
      // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Create a new user object without the password field
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // // Send the email to the logged-in user
    // const emailContent = {
    //   // from: "your_email_address", // Sender email address
    //   to: user.email, // Logged-in user's email address
    //   subject: "You Signed In", // Email subject
    //   text: `Hello ${user.name}, You have successfully signed in!`, // Email body (plain text)
    // };

    // await transporter.sendMail(emailContent);

    res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const generateQRCode = async (req, res, next) => {
  try {
    // Generate a secret for the user
    const secret = speakeasy.generateSecret();

    // Generate an OTP Auth URL
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: "Your App Name",
      issuer: "Your Company",
      encoding: "base32",
    });

    // Generate a QR code for the OTP Auth URL
    qrcode.toDataURL(otpAuthUrl, (err, dataUrl) => {
      if (err) {
        return res.status(500).json({ message: "Failed to generate QR code" });
      }
      res.status(200).json({ secret: secret.ascii, qrCode: dataUrl });
    });
  } catch (error) {
    next(error);
  }
};

// Controller method for generating TOTP code
export const generateTOTPCode = async (req, res, next) => {
  try {
    const { secret } = req.body;

    // Generate the TOTP code using the secret
    const totpCode = generateTOTP(secret);

    // Send the TOTP code to the client
    res.status(200).json({ totpCode });
  } catch (error) {
    next(error);
  }
};

// Controller method for validating TOTP code
export const validateTOTPCode = async (req, res, next) => {
  try {
    const { secret, token } = req.body;

    // Validate the TOTP code against the secret
    const isValid = validateTOTP(secret, token);

    if (isValid) {
      res.status(200).json({ message: "TOTP code is valid" });
    } else {
      res.status(400).json({ message: "Invalid TOTP code" });
    }
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User with the provided email already exists", 409);
    }

    // Create a new user document
    const user = new User({
      name,
      email,
      password,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = randomBytes(20).toString("hex");

    const expirationDate = new Date(Date.now() + 3600000); // Token will expire in 1 hour

    // Create a new instance of the PasswordResetToken model
    const passwordResetToken = new PasswordResetToken({
      token: resetToken,
      user: user._id, // Assuming you have the user object available
      expiresAt: expirationDate,
    });

    await passwordResetToken.save();

    // Send the password reset link via email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const emailContent = {
      // from: "your_email_address", // Sender email address
      to: user.email, // User's email address
      subject: "Password Reset", // Email subject
      text: `You are receiving this email because you (or someone else) have requested to reset the password for your account. Please click on the following link to reset your password: ${resetUrl}`, // Email body (plain text)
    };

    await transporter.sendMail(emailContent);

    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find the reset token in the resetPasswordToken model and check if it's not expired
    const resetTokenRecord = await PasswordResetToken.findOne({
      token: token,
      expiresAt: { $gt: Date.now() },
    });

    if (!resetTokenRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find the user using the user ID from the reset token record
    const user = await User.findById(resetTokenRecord.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = password;

    // Update the user's password and clear the reset token fields
    user.password = hashedPassword;

    await user.save();

    // Optionally, you can also delete the reset token record from the resetPasswordToken model
    await PasswordResetToken.findByIdAndDelete(resetTokenRecord._id);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  // Clear the jwt cookie by setting it to an empty value and setting its expiration to a past date
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
  });

  res.status(200).json({ message: "Logout successful" });
};
