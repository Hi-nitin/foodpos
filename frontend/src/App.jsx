import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import RecipeViewer from "./pages/RecipeViewer";
import AddRecipe from "./pages/AddRecipe";
import { useEffect } from "react";

function App() {
  
  // ---------------- KEEP BACKEND AWAKE ----------------
  useEffect(() => {
    const backendURL = "https://foodpos-server-1.onrender.com"; // Your backend URL

    const pingServer = () => {
      fetch(backendURL)
        .then(res => console.log("Ping successful:", res.status))
        .catch(err => console.log("Ping failed:", err));
    };

    // Ping immediately on load
    pingServer();

    // Ping every 10 minutes (600000 ms)
    const interval = setInterval(pingServer, 10 * 60 * 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

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
            {/* Recipe */}
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipestep" element={<RecipeViewer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
