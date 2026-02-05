import { useEffect, useState } from "react";
import api from "../api/api";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const socket = useSocket();
  const navigate = useNavigate();

  // ---------------- LOAD ORDERS ----------------
  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  useEffect(() => {
    loadOrders();
    socket.on("refreshOrders", loadOrders);
    return () => socket.off("refreshOrders");
  }, []);

  // ---------------- GROUP BY TABLE + FIXED GROUP ----------------
  const groupedOrders = orders.reduce((acc, order) => {
    if (!order.items || order.items.length === 0) return acc;

    const tableName = order.tableId?.name || "Unknown Table";
    const groupName = order.groupName || "Unknown Group";

    const key = `${tableName} - ${groupName}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(order);

    return acc;
  }, {});

  // ---------------- COMPLETE TABLE + GROUP ----------------
  const handleCompleteTableGroup = async (key) => {
    const ordersToComplete = groupedOrders[key];

    try {
      await Promise.all(
        ordersToComplete.map((o) =>
          api.put(`/orders/${o._id}/complete`)
        )
      );

      socket.emit("refreshOrders");
      loadOrders();

      navigate(`/billing`);
    } catch (err) {
      console.error("Complete failed", err);
    }
  };

  // ---------------- CANCEL TABLE + GROUP ----------------
  const handleCancelTableGroup = async (key) => {
    if (!confirm(`Cancel ALL orders for ${key}?`)) return;

    try {
      await Promise.all(
        groupedOrders[key].map((o) =>
          api.delete(`/orders/${o._id}`)
        )
      );

      socket.emit("refreshOrders");
      loadOrders();
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  // ---------------- REMOVE SINGLE ITEM ----------------
  const handleRemoveItem = async (orderId, itemId) => {
    if (!confirm("Remove this item?")) return;

    try {
      await api.delete(`/orders/${orderId}/item/${itemId}`);
      socket.emit("refreshOrders");
      loadOrders();
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  // ---------------- UI ----------------
  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel - Kitchen / Orders</h2>

      {Object.keys(groupedOrders).length === 0 && (
        <p>No active orders</p>
      )}

      {Object.keys(groupedOrders).map((key) => (
        <div
          key={key}
          style={{
            border: "2px solid #333",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
          }}
        >
          <h3>{key}</h3>

          {groupedOrders[key].map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #aaa",
                margin: "5px 0",
                padding: "5px",
                borderRadius: "3px",
              }}
            >
              <ul>
                {order.items.map((i) => (
                  <li key={i._id}>
                    {i.name} x{i.qty} – ₹{i.price * i.qty}
                    <button
                      onClick={() => handleRemoveItem(order._id, i._id)}
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#e53935",
                        color: "#fff",
                        border: "none",
                        padding: "3px 6px",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => handleCompleteTableGroup(key)}
              style={{
                marginRight: "10px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                padding: "7px 12px",
                borderRadius: "4px",
              }}
            >
              Complete & Billing
            </button>

            <button
              onClick={() => handleCancelTableGroup(key)}
              style={{
                backgroundColor: "#e53935",
                color: "#fff",
                border: "none",
                padding: "7px 12px",
                borderRadius: "4px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
