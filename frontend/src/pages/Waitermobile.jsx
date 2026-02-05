import { useEffect, useState } from "react";
import api from "../api/api";
import { useOrders } from "../context/OrderContext";
import { useSocket } from "../context/SocketContext";

const FIXED_GROUPS = ["G1", "G2", "G3", "G4"];

export default function Waiter() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [localItems, setLocalItems] = useState([]);

  const { updateOrders } = useOrders();
  const socket = useSocket();

  /* ---------------- LOAD TABLES ---------------- */
  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    const res = await api.get("/tables");
    setTables(res.data);
  };

  /* ---------------- HANDLERS ---------------- */
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setSelectedGroup(null);
    setSearch("");
    setSuggestions([]);
    setLocalItems([]);
  };

  const handleGroupSelect = (groupName) => {
    setSelectedGroup({
      _id: `${selectedTable._id}_${groupName}`,
      name: groupName,
      tableId: selectedTable._id,
    });
  };

  /* ---------------- LIVE SEARCH ---------------- */
  const handleSearch = async (value) => {
    setSearch(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await api.get(`/foods?search=${value}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Food search failed", err);
    }
  };

  const handleAddItem = (food) => {
    const existing = localItems.find(i => i.foodId === food._id);

    if (existing) {
      setLocalItems(localItems.map(i =>
        i.foodId === food._id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setLocalItems([
        ...localItems,
        {
          foodId: food._id,
          name: food.name,
          price: food.price,
          qty: 1,
        },
      ]);
    }

    setSearch("");
    setSuggestions([]);
  };

  const handleSendOrder = async () => {
    if (!selectedGroup || localItems.length === 0) {
      alert("Select group and add items");
      return;
    }

    await api.post(`/orders/${selectedGroup._id}/send`, {
      items: localItems,
    });

    setLocalItems([]);
    socket.emit("refreshOrders");
    alert("Order sent");
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Waiter Panel</h2>

      {/* STEP 1: TABLE */}
      {!selectedTable && (
        <>
          <h3>Select Table</h3>
          {tables.map(t => (
            <button
              key={t._id}
              onClick={() => handleTableSelect(t)}
              style={{ margin: "5px" }}
            >
              {t.name}
            </button>
          ))}
        </>
      )}

      {/* STEP 2: GROUP */}
      {selectedTable && !selectedGroup && (
        <>
          <h3>Table {selectedTable.name} – Select Group</h3>
          {FIXED_GROUPS.map(g => (
            <button
              key={g}
              onClick={() => handleGroupSelect(g)}
              style={{ margin: "5px" }}
            >
              {g}
            </button>
          ))}
        </>
      )}

      {/* STEP 3: SEARCH BOX */}
      {selectedGroup && (
        <>
          <h3>
            Table {selectedTable.name} | Group {selectedGroup.name}
          </h3>

          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              marginBottom: "5px",
            }}
          />

          {/* LIVE SUGGESTIONS */}
          {suggestions.length > 0 && (
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {suggestions.map(f => (
                <div
                  key={f._id}
                  onClick={() => handleAddItem(f)}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {f.name} – ${f.price}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CURRENT ITEMS */}
      {localItems.length > 0 && (
        <>
          <h3>Current Items</h3>
          <ul>
            {localItems.map((i, idx) => (
              <li key={idx}>
                {i.name} x{i.qty} = ${i.qty * i.price}
              </li>
            ))}
          </ul>
          <button onClick={handleSendOrder}>Send Order</button>
        </>
      )}
    </div>
  );
}
