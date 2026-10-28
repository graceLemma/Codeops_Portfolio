import { SAMPLE_DISHES } from "./data";
import { Menu } from "./Data.jsx";

export default function App() {
  return (
    <main className="app-container">
      <h1>Addis Eats Menu</h1>

      <section>
        <h2>Main Dishes</h2>
        <Menu dishes={SAMPLE_DISHES} category="Main" />
      </section>

      <section>
        <h2>Vegetarian Dishes</h2>
        <Menu dishes={SAMPLE_DISHES} category="Vegetarian" />
      </section>

      <section>
        <h2>Desserts (Empty Category Example)</h2>
        <Menu dishes={SAMPLE_DISHES} category="Dessert" />
      </section>
    </main>
  );
}