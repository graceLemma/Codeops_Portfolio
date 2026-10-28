import PropTypes from "prop-types";
import { Dish } from "./Dish";

export function DishList({ dishes, onAddToCart }) {
  if (dishes.length === 0) {
    return <p className="status">No dishes found in this category.</p>;
  }

  return (
    <div className="dish-list">
      {dishes.map((dish) => (
        <Dish
          key={dish.id}
          name={dish.name}
          price={dish.price}
          spicy={dish.spicy}
          onAdd={() => onAddToCart(dish.price)}
        />
      ))}
    </div>
  );
}

DishList.propTypes = {
  dishes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      spicy: PropTypes.bool,
    })
  ).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};