import { Router } from "express";
import mongoose from "mongoose";
import Pickup from "../models/Pickup.js";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
const pickupStatuses = ["requested", "assigned", "in_progress", "completed", "cancelled"];

router.use(requireAuth);

router.post("/", requireRole("resident"), async (req, res, next) => {
  try {
    const { wasteType, address, ward = "", scheduledDate, notes = "" } = req.body;
    const date = typeof scheduledDate === "string" ? new Date(scheduledDate) : new Date(NaN);
    if (!["wet", "dry", "hazardous"].includes(wasteType)) {
      return res.status(400).json({ message: "Choose a valid waste type." });
    }
    if (typeof address !== "string" || address.trim().length < 5 || address.trim().length > 300) {
      return res.status(400).json({ message: "Address must be between 5 and 300 characters." });
    }
    if (Number.isNaN(date.getTime()) || date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return res.status(400).json({ message: "Choose a valid current or future pickup date." });
    }
    if (typeof ward !== "string" || ward.length > 80 || typeof notes !== "string" || notes.length > 500) {
      return res.status(400).json({ message: "Ward or notes exceed the allowed length." });
    }

    const pickup = await Pickup.create({
      resident: req.user.id,
      wasteType,
      address: address.trim(),
      ward: ward.trim(),
      scheduledDate: date,
      notes: notes.trim()
    });
    return res.status(201).json({ pickup });
  } catch (error) {
    return next(error);
  }
});

router.get("/", requireRole("resident", "collectionAgent", "municipalAdmin"), async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === "resident") filter.resident = req.user.id;
    if (req.user.role === "collectionAgent") filter.assignedAgent = req.user.id;
    if (typeof req.query.status === "string") {
      if (!pickupStatuses.includes(req.query.status)) {
        return res.status(400).json({ message: "Choose a valid pickup status." });
      }
      filter.status = req.query.status;
    }
    const pickups = await Pickup.find(filter)
      .sort({ scheduledDate: 1, createdAt: -1 })
      .limit(100)
      .populate("resident", "name email")
      .populate("assignedAgent", "name email");
    return res.json({ pickups });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", requireRole("resident", "collectionAgent", "municipalAdmin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Provide a valid pickup ID." });
    }
    const pickup = await Pickup.findById(req.params.id)
      .populate("resident", "name email")
      .populate("assignedAgent", "name email");
    if (!pickup) return res.status(404).json({ message: "Pickup request not found." });

    const isResidentOwner = req.user.role === "resident" && pickup.resident.id === req.user.id;
    const isAssignedAgent = req.user.role === "collectionAgent" &&
      pickup.assignedAgent?.id === req.user.id;
    if (!isResidentOwner && !isAssignedAgent && req.user.role !== "municipalAdmin") {
      return res.status(403).json({ message: "You cannot view this pickup request." });
    }
    return res.json({ pickup });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/reschedule", requireRole("resident"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Provide a valid pickup ID." });
    }
    const { scheduledDate } = req.body;
    const date = typeof scheduledDate === "string" ? new Date(scheduledDate) : new Date(NaN);
    if (Number.isNaN(date.getTime()) || date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return res.status(400).json({ message: "Choose a valid current or future pickup date." });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: "Pickup request not found." });
    if (pickup.resident.toString() !== req.user.id) {
      return res.status(403).json({ message: "You cannot reschedule this pickup request." });
    }
    if (pickup.status !== "requested") {
      return res.status(409).json({ message: "Only requested pickups can be rescheduled." });
    }

    pickup.scheduledDate = date;
    await pickup.save();
    return res.json({ pickup });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/assign", requireRole("municipalAdmin"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(agentId)) {
      return res.status(400).json({ message: "Provide valid pickup and agent IDs." });
    }

    const agent = await User.findById(agentId).select("role");
    if (!agent || agent.role !== "collectionAgent") {
      return res.status(400).json({ message: "The selected account is not a collection agent." });
    }
    const pickup = await Pickup.findById(id);
    if (!pickup) return res.status(404).json({ message: "Pickup request not found." });
    if (["completed", "cancelled"].includes(pickup.status)) {
      return res.status(409).json({ message: "Completed or cancelled pickups cannot be assigned." });
    }

    pickup.assignedAgent = agent.id;
    pickup.status = "assigned";
    await pickup.save();
    return res.json({ pickup });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Provide a valid pickup ID." });
    }
    if (!pickupStatuses.includes(status)) {
      return res.status(400).json({ message: "Choose a valid pickup status." });
    }

    const pickup = await Pickup.findById(id);
    if (!pickup) return res.status(404).json({ message: "Pickup request not found." });
    const isResidentCancellation = req.user.role === "resident" &&
      pickup.resident.toString() === req.user.id && status === "cancelled";
    const isAssignedAgent = req.user.role === "collectionAgent" &&
      pickup.assignedAgent?.toString() === req.user.id;
    const isAdmin = req.user.role === "municipalAdmin";
    if (!isResidentCancellation && !isAssignedAgent && !isAdmin) {
      return res.status(403).json({ message: "You cannot update this pickup request." });
    }
    if (req.user.role === "collectionAgent" && !["in_progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Agents can start or complete assigned pickups." });
    }
    if (req.user.role === "resident" && pickup.status !== "requested") {
      return res.status(409).json({ message: "Only requested pickups can be cancelled." });
    }
    if (["completed", "cancelled"].includes(pickup.status)) {
      return res.status(409).json({ message: "This pickup is already closed." });
    }

    pickup.status = status;
    await pickup.save();
    return res.json({ pickup });
  } catch (error) {
    return next(error);
  }
});

export default router;
