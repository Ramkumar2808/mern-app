import User from "../database/models/UserModel.js";

// Create a new user
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if a user with the provided email already exists
    // const existingUser = await User.findOne({ email });

    // if (existingUser) {
    //   throw new Error("User with the provided email already exists", 409);
    // }

    // Create a new user document
    const user = new User({
      name,
      email,
      password,
      role,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all users
// export const getAllUsers = async (req, res, next) => {
//   const page = parseInt(req.query.page) || 1;
//   const pageSize = parseInt(req.query.pageSize) || 10;
//   try {
//     // Calculate the skip value to skip the appropriate number of documents
//     const skip = (page - 1) * pageSize;

//     // Retrieve all users from the database
//     const users = await User.find()
//       .select("-password")
//       .skip(skip)
//       .limit(pageSize);

//     // Fetch the total number of users for calculating total pages
//     const totalCount = await User.countDocuments();
//     const totalPages = Math.ceil(totalCount / pageSize);

//     res.status(200).json({ users, totalCount, totalPages });
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllUsers = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  try {
    // Calculate the skip value to skip the appropriate number of documents
    const skip = (page - 1) * pageSize;

    // Use the aggregation pipeline to fetch paginated users and total count in a single query
    const [users, totalCount] = await Promise.all([
      User.aggregate([
        { $project: { password: 0 } }, // Exclude the password field
        { $skip: skip },
        { $limit: pageSize },
      ]),
      User.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({ users, totalCount, totalPages });
  } catch (error) {
    next(error);
  }
};

// Get a single user by ID
export const getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find a user by the provided ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user by the provided ID
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Find the user by the provided ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's name and email
    user.name = name;
    user.email = email;
    user.role = role;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Delete a user by ID
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the user by the provided ID and delete it
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
