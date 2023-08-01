import express from "express";
import {
  createClient,
  deleteClient,
  getAllClients,
  getSingleClient,
  updateClient,
} from "../../controllers/client/clientController.js";

const router = express.Router();

// Create a new client
router.post("", createClient);

// Get all clients
router.get("", getAllClients);

// Get a single client by ID
router.get("/:id", getSingleClient);

// Update a client by ID
router.put("/:id", updateClient);

// Delete a client by ID
router.delete("/:id", deleteClient);

export default router;
