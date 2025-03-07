import jwt from "jsonwebtoken";
import { User } from "../model/userModel.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "You must be logged in to access this resource." });
  }

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    console.log('dedcode user',decoded)
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(404).json({ error: "User not found." });
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token." });
  }
};

