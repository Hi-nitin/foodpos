import { useEffect, useState } from "react";
import api from "../api/api";
import styles from "../style/Food.module.css";

export default function Food() {
  const [foods, setFoods] = useState([]);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // Load foods
  useEffect(() => {
    loadFoods();
  }, []);

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
    if (!name || !price) {
      alert("All fields are required");
      return;
    }

    try {
      await api.post("/foods", {
        name,
        price: parseFloat(price)
      });

      alert("Food added!");
      setName("");
      setPrice("");
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
      loadFoods();
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
          <input
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </label>

        <button onClick={handleAddFood}>Add Food</button>
      </div>

      <h3>Food List</h3>
      {foods.length === 0 && <p>No food added yet</p>}

      <ul className={styles.foodList}>
        {foods.map(f => (
          <li key={f._id}>
            {f.name} - ${f.price}

            <button onClick={() => handleDeleteFood(f._id)}>
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
