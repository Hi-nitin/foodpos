import { useState, useEffect } from "react";
import api from "../api/api";
import style from "../style/recipe.module.css";

export default function AddRecipe() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState("");
  const [steps, setSteps] = useState([{ description: "", image: null, preview: "" }]);

  const DRINK_CATEGORY_ID = "696f6781a564d162e3d5a3a4";

  /* ---------------- LOAD FOODS ---------------- */
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await api.get(`/foods?categoryId=${DRINK_CATEGORY_ID}`);
        setFoods(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch foods from backend");
      }
    };
    fetchFoods();
  }, []);

  /* ---------------- STEP HANDLERS ---------------- */
  const addStep = () => setSteps([...steps, { description: "", image: null, preview: "" }]);
  const removeStep = (idx) => setSteps(steps.filter((_, i) => i !== idx));
  const updateDesc = (idx, val) => {
    const copy = [...steps];
    copy[idx].description = val;
    setSteps(copy);
  };
  const updateImage = (idx, file) => {
    const copy = [...steps];
    copy[idx].image = file;
    copy[idx].preview = URL.createObjectURL(file);
    setSteps(copy);
  };

  /* ---------------- SUBMIT ---------------- */
  const submitRecipe = async () => {
    if (!selectedFood) return alert("Select a food item");
    if (steps.some(s => !s.description.trim())) return alert("All steps need description");

    try {
      const existing = await api.get(`/recipes/food/${selectedFood}`);
      if (existing.data) return alert("Recipe already exists for this food");
    } catch (err) {
      if (err.response?.status !== 404) return alert("Error checking recipe");
    }

    const foodName = foods.find(f => f._id === selectedFood)?.name || "Food";
    const formData = new FormData();
    formData.append("title", `How to make ${foodName}`);
    formData.append("food", selectedFood);
    formData.append("steps", JSON.stringify(steps.map(s => ({ desc: s.description }))));
    steps.forEach(s => {
      if (s.image) formData.append("images", s.image);
    });

    try {
      await api.post("/recipes", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Recipe created successfully");
      setSelectedFood("");
      setSteps([{ description: "", image: null, preview: "" }]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save recipe");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className={style.recipeContainer}>
      <h2>Add Recipe</h2>

      <label>Select Food</label>
      <select value={selectedFood} onChange={e => setSelectedFood(e.target.value)}>
        <option value="">Select Food</option>
        {foods.map(f => (
          <option key={f._id} value={f._id}>{f.name}</option>
        ))}
      </select>

      <h3>Steps</h3>
      {steps.map((s, idx) => (
        <div key={idx} className={style.stepCard}>
          <textarea
            placeholder={`Step ${idx + 1}`}
            value={s.description}
            onChange={e => updateDesc(idx, e.target.value)}
          />
          <input type="file" accept="image/*" onChange={e => updateImage(idx, e.target.files[0])} />
          {s.preview && <img src={s.preview} alt="preview" className={style.preview} />}
          {steps.length > 1 && <button className={style.removeBtn} onClick={() => removeStep(idx)}>Remove Step</button>}
        </div>
      ))}

      <button className={style.addBtn} onClick={addStep}>Add Step</button>
      <button className={style.saveBtn} onClick={submitRecipe}>Save Recipe</button>
    </div>
  );
}
