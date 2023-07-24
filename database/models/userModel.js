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

const User = mongoose.model("User", userSchema);

export default User;
