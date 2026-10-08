import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: {
      type: String,
      enum: ["missed_pickup", "overflowing_bin", "illegal_dumping", "other"],
      required: true
    },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    location: { type: String, required: true, trim: true, maxlength: 300 },
    status: {
      type: String,
      enum: ["open", "in_review", "resolved", "rejected"],
      default: "open",
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
