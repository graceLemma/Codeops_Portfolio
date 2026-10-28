import { useState, useEffect, useRef } from "react";
import { fetchDishes } from "./api";
import { CategoryBar } from "./CategoryBar";
import { DishList } from "./DishList";
import { OrderForm } from "./OrderForm";

export function Menu() {
  const [dishes, setDishes] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // useRef to focus search input directly on component mount
  const searchInputRef = useRef(null);

  const categories = ["All", "Main", "Vegan", "Grill", "Appetizer"];

  // Effect 1: Auto-focus search field on initial mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Effect 2: Data fetching with category dependency and AbortController cleanup
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function loadData() {
      try {
        const data = await fetchDishes(category, controller.signal);
        setDishes(data);
      } catch (err) {
        // Ignore abort errors caused by intentional cancellation
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Cleanup function: aborts pending network fetch if user switches categories rapidly
    return () => controller.abort();
  }, [category]);

  // Effect 3: Sync document title with current item count
  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    document.title = `Addis Eats - ${filteredDishes.length} items`;
  }, [filteredDishes.length]);

  function handleAddToCart(price) {
    setTotal((prev) => prev + price);
  }

  return (
    <div className="menu-container">
      <h2>Addis Eats Interactive Menu</h2>

      {/* Search Input using Ref for initial focus */}
      <div className="search-box">
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dishes..."
        />
      </div>

      <CategoryBar
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />

      {/* Conditional Rendering using Priority Early-Return Pattern */}
      {loading && <p className="status">Loading menu items...</p>}
      
      {error && !loading && <p className="status err">Error: {error}</p>}

      {!loading && !error && (
        <>
          <DishList dishes={filteredDishes} onAddToCart={handleAddToCart} />

          <div className="order-summary">
            <h3>Current Total: {total} ETB</h3>
          </div>

          <OrderForm total={total} />
        </>
      )}
    </div>
  );
}