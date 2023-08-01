import Project from "../../database/models/ProjectModel.js";
import Client from "../../database/models/ClientModel.js";

// Create a new project
export const createProject = async (req, res, next) => {
  try {
    const { projectName, projectCode, client } = req.body;

    // Create a new project document
    const project = new Project({
      projectName,
      projectCode,
      client,
    });

    // Save the project to the database
    await project.save();

    // Update the client's projects field to include the newly created project's _id
    const updatedClient = await Client.findByIdAndUpdate(
      client,
      { $push: { projects: project._id } },
      { new: true } // To return the updated client document
    );

    res
      .status(201)
      .json({
        message: "Project created successfully",
        project,
        updatedClient,
      });
  } catch (error) {
    next(error);
  }
};

// Get all projects
export const getAllProjects = async (req, res, next) => {
  try {
    // Retrieve all projects from the database
    const projects = await Project.find();

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// Get a single project by ID
export const getSingleProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find a project by the provided ID
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// Update project by the provided ID
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { projectName, projectCode, client } = req.body;

    // Find the project by the provided ID
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update the project's fields
    project.projectName = projectName;
    project.projectCode = projectCode;
    project.client = client;

    // Save the updated project to the database
    await project.save();

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    next(error);
  }
};

// Delete a project by ID
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the project by the provided ID and delete it
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};
