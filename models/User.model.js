import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    accessType: { type: String, enum: ["admin", "agent"], default: "agent" },
    accessEnabled: { type: Boolean, default: false },
    password: String,
  },
  { timestamps: true }
);

// Remove sensitive fields when converting to JSON
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.confirmPassword;
  return userObject;
};

// Generate JWT for authenticated users
UserSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id.toString(),
    email: this.email,
    accessType: this.accessType,
  };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign(payload, secret, { expiresIn });
};

const User = mongoose.model("User", UserSchema);
export default User;
