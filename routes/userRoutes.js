import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new user
router.post("", createUser);

// Get all users
router.get("", protect, getAllUsers);

// Get a single user by ID
router.get("/:id", getSingleUser);

// Update a user by ID
router.put("/:id", updateUser);

// Delete a user by ID
router.delete("/:id", deleteUser);

export default router;
