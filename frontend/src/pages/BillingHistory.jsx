import { useEffect, useState } from "react";
import api from "../api/api";
import styles from "../style/BillingHistory.module.css";

export default function BillingHistory() {
  const [bills, setBills] = useState([]);
  const [todaySales, setTodaySales] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadBillingHistory = async () => {
    try {
      const params = {};

      if (fromDate) {
        // start of selected day
        params.from = new Date(fromDate + "T00:00:00.000Z").toISOString();
      }

      if (toDate) {
        // end of selected day
        params.to = new Date(toDate + "T23:59:59.999Z").toISOString();
      }

      const res = await api.get("/billing/history", { params });

      setBills(res.data.bills || []);
      setTodaySales(res.data.todaySales || 0);
      setTotalSales(res.data.totalSales || 0);
    } catch (err) {
      console.error("Failed to load billing history", err);
    }
  };

  useEffect(() => {
    loadBillingHistory();
  }, []);

  return (
    <div className={styles.billingPage}>
      <h2 className={styles.heading}>Billing History</h2>

      {/* Filters */}
      <div className={styles.filters}>
        <label>
          From:
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </label>

        <label>
          To:
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </label>

        <button onClick={loadBillingHistory}>Apply Filter</button>
      </div>

      {/* Sales Summary */}
      <div className={styles.salesSummary}>
        <p><strong>Today's Sales:</strong> ${todaySales}</p>
        <p><strong>Total Sales:</strong> ${totalSales}</p>
      </div>

      {bills.length === 0 && <p>No billing records found.</p>}

      {/* Billing Records */}
      {bills.map(b => (
        <div key={b._id} className={styles.billingCard}>
          <p>
            <strong>Table:</strong> {b.tableId?.name || "N/A"} |
            <strong> Group:</strong> {b.groupName || "N/A"} |
            <strong> Discount:</strong> ${b.discount} |
            <strong> Final Total:</strong> ${b.finalTotal}
          </p>

          <p>
            <strong>Date:</strong> {new Date(b.createdAt).toLocaleString()}
          </p>

          <h4>Items</h4>
          <ul className={styles.itemsList}>
            {b.items.map((i, idx) => (
              <li key={idx} className={styles.item}>
                <span>{i.name} x{i.qty}</span>
                <span>${i.price * i.qty}</span>
              </li>
            ))}
          </ul>

          <p>
            <strong>Total Amount:</strong> ${b.items.reduce((s, i) => s + i.price * i.qty, 0)}
          </p>
        </div>
      ))}
    </div>
  );
}
