import { User } from "../models/user.model.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authMiddleWare = asyncHandler(async (req, res, next) => {
  try {
    // Get refresh token from cookie
    const token =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      g;
      throw new ApiErrorResponse(
        401,
        "Unauthorized request - no token provided"
      );
    }

    // Verify refresh token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiErrorResponse(401, "Unauthorized request - user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiErrorResponse(401, "Invalid or expired refresh token");
  }
});

export { authMiddleWare };
