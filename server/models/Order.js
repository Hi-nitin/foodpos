import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true
  },
  groupName: {
    type: String,
    enum: ["G1", "G2", "G3", "G4"],
    required: true
  },
  items: [
    {
      foodId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      qty: Number
    }
  ],
  status: {
    type: String,
    enum: ["draft", "sent", "completed"],
    default: "sent"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
