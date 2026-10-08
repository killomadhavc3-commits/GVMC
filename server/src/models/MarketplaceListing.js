import mongoose from "mongoose";

const marketplaceListingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    material: {
      type: String,
      enum: ["paper", "plastic", "glass", "metal", "electronics", "other"],
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1500 },
    quantity: { type: Number, required: true, min: 0.1, max: 100000 },
    unit: { type: String, enum: ["kg", "item", "bag"], required: true },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    status: { type: String, enum: ["active", "closed"], default: "active", index: true }
  },
  { timestamps: true }
);

export default mongoose.model("MarketplaceListing", marketplaceListingSchema);
