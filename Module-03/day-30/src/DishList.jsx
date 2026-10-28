import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useCart } from "./CartContext";

// Wrapped in React.memo to prevent re-rendering when props stay identical
export const DishList = React.memo(function DishList({ dishes }) {
  const { dispatch } = useCart();

  const handleAdd = useCallback(
    (dish) => {
      dispatch({ type: "add", dish });
    },
    [dispatch]
  );

  if (dishes.length === 0) {
    return <p className="status">No dishes found in this category.</p>;
  }

  return (
    <div className="dish-list">
      {dishes.map((dish) => (
        <div key={dish.id} className="dish-card">
          <h3>
            {dish.name} {dish.spicy && <span className="badge spicy">• Spicy</span>}
          </h3>
          <p>{dish.price} ETB</p>
          <button type="button" onClick={() => handleAdd(dish)}>
            Add to Order
          </button>
        </div>
      ))}
    </div>
  );
});

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
};