import mongoose from "mongoose";
import hashPassword from "../../utils/hashPassword.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      set: (value) => {
        if (value) {
          return value.replace(/\s+/g, " ").trim();
        }
        return value;
      },
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email must be unique"],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["super_admin", "admin", "lead", "coder", "auditor"],
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  { timestamps: true }
);

// Pre-save hook to automatically hash the password before saving a user document
userSchema.pre("save", async function (next) {
  try {
    await hashPassword(this, next);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save hook to check if the user is already assigned to a team
// userSchema.pre("save", async function (next) {
//   if (this.isModified("team")) {
//     // Check if the user already belongs to a team
//     const existingUser = await this.constructor.findOne({ team: this.team });

//     if (existingUser && !this._id.equals(existingUser._id)) {
//       const err = new Error("User is already assigned to another team");
//       return next(err);
//     }
//   }

//   next();
// });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
