import { useEffect, useState } from "react";
import api from "../api/api";
import styles from "../style/Food.module.css"; // CSS module for isolation

export default function Food() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [foods, setFoods] = useState([]);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  // Load categories and foods
  useEffect(() => {
    loadCategories();
    loadFoods();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (categoryId) loadSubcategories(categoryId);
    else setSubcategories([]);
    setSubcategoryId("");
  }, [categoryId]);

  // Load all categories
  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  // Load subcategories for selected category
  const loadSubcategories = async (categoryId) => {
    try {
      const res = await api.get(`/subcategories/${categoryId}`);
      setSubcategories(res.data);
    } catch (err) {
      console.error("Failed to load subcategories:", err);
    }
  };

  // Load all foods
  const loadFoods = async () => {
    try {
      const res = await api.get("/foods");
      setFoods(res.data);
    } catch (err) {
      console.error("Failed to load foods:", err);
    }
  };

  // Add new food
  const handleAddFood = async () => {
    if (!name || !price || !categoryId || !subcategoryId) {
      alert("All fields are required");
      return;
    }

    try {
      await api.post("/foods", {
        name,
        price: parseFloat(price),
        category: categoryId,
        subcategory: subcategoryId
      });

      alert("Food added!");
      setName("");
      setPrice("");
      setCategoryId("");
      setSubcategoryId("");
      setSubcategories([]);
      loadFoods();
    } catch (err) {
      console.error("Failed to add food:", err);
      alert(err.response?.data?.message || "Error adding food");
    }
  };

const handleDeleteFood = async (foodId) => {
  if (!window.confirm("Delete this food?")) return;

  try {
    await api.delete(`/foods/${foodId}`);
    loadFoods(); // refresh list
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete food");
  }
};

  return (
    <div className={styles.container}>
      <h2>Add / Manage Food</h2>

      <div className={styles.form}>
        <label>
          Name:
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>

        <label>
          Price:
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
        </label>

        <label>
          Category:
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label>
          Subcategory:
          <select value={subcategoryId} onChange={e => setSubcategoryId(e.target.value)}>
            <option value="">Select Subcategory</option>
            {subcategories.map(sc => (
              <option key={sc._id} value={sc._id}>{sc.name}</option>
            ))}
          </select>
        </label>

        <button onClick={handleAddFood}>Add Food</button>
      </div>

      <h3>Food List</h3>
      {foods.length === 0 && <p>No food added yet</p>}

      <ul className={styles.foodList}>
        {foods.map(f => (
  <li key={f._id}>
    {f.name} - ${f.price} |
    Category: {f.category?.name} |
    Subcategory: {f.subcategory?.name}

    <button onClick={() => handleDeleteFood(f._id)}>
      ❌ Delete
    </button>
  </li>
))}

      </ul>
    </div>
  );
}
