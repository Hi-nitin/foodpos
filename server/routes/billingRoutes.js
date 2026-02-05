import express from "express";
import Order from "../models/Order.js";
import Bill from "../models/Bill.js";

const router = express.Router();

/* ---------------- GET COMPLETED ORDERS ---------------- */
router.get("/completed-orders", async (req, res) => {
  try {
    const orders = await Order.find({ status: "completed" })
      .populate("tableId"); // ✅ ONLY tableId

    res.json(orders);
  } catch (err) {
    console.error("FETCH COMPLETED ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch completed orders" });
  }
});

/* ---------------- SAVE BILL ---------------- */
router.post("/", async (req, res) => {
  try {
    const { orderId, discount = 0 } = req.body;

    const order = await Order.findById(orderId).populate("tableId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const total = order.items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );

    const finalTotal = total - discount;

    const bill = new Bill({
      orderId: order._id,
      tableId: order.tableId._id,
      groupName: order.groupName, // ✅ G1–G4
      items: order.items.map(i => ({
        name: i.name,
        price: i.price,
        qty: i.qty
      })),
      total,
      discount,
      finalTotal,
    });

    await bill.save();

    // ✅ REMOVE order after billing
    await Order.findByIdAndDelete(orderId);

    res.json(bill);
  } catch (err) {
    console.error("SAVE BILL ERROR:", err);
    res.status(500).json({ message: "Failed to save bill" });
  }
});

/* ---------------- BILLING HISTORY ---------------- */
router.get("/history", async (req, res) => {
  try {
    const { from, to } = req.query;

    const filter = {};

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const bills = await Bill.find(filter)
      .populate("tableId") // ✅ ONLY tableId
      .sort({ createdAt: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = bills
      .filter(b => b.createdAt >= today)
      .reduce((sum, b) => sum + b.finalTotal, 0);

    const totalSales = bills.reduce(
      (sum, b) => sum + b.finalTotal,
      0
    );

    res.json({ bills, todaySales, totalSales });
  } catch (err) {
    console.error("BILL HISTORY ERROR:", err);
    res.status(500).json({ message: "Failed to fetch billing history" });
  }
});

export default router;
