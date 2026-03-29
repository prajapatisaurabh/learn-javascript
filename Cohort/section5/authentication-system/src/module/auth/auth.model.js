import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlenght: 2,
    maxlenght: 50,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlenght: 8,
    select: false,
  },

  role: {
    type: String,
    enum: ["CUSTOMER", "SELLER", "ADMIN"],
    default: "CUSTOMER",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verificationTone: {
    type: String,
    select: false,
  },
  refreshToken: { type: String, select: false },
  resetPassowrdToken: {
    type: String,
    select: false,
  },
  resetPasswordExpires: {
    type: Date,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  } else {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
});

userSchema.methods.comparePassword = async function (clearTextPassword) {
  return await bcrypt.compare(clearTextPassword, this.password);
};

export default mongoose.model("User", userSchema);
