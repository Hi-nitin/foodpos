import express from "express";
import Recipe from "../models/Recipe.js";
import Food from "../models/Food.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/recipes"); // folder to save recipe images
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s/g, "_")
    );
  },
});
const upload = multer({ storage });

// ---------------- CREATE RECIPE ----------------
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const { title, food, steps } = req.body;

    // Check required
    if (!title || !food || !steps) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Recipe.findOne({ food });
    if (existing) return res.status(400).json({ message: "Recipe exists for this food" });

    // Parse steps
    let parsedSteps = JSON.parse(steps); // [{ desc: "Step 1" }, ...]
    // Attach uploaded images
    if (req.files) {
      req.files.forEach((file, idx) => {
        if (parsedSteps[idx]) parsedSteps[idx].image = `/uploads/recipes/${file.filename}`;
      });
    }

    const recipe = new Recipe({
      title,
      food,
      steps: parsedSteps,
    });

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.error("CREATE RECIPE ERROR:", err);
    res.status(500).json({ message: "Failed to create recipe" });
  }
});

// ---------------- GET RECIPE BY FOOD ----------------
router.get("/food/:foodId", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ food: req.params.foodId });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
});

// ---------------- GET ALL RECIPES ----------------
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("food");
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
});

export default router;
