import bcrypt from "bcrypt";

const hashPassword = async (doc, next) => {
  // Execute this function only if the password field has been modified
  if (!doc.isModified("password")) {
    return next(); // Move to the next middleware or callback
  }

  // Generate a salt with a factor of 10
  const salt = await bcrypt.genSalt(10);

  // Hash the password using the generated salt
  const hashedPassword = await bcrypt.hash(doc.password, salt);

  // Replace the original plain text password with the hashed password
  doc.password = hashedPassword;
};

export default hashPassword;
