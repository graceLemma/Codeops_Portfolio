import { useState, useMemo } from "react";
import { useFetch } from "./useFetch";
import { DishList } from "./DishList";

export function Menu() {
  const [category, setCategory] = useState("All");
  const categories = ["All", "Main", "Vegan", "Grill", "Appetizer"];

  // Custom fetch hook fetching from static mock endpoint
  const { data: dishes, loading, error } = useFetch("/dishes.json");

  // Filter dishes based on state during render (derived state)
  const visibleDishes = useMemo(() => {
    if (!dishes) return [];
    if (category === "All") return dishes;
    return dishes.filter((dish) => dish.category === category);
  }, [dishes, category]);

  return (
    <div className="menu-container">
      <div className="category-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={cat === category ? "chip on" : "chip"}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="status">Loading menu items...</p>}
      {error && <p className="status error">Error: {error}</p>}
      {!loading && !error && <DishList dishes={visibleDishes} />}
    </div>
  );
}