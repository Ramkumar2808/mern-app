// Importing the default NodeJS modules
import { fileURLToPath } from "url";
import { dirname } from "path";

// Importing Third Party Libraries
import express from "express";
import "dotenv/config";

// Importing Internal Modules
import connectDB from "./config/connectDB.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/client/clientRoutes.js";
import projectRoutes from "./routes/project/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import { authorizeRoles, protect } from "./middlewares/authMiddleware.js";

connectDB();

// Creating an instance of the Express application
const app = express();

// Setting the port number to either the value from the environment variable `PORT` or 5000 as a fallback
const port = process.env.PORT || 5000;

// Adding middleware to parse JSON data and URL-encoded data in requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Use cookie-parser middleware before your routes
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

// Allow access only to users with roles 'superadmin'
// app.use("/api/clients", protect, authorizeRoles("super_admin"), clientRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", protect, authorizeRoles("super_admin"), projectRoutes);

app.use("/api/users", userRoutes);

// Getting the filename and the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serving static files from the `public` directory
// if (process.env.NODE_ENV === 'production') {
//     const __dirname = path.resolve();
//     app.use(express.static(path.join(__dirname, '/frontend/dist')));

//     app.get('*', (req, res) =>
//       res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
//     );
//   } else {
//     app.get('/', (req, res) => {
//       res.send('API is running....');
//     });
//   }

app.use(express.static(`${__dirname}/public`));

app.get("/test", (req, res) => {
  res.send("API is running....");
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Starting the server and listening on the specified port
app.listen(port, function () {
  console.log(`Server listening on port: ${port}`);
});
