import { useState } from "react";
import PropTypes from "prop-types";
import { CategoryBar } from "./CategoryBar";
import { DishList } from "./DishList";
import { OrderForm } from "./OrderForm";

export function Menu({ dishes = [] }) {
  const [category, setCategory] = useState("All");
  const [total, setTotal] = useState(0);

  const categories = ["All", "Main", "Vegan", "Grill", "Appetizer"];

  // Derive shown list from category state
  const shownDishes =
    category === "All"
      ? dishes
      : dishes.filter((dish) => dish.category === category);

  function handleAddToCart(price) {
    setTotal((prevTotal) => prevTotal + price);
  }

  return (
    <div className="menu-container">
      <h2>Addis Eats Menu</h2>

      <CategoryBar
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />

      <DishList dishes={shownDishes} onAddToCart={handleAddToCart} />

      <div className="order-summary">
        <h3>Running Total: {total} ETB</h3>
      </div>

      <OrderForm total={total} />
    </div>
  );
}

Menu.propTypes = {
  dishes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      spicy: PropTypes.bool,
    })
  ).isRequired,
};