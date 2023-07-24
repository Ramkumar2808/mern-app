import jwt from "jsonwebtoken";
import User from "../database/models/userModel.js";

const protect = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        // Handle token verification error
        return res
          .status(401)
          .json({ message: "Not authorized, token failed" });
      } else {
        try {
          req.user = await User.findById(decoded.userId).select("-password");
          next();
        } catch (error) {
          // Handle user retrieval error
          return res
            .status(401)
            .json({ message: "Not authorized, user not found" });
        }
      }
    });
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect };
