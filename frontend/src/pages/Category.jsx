import { useState, useEffect } from "react";
import api from "../api/api";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => { loadCategories(); }, []);

  const handleAdd = async () => {
    await api.post("/categories", { name });
    setName("");
    loadCategories();
  };

  const handleDelete = async (id) => {
    await api.delete(`/categories/${id}`);
    loadCategories();
  };

  return (
    <div>
      <h2>Category Management</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" />
      <button onClick={handleAdd}>Add Category</button>

      <ul>
        {categories.map(c => (
          <li key={c._id}>
            {c.name}
            <button onClick={() => handleDelete(c._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
