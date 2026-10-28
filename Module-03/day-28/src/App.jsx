import { SAMPLE_DISHES } from "./data";
import { Menu } from "./Menu";

export default function App() {
  return (
    <main className="app-container">
      <Menu dishes={SAMPLE_DISHES} />
    </main>
  );
}