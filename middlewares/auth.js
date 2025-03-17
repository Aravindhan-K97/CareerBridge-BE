import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // ✅ Check for cookies
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) return next(new ErrorHandler("User Not Found", 401));
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid Token", 401));
  }
});
