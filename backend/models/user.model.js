import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

//ENCRYPT THE PASSWORD BEFORE SAVING
userSchema.pre("save", async function (next) {
  // ✅ Only hash if password field is new/modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // ✅ Hash password with salt rounds = 10
    this.password = await bcrypt.hash(this.password, 10);

    // ✅ Continue with save
    next();
  } catch (error) {
    // ✅ Pass any errors to Mongoose
    next(error);
  }
});

//CHECK PASSWORD IS CORRECT
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generaterate RefreshToken
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

export const User = mongoose.model("User", userSchema);
