import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getSingleProject,
  updateProject,
} from "../../controllers/project/projectController.js";

const router = express.Router();

// Create a new project
router.post("", createProject);

// Get all projects
router.get("", getAllProjects);

// Get a single project by ID
router.get("/:id", getSingleProject);

// Update a project by ID
router.put("/:id", updateProject);

// Delete a project by ID
router.delete("/:id", deleteProject);

export default router;
