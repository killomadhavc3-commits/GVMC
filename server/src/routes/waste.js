import { Router } from "express";

const router = Router();
const wasteGuide = [
  { category: "wet", title: "Wet waste", items: ["Food scraps", "Fruit and vegetable peels", "Tea leaves", "Eggshells", "Flowers", "Garden trimmings"], guidance: "Drain excess liquid and compost at home where practical." },
  { category: "dry", title: "Dry waste", items: ["Clean paper and cardboard", "Plastic packaging", "Glass bottles", "Metal cans"], guidance: "Keep recyclable materials clean and dry; empty containers before collection." },
  { category: "hazardous", title: "Household hazardous waste", items: ["Used batteries", "Expired medicines", "Paint or pesticide containers", "Broken thermometers", "Used needles or syringes"], guidance: "Do not mix with regular waste. Store securely and follow GVMC handover instructions." },
  { category: "sanitary", title: "Sanitary waste", items: ["Used diapers", "Sanitary pads"], guidance: "Securely wrap before handover and follow GVMC local instructions." }
];

router.get("/categories", (_req, res) => {
  res.json({ categories: wasteGuide.map(({ category, title }) => ({ category, title })) });
});

router.get("/guide", (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category.toLowerCase() : "";
  const query = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";
  if (category && !wasteGuide.some((entry) => entry.category === category)) {
    return res.status(400).json({ message: "Choose a valid waste category." });
  }

  const entries = wasteGuide
    .filter((entry) => !category || entry.category === category)
    .map((entry) => query
      ? { ...entry, items: entry.items.filter((item) => item.toLowerCase().includes(query)) }
      : entry)
    .filter((entry) => !query || entry.title.toLowerCase().includes(query) || entry.guidance.toLowerCase().includes(query) || entry.items.length);
  return res.json({ guide: entries });
});

export default router;
