import { User } from "../models/user.model.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { transporter } from "../utils/nodemailer.js";
import { makeWelcomeHtml } from "../utils/constants.js";
import bcrypt from "bcrypt";

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

    // inside your register route (or a helper file)

    //Before sending the response I want to send the welcome email to the user
    await transporter.sendMail({
      from: "saqulainreza2025@gmail.com",
      to: email,
      subject: "welcome message",
      text: `Hello ${name} to start a journey with sastacollege`,
      // html: makeWelcomeHtml({
      //   name,
      //   ctaLink: "https://sastacollege.example/get-started",
      // }),
    });

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

const deleteAllUser = asyncHandler(async (req, res) => {
  await User.deleteMany();

  return res.status(200).json({
    success: "ok",
    message: "deleted the database ✅",
    data: {},
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiErrorResponse(404, "User does not exist");
  }

  const user = await User.findById(userId).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "User Fetched Successfully", user));
});

const sendVerifyOTP = asyncHandler(async (req, res) => {
  try {
    // Logged in user can verify the email only
    const userID = req.user?._id;

    //Check whether the user available with this userID
    const user = await User.findById(userID);

    if (!user) {
      throw new ApiErrorResponse(401, "Unauthorized User");
    }

    //Check one more thing like if isAccountVerified is not verified then only verify the email
    if (user.isAccountVerified) {
      throw new ApiErrorResponse(
        404,
        "Already verified Account with this email"
      );
    }

    //Generate 6 digit OTP
    const OTP = String(Math.floor(Math.random() * 900000 + 100000));

    //If user is available then set the verifyOtp
    user.verifyOtp = OTP;

    //SET verifyOtpExpireAt also
    const expireyOTPTime = Date.now() + 1 * 60 * 1000; // 10 minutes

    user.verifyOtpExpireAt = expireyOTPTime;

    //Save the data into the database
    await user.save({ validateBeforeSave: false });

    //Before Sending the reponse send the otp to mail
    await transporter.sendMail({
      from: "saqulainreza2025@gmail.com",
      to: user.email,
      subject: "welcome message",
      text: `Hello ${user.name} your one time otp is ${OTP}`,
      // html: makeWelcomeHtml({
      //   name,
      //   ctaLink: "https://sastacollege.example/get-started",
      // }),
    });

    //If everything is right then set the resposne
    return res.status(200).json(new ApiResponse(200, "OTP send"));
  } catch (error) {
    throw new ApiErrorResponse(404, "Unable to send OTP ");
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { otp } = req.body;

    if (!otp || otp.trim() === "") {
      throw new ApiErrorResponse(400, "Provide the OTP");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiErrorResponse(401, "Unauthorized Request");
    }

    if (user.isAccountVerified) {
      return res
        .status(200)
        .json(new ApiResponse(200, "Email already verified"));
    }

    // Check OTP expiry
    if (Date.now() > user.verifyOtpExpireAt) {
      throw new ApiErrorResponse(
        400,
        "OTP has expired, please request a new one"
      );
    }

    // Check OTP match
    if (user.verifyOtp !== otp) {
      throw new ApiErrorResponse(400, "Invalid OTP");
    }

    // If OTP valid + not expired → verify account
    user.isAccountVerified = true;
    user.verifyOtp = ""; // clear OTP
    user.verifyOtpExpireAt = 0;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, "Account verified successfully"));
  } catch (error) {
    throw new ApiErrorResponse(400, error.message || "Unable to verify OTP");
  }
});

const isUserAuthenticated = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiErrorResponse(401, "Unauthorized Request");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiErrorResponse(401, "Unauthorized Request");
  }

  if (!user.isAccountVerified) {
    return res
      .status(403)
      .json(new ApiResponse(403, "User is authenticated but not verified"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User is authenticated and verified"));
});

const resetOTP = asyncHandler(async (req, res) => {
  //USER MUST BE AUTHENTICATED
  const userID = req.user._id;

  if (!userID) {
    throw new ApiErrorResponse(401, "Unauthorized Request");
  }

  const user = await User.findById(userID);

  if (!user) {
    throw new ApiErrorResponse(404, "User not Found");
  }

  //GENERATE NEW OTP
  const OTP = String(Math.floor(Math.random() * 900000 + 100000));
  const expireyOTPTime = Date.now() + 10 * 60 * 1000; // 10 minutes

  await transporter.sendMail({
    from: "saqulainreza2025@gmail.com",
    to: user.email,
    subject: "welcome message",
    text: `Hello ${user.name} your one time otp is ${OTP}`,
    // html: makeWelcomeHtml({
    //   name,
    //   ctaLink: "https://sastacollege.example/get-started",
    // }),
  });

  user.verifyOtp = OTP;
  user.verifyOtpExpireAt = expireyOTPTime;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "New OTP sent successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  // 1. Validate input
  if (!email || !otp || !newPassword) {
    throw new ApiErrorResponse(
      400,
      "Email, OTP, and new password are required"
    );
  }
  // 2. Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiErrorResponse(404, "User not found");
  }
  // 3. Check OTP expiry
  if (Date.now() > user.verifyOtpExpireAt) {
    throw new ApiErrorResponse(
      400,
      "OTP has expired, please request a new one"
    );
  }
  // 4. Check OTP match
  if (user.verifyOtp !== otp) {
    throw new ApiErrorResponse(400, "Invalid OTP");
  }
  // 5. Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  // 6. Update password + clear OTP
  user.password = hashedPassword;
  user.verifyOtp = "";
  user.verifyOtpExpireAt = 0;
  // 7. Save
  await user.save({ validateBeforeSave: false });
  // 8. Response
  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});

export {
  registerUser,
  loginUser,
  logout,
  deleteAllUser,
  sendVerifyOTP,
  getUserProfile,
  verifyEmail,
  isUserAuthenticated,
  resetOTP,
  changePassword,
};
