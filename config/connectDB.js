import mongoose from "mongoose";
import { dbSeed } from "../database/seeders/databaseSeeder.js";

const connectDB = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to the database");
    // await dbSeed();
    // console.log("data seeded successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the application with a failure status
  }
};

export default connectDB;
