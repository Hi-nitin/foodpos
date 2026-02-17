import { useState, useEffect } from "react";
import api from "../api/api";
import "../style/recipeViewer.css";

export default function RecipeViewer() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const SERVER_URL = "http://localhost:5000";

  /* ---------------- LOAD FOOD ITEMS ---------------- */
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await api.get("/foods");
        setFoods(res.data);
      } catch (err) {
        console.error("Error fetching foods:", err);
      }
    };

    fetchFoods();
  }, []);

  /* ---------------- LOAD RECIPE ---------------- */
  useEffect(() => {
    if (!selectedFood) {
      setRecipe(null);
      return;
    }

    const fetchRecipe = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/recipes/food/${selectedFood}`);

        setRecipe(res.data); // backend returns single object
      } catch (err) {
        console.error("Recipe fetch error:", err);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [selectedFood]);

  /* ---------------- UI ---------------- */
  return (
    <div className="recipe-viewer-container">
      <h2>View Food Recipe</h2>

      <label>Select Food</label>
      <select
        value={selectedFood}
        onChange={(e) => setSelectedFood(e.target.value)}
      >
        <option value="">Select Food</option>
        {foods.map((f) => (
          <option key={f._id} value={f._id}>
            {f.name}
          </option>
        ))}
      </select>

      {/* Loading */}
      {loading && <p>Loading recipe...</p>}

      {/* Recipe Display */}
      {!loading && recipe && (
        <div className="recipe-details">
          <h3>{recipe.title}</h3>

          {recipe.steps?.length > 0 ? (
            <div className="steps-list">
              {recipe.steps.map((step, index) => (
                <div key={index} className="step-card">
                  <p>
                    <strong>Step {index + 1}:</strong> {step.desc}
                  </p>

                  {step.image && (
                    <img
                      src={`${step.image}`}
                      alt={`Step ${index + 1}`}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No steps found.</p>
          )}
        </div>
      )}

      {!loading && selectedFood && !recipe && (
        <p>No recipe found for this food.</p>
      )}

      {!loading && !selectedFood && (
        <p>Please select a food to view recipe.</p>
      )}
    </div>
  );
}
