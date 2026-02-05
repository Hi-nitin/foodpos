import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Waiter from "./pages/Waiter";
import Admin from "./pages/Admin";
import Billing from "./pages/Billing";
import MainLayout from "./layouts/MainLayout";
import Category from "./pages/Category";
import Subcategory from "./pages/Subcategory";
import TablePage from "./pages/Table";
import BillingHistory from "./pages/BillingHistory";
import Sidebar from "./components/Sidebar";
import Food from "./pages/Food";
import Waitermobile from "./pages/Waitermobile";

function App() {
  return (
    <Router>

      <div style={{ display: "flex" }}>
        <Sidebar /> {/* Left Sidebar */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/waiter" element={<Waiter />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/waitermobile" element={<Waitermobile />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/billing-history" element={<BillingHistory />} />

            {/* Admin / Setup Pages */}
            <Route path="/category" element={<Category />} />
            <Route path="/subcategory" element={<Subcategory />} />
            <Route path="/table" element={<TablePage />} />
            <Route path="/food" element={<Food />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
