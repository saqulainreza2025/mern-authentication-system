import { User } from "../models/user.model.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authMiddleWare } from "../middleware/auth.middleware.js";

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    // Get the user from req.body
    const { name, email, password } = req.body;

    // Check none of the fields are empty
    if (
      [name, email, password].some((field) => !field || field.trim() === "")
    ) {
      throw new ApiErrorResponse(400, "All fields are required ❌");
    }

    //Before registering check whether user Already exist or not
    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new ApiErrorResponse(500, "User Already Exist !");
    }

    // Save user to the database
    const user = await User.create({
      name,
      email,
      password,
    });

    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    // Return success response
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "User registered successfully ✅",
          userWithoutPassword
        )
      );
  } catch (error) {
    next(error); // 👈 Pass error to global error handler
  }
});

const loginUser = asyncHandler(async (req, res) => {
  //GET THE DATA FROM USER
  const { email, password } = req.body;

  //NON OF THE FIELD SHOULD BE EMPTY
  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiErrorResponse(400, "Email or password is missing ❌");
  }

  //IF EMAIL AND PASSWORD IS GIVEN THEN CHECK WHETHER USER EXIST WITH THAT EMAIL OR NOT
  const userExist = await User.findOne({ email });
  if (!userExist) {
    throw new ApiErrorResponse(404, "User does not exist ❌");
  }

  //IF USER EXIST THEN CHECK WHETHER PASSWORD IS CORRECT OR NOT
  const checkPasswordIsCorrect = await userExist.isPasswordCorrect(password);

  if (!checkPasswordIsCorrect) {
    throw new ApiErrorResponse(401, "Unauthorized Request");
  }

  // Generate RefreshToken
  const refreshToken = await userExist.generateRefreshToken();
  userExist.refreshToken = refreshToken;
  await userExist.save({ validateBeforeSave: false });

  //If user password is correct then we will send the response and the response will contain the cookie
  const userWithoutPassword = await User.findById(userExist._id).select(
    "-password"
  );

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, "User Logged In ✅", userWithoutPassword));
});

const logout = asyncHandler(async (req, res) => {
  const userID = req.user?._id;

  if (!userID) {
    throw new ApiErrorResponse(401, "Unauthorized request ❌");
  }

  // Erase the refreshToken from database
  await User.findByIdAndUpdate(userID, { refreshToken: "" }, { new: true });

  // Clear the cookie
  return res
    .status(200)
    .clearCookie("refreshToken", { httpOnly: true, secure: true })
    .json(new ApiResponse(200, "User is logged out ✅", {}));
});

export { registerUser, loginUser, logout };
