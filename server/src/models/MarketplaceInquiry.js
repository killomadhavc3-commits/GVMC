import mongoose from "mongoose";

const marketplaceInquirySchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "MarketplaceListing", required: true, index: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, required: true, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

marketplaceInquirySchema.index({ listing: 1, buyer: 1 }, { unique: true });

export default mongoose.model("MarketplaceInquiry", marketplaceInquirySchema);
