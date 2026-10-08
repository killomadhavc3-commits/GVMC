import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["resident", "collectionAgent", "municipalAdmin", "recyclingBuyer"],
      default: "resident",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
