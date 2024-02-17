// // seeder.js
// const faker = require("faker");
// const mongoose = require("mongoose");

// // Replace <your-mongodb-connection-string> with your actual MongoDB connection string
// mongoose.connect(procees, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Define a user schema and model
// const userSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: String,
//   username: String,
//   password: String,
//   role: String, // New field for the user's role
// });

// const User = mongoose.model("User", userSchema);

// // Array of predefined roles
// const roles = ["admin", "user", "manager", "guest"];

// // Function to generate random user data using Faker, including a random role
// const generateRandomUserData = () => {
//   return {
//     firstName: faker.name.firstName(),
//     lastName: faker.name.lastName(),
//     email: faker.internet.email(),
//     username: faker.internet.userName(),
//     password: faker.internet.password(),
//     role: roles[Math.floor(Math.random() * roles.length)], // Pick a random role from the roles array
//   };
// };

// // Function to seed the database with fake users
// const seedUsers = async (numUsers) => {
//   try {
//     await User.deleteMany(); // Clear existing users from the database

//     const users = [];
//     for (let i = 0; i < numUsers; i++) {
//       users.push(generateRandomUserData());
//     }

//     await User.create(users); // Insert the new fake users into the database
//     console.log(`${numUsers} users seeded successfully.`);
//   } catch (error) {
//     console.error("Error seeding users:", error);
//   } finally {
//     mongoose.disconnect(); // Close the MongoDB connection when done
//   }
// };

// // Call the seedUsers function with the desired number of fake users
// const numberOfFakeUsers = 10; // Change this to the number of fake users you want to generate
// seedUsers(numberOfFakeUsers);
