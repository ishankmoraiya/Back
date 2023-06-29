import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Login first" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded._id);

  next();
};

export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized: Admin only" });
  }
  next();
};
