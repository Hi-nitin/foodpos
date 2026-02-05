import express from "express";
import Food from "../models/Food.js";

const router = express.Router();

/* ---------------- GET FOODS (SEARCH + FILTER) ---------------- */
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search && search.trim() !== "") {
      filter.name = {
        // ✅ WORD-BOUNDARY SEARCH (FIXES veg → pasta issue)
        $regex: `\\b${search.trim()}`,
        $options: "i",
      };
    }

    const foods = await Food.find(filter).limit(10); // limit for live search
    res.json(foods);
  } catch (err) {
    console.error("FOOD FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch foods" });
  }
});

/* ---------------- ADD FOOD ---------------- */
router.post("/", async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ---------------- DELETE FOOD ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
