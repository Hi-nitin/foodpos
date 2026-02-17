import { NavLink } from "react-router-dom";
import styles from "../style/Sidebar.module.css";

export default function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    padding: "12px 16px",
    display: "block",
    textDecoration: "none",
    color: isActive ? "#fff" : "#333",
    background: isActive ? "#1976d2" : "transparent",
    borderRadius: "4px",
    marginBottom: "8px",
    fontWeight: "500",
  });

  return (
    <div className={styles.sidebar}>
      <h3 style={{ marginBottom: "20px" }}>🍽 Cafe System</h3>

      {/* Main */}
      <NavLink to="/waiter" style={linkStyle}>👨‍🍳 Waiter</NavLink>
      <NavLink to="/admin" style={linkStyle}>🔥 Kitchen / Admin</NavLink>
      <NavLink to="/billing" style={linkStyle}>💳 Billing</NavLink>
      <NavLink to="/billing-history" style={linkStyle}>📄 Billing History</NavLink>

      {/* Setup */}
      <h4 style={{ marginTop: "20px" }}>Setup</h4>
      <NavLink to="/category" style={linkStyle}>🏷 Category</NavLink>
      <NavLink to="/subcategory" style={linkStyle}>📂 Subcategory</NavLink>
      <NavLink to="/table" style={linkStyle}>🪑 Table</NavLink>
      <NavLink to="/food" style={linkStyle}>🍔 Food</NavLink>
      <NavLink to="/add-recipe" style={linkStyle}>🍔 add step</NavLink>
      <NavLink to="/recipestep" style={linkStyle}>How to make Coffee</NavLink>
    </div>
  );
}
