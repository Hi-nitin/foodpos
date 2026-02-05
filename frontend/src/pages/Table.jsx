import { useState, useEffect } from "react";
import api from "../api/api";
import styles from "../style/Table.module.css";

export default function TablePage() {
  const [tables, setTables] = useState([]);
  const [name, setName] = useState("");

  const loadTables = async () => {
    const res = await api.get("/tables");
    setTables(res.data);
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleAdd = async () => {
    if (!name) return;
    await api.post("/tables", { name });
    setName("");
    loadTables();
  };

  const handleDelete = async (id) => {
    await api.delete(`/table/${id}`);
    loadTables();
  };

  return (
    <div className={styles.container}>
      <h2>Tables</h2>
      <div className={styles.form}>
        <input type="text" placeholder="Table Name" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={handleAdd}>Add Table</button>
      </div>

      <ul className={styles.list}>
        {tables.map(t => (
          <li key={t._id}>
            {t.name}
            <button onClick={() => handleDelete(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
