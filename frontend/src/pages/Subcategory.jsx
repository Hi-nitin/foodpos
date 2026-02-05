import { useEffect, useState } from "react";
import api from "../api/api";

export default function Subcategory() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  /* ---------------- LOAD DATA ---------------- */
  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const loadSubcategories = async () => {
    const res = await api.get("/subcategories");
    setSubcategories(res.data);
  };

  useEffect(() => {
    loadCategories();
    loadSubcategories();
  }, []);

  /* ---------------- ADD SUBCATEGORY ---------------- */
  const handleAddSubcategory = async () => {
    if (!name || !selectedCategory) {
      alert("Subcategory name and category are required");
      return;
    }

    try {
      await api.post("/subcategories", {
        name: name.trim(),
        category: selectedCategory,
      });

      setName("");
      setSelectedCategory("");
      loadSubcategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add subcategory");
    }
  };

  /* ---------------- DELETE SUBCATEGORY ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;

    try {
      await api.delete(`/subcategories/${id}`);
      loadSubcategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete subcategory");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Subcategory</h2>

      <input
        placeholder="Subcategory name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <button onClick={handleAddSubcategory}>Add</button>

      <hr />

      <h3>Subcategories</h3>

      <ul>
        {subcategories.map((s) => (
          <li key={s._id} style={{ marginBottom: "8px" }}>
            {s.name} ({s.category?.name || "No category"})
            <button
              onClick={() => handleDelete(s._id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
