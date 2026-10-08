import { Router } from "express";
import mongoose from "mongoose";
import MarketplaceInquiry from "../models/MarketplaceInquiry.js";
import MarketplaceListing from "../models/MarketplaceListing.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
const materials = ["paper", "plastic", "glass", "metal", "electronics", "other"];
const units = ["kg", "item", "bag"];

router.use(requireAuth);

router.get("/listings", async (req, res, next) => {
  try {
    const filter = { status: "active" };
    if (typeof req.query.material === "string") {
      if (!materials.includes(req.query.material)) {
        return res.status(400).json({ message: "Choose a valid material category." });
      }
      filter.material = req.query.material;
    }
    const listings = await MarketplaceListing.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("seller", "name");
    return res.json({ listings });
  } catch (error) {
    return next(error);
  }
});

router.get("/my-listings", requireRole("resident", "recyclingBuyer"), async (req, res, next) => {
  try {
    const listings = await MarketplaceListing.find({ seller: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);
    return res.json({ listings });
  } catch (error) {
    return next(error);
  }
});

router.get("/my-inquiries", requireRole("resident", "recyclingBuyer"), async (req, res, next) => {
  try {
    const inquiries = await MarketplaceInquiry.find({ buyer: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate({
        path: "listing",
        select: "material title description quantity unit location status seller",
        populate: { path: "seller", select: "name" }
      });
    return res.json({ inquiries });
  } catch (error) {
    return next(error);
  }
});

router.post("/listings", requireRole("resident", "recyclingBuyer"), async (req, res, next) => {
  try {
    const { material, title, description, quantity, unit, location } = req.body;
    if (!materials.includes(material)) {
      return res.status(400).json({ message: "Choose a valid recyclable material." });
    }
    if (typeof title !== "string" || title.trim().length < 3 || title.length > 120) {
      return res.status(400).json({ message: "Title must be between 3 and 120 characters." });
    }
    if (typeof description !== "string" || description.trim().length < 10 || description.length > 1500) {
      return res.status(400).json({ message: "Description must be between 10 and 1500 characters." });
    }
    if (typeof quantity !== "number" || !Number.isFinite(quantity) || quantity < 0.1 || quantity > 100000 || !units.includes(unit)) {
      return res.status(400).json({ message: "Provide a valid quantity and unit." });
    }
    if (typeof location !== "string" || location.trim().length < 3 || location.length > 200) {
      return res.status(400).json({ message: "Location must be between 3 and 200 characters." });
    }

    const listing = await MarketplaceListing.create({
      seller: req.user.id,
      material,
      title: title.trim(),
      description: description.trim(),
      quantity,
      unit,
      location: location.trim()
    });
    return res.status(201).json({ listing });
  } catch (error) {
    return next(error);
  }
});

router.post("/listings/:id/inquiries", requireRole("resident", "recyclingBuyer"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Provide a valid listing ID." });
    }
    const { message } = req.body;
    if (typeof message !== "string" || message.trim().length < 5 || message.length > 1000) {
      return res.status(400).json({ message: "Inquiry must be between 5 and 1000 characters." });
    }
    const listing = await MarketplaceListing.findOne({ _id: req.params.id, status: "active" });
    if (!listing) return res.status(404).json({ message: "Active marketplace listing not found." });
    if (listing.seller.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot inquire about your own listing." });
    }

    const inquiry = await MarketplaceInquiry.create({
      listing: listing.id,
      buyer: req.user.id,
      message: message.trim()
    });
    return res.status(201).json({ inquiry });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You have already sent an inquiry for this listing." });
    }
    return next(error);
  }
});

export default router;
