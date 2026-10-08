import { Router } from "express";
import mongoose from "mongoose";
import Complaint from "../models/Complaint.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
const complaintStatuses = ["open", "in_review", "resolved", "rejected"];
const complaintCategories = ["missed_pickup", "overflowing_bin", "illegal_dumping", "other"];

router.use(requireAuth);

router.post("/", requireRole("resident"), async (req, res, next) => {
  try {
    const { category, description, location } = req.body;
    if (!complaintCategories.includes(category)) {
      return res.status(400).json({ message: "Choose a valid complaint category." });
    }
    if (typeof description !== "string" || description.trim().length < 10 || description.length > 2000) {
      return res.status(400).json({ message: "Description must be between 10 and 2000 characters." });
    }
    if (typeof location !== "string" || location.trim().length < 3 || location.length > 300) {
      return res.status(400).json({ message: "Location must be between 3 and 300 characters." });
    }

    const complaint = await Complaint.create({
      resident: req.user.id,
      category,
      description: description.trim(),
      location: location.trim()
    });
    return res.status(201).json({ complaint });
  } catch (error) {
    return next(error);
  }
});

router.get("/", requireRole("resident", "municipalAdmin"), async (req, res, next) => {
  try {
    const filter = req.user.role === "municipalAdmin" ? {} : { resident: req.user.id };
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("resident", "name email");
    return res.json({ complaints });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", requireRole("resident", "municipalAdmin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Provide a valid complaint ID." });
    }
    const complaint = await Complaint.findById(req.params.id).populate("resident", "name email");
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });
    if (req.user.role === "resident" && complaint.resident.id !== req.user.id) {
      return res.status(403).json({ message: "You cannot view this complaint." });
    }
    return res.json({ complaint });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/status", requireRole("municipalAdmin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Provide a valid complaint ID." });
    }
    if (!complaintStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Choose a valid complaint status." });
    }
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate("resident", "name email");
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });
    return res.json({ complaint });
  } catch (error) {
    return next(error);
  }
});

export default router;
