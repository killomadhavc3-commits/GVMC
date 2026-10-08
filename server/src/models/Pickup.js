import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    wasteType: { type: String, enum: ["wet", "dry", "hazardous"], required: true },
    address: { type: String, required: true, trim: true, maxlength: 300 },
    ward: { type: String, trim: true, maxlength: 80, default: "" },
    scheduledDate: { type: Date, required: true, index: true },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
    status: {
      type: String,
      enum: ["requested", "assigned", "in_progress", "completed", "cancelled"],
      default: "requested",
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Pickup", pickupSchema);
