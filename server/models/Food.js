import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true }
});

export default mongoose.model("Food", foodSchema);
