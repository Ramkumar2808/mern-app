import mongoose from "mongoose";

import User from "../models/userModel.js";

export const seedDataForUsers = async () => {
  try {
    // Define the data you want to seed
    const usersData = [
      { name: "John Doe", email: "johndoe@example.com", password: "password" },
      {
        name: "Jane Smith",
        email: "janesmith@example.com",
        password: "password",
      },
      // Add more user objects as needed
    ];

    // Insert the seed data into the "users" collection using a Mongoose model

    await User.insertMany(usersData);

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Seeder error:", error);
  } finally {
    mongoose.disconnect();
  }
};
