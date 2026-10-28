import PropTypes from "prop-types";
import { Dish } from "./Dish.jsx";
import { Card } from "./Card.jsx";

export function Menu({ dishes = [], category, loading = false, error = null }) {
  if (loading) {
    return <p className="status">Loading menu...</p>;
  }

  
  if (error) {
    return <p className="status error">Could not load menu: {error}</p>;
  }

 
  const visibleDishes = category
    ? dishes.filter((dish) => dish.category === category)
    : dishes;

  
  if (visibleDishes.length === 0) {
    return (
      <p className="status">
        No dishes found {category ? `for category "${category}"` : ""}.
      </p>
    );
  }


  return (
    <div className="menu-list">
      {visibleDishes.map((dish) => (
        <Card key={dish.id}>
          <Dish
            name={dish.name}
            price={dish.price}
            spicy={dish.spicy}
          />
        </Card>
      ))}
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
  category: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
};