import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      unique: true,
    },
    projectCode: {
      type: String,
      required: true,
      unique: true,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
