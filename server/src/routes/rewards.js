import { Router } from "express";
import Pickup from "../models/Pickup.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
const POINTS_PER_COMPLETED_PICKUP = 10;

router.use(requireAuth, requireRole("resident"));

router.get("/wallet", async (req, res, next) => {
  try {
    const completedPickups = await Pickup.countDocuments({
      resident: req.user.id,
      status: "completed"
    });
    return res.json({
      points: completedPickups * POINTS_PER_COMPLETED_PICKUP,
      completedPickups,
      pointsPerCompletedPickup: POINTS_PER_COMPLETED_PICKUP
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/history", async (req, res, next) => {
  try {
    const pickups = await Pickup.find({ resident: req.user.id, status: "completed" })
      .sort({ updatedAt: -1 })
      .limit(100)
      .select("wasteType scheduledDate updatedAt");
    const history = pickups.map((pickup) => ({
      pickupId: pickup.id,
      wasteType: pickup.wasteType,
      completedAt: pickup.updatedAt,
      points: POINTS_PER_COMPLETED_PICKUP
    }));
    return res.json({ history });
  } catch (error) {
    return next(error);
  }
});

export default router;
