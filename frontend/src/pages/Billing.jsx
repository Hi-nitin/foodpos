import { useEffect, useState } from "react";
import api from "../api/api";

export default function Billing() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  // ---------------- LOAD COMPLETED ORDERS ----------------
  useEffect(() => {
    loadCompletedOrders();
  }, []);

  const loadCompletedOrders = async () => {
    try {
      const res = await api.get("/billing/completed-orders");
      setCompletedOrders(res.data);
    } catch (err) {
      console.error("Failed to load completed orders", err);
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setDiscountPercent(0);
  };

  const handleSaveBill = async () => {
    if (!selectedOrder) return;

    try {
      await api.post("/billing", {
        orderId: selectedOrder._id,
        discountPercent: Number(discountPercent) || 0,
      });

      alert("Bill saved successfully!");
      setSelectedOrder(null);
      loadCompletedOrders();
    } catch (err) {
      console.error("Failed to save bill", err);
      alert("Failed to save bill");
    }
  };

  // ---------------- CALCULATIONS ----------------
  const totalAmount = selectedOrder
    ? selectedOrder.items.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
      )
    : 0;

  const discountAmount =
    (totalAmount * (Number(discountPercent) || 0)) / 100;

  const finalTotal = Math.max(totalAmount - discountAmount, 0);

  // ---------------- UI ----------------
  return (
    <div style={{ padding: "20px" }}>
      <h2>Billing Page</h2>

      {/* COMPLETED ORDERS LIST */}
      <h3>Completed Orders</h3>

      {completedOrders.length === 0 && (
        <p>No completed orders ready for billing</p>
      )}

      <ul>
        {completedOrders.map((o) => (
          <li key={o._id} style={{ marginBottom: "8px" }}>
            <strong>Table:</strong> {o.tableId?.name || "N/A"} |{" "}
            <strong>Group:</strong> {o.groupName || "N/A"}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleSelectOrder(o)}
            >
              Select
            </button>
          </li>
        ))}
      </ul>

      {/* BILLING PANEL */}
      {selectedOrder && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "6px",
          }}
        >
          <h3>
            Billing – Table {selectedOrder.tableId?.name} (
            {selectedOrder.groupName})
          </h3>

          <h4>Items</h4>
          <ul>
            {selectedOrder.items.map((i, idx) => (
              <li key={idx}>
                {i.name} x{i.qty} – ₹{i.price * i.qty}
              </li>
            ))}
          </ul>

          <p>
            <strong>Total:</strong> ₹{totalAmount.toFixed(2)}
          </p>

          {/* ✅ Percentage Discount */}
          <label>
            Discount (%):
            <input
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) =>
                setDiscountPercent(
                  Math.min(100, Math.max(0, e.target.value))
                )
              }
              style={{ marginLeft: "5px", width: "80px" }}
            />
          </label>

          <p>
            <strong>Discount Amount:</strong> ₹{discountAmount.toFixed(2)}
          </p>

          <p>
            <strong>Final Total:</strong> ₹{finalTotal.toFixed(2)}
          </p>

          <button onClick={handleSaveBill} style={{ marginTop: "10px" }}>
            Save Bill
          </button>
        </div>
      )}
    </div>
  );
}
