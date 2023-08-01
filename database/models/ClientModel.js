import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      unique: true,
    },
    clientCode: {
      type: String,
      required: true,
      unique: true,
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
