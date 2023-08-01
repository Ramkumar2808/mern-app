import Client from "../../database/models/ClientModel.js";

// *Create a new client
export const createClient = async (req, res, next) => {
  try {
    const { clientName, clientCode } = req.body;

    // Create a new client document
    const client = new Client({
      clientName,
      clientCode,
    });

    // Save the client to the database
    await client.save();

    res.status(201).json({ message: "Client created successfully", client });
  } catch (error) {
    next(error);
  }
};

// *Get all clients
export const getAllClients = async (req, res, next) => {
  try {
    // Retrieve all clients from the database
    const clients = await Client.find().sort({ createdAt: -1 });

    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

// *Get a single client by ID
export const getSingleClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find a client by the provided ID
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

// *Update client by the provided ID
export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clientName, clientCode } = req.body;

    // Find the client by the provided ID
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Update the client's fields
    client.clientName = clientName;
    client.clientCode = clientCode;

    // Save the updated client to the database
    await client.save();

    res.status(200).json({ message: "Client updated successfully", client });
  } catch (error) {
    next(error);
  }
};

// *Delete a client by ID
export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the client by the provided ID and delete it
    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    next(error);
  }
};
