# Birr Watch 💵🇪🇹

**Birr Watch** is a clean, lightweight currency conversion web application focused on converting Ethiopian Birr (ETB) into various global currencies in real-time. It also features a persistent custom currency watchlist.

---

##  Features

- **Live Exchange Rates:** Fetches up-to-date conversion rates for ETB directly via the Open Exchange Rates API (`open.er-api.com`).
- **Instant ETB Conversion:** Calculates conversions dynamically based on the input amount and selected currency target.
- **Custom Watchlist:** Allows users to track specific exchange rates for quick reference (e.g., `1 ETB = X USD`).
- **Local Persistence:** Saves your selected currency and active watchlist items to `localStorage` so they persist across page reloads.
- **Minimalist Styling:** Designed with CSS custom properties (variables) for consistent surface, typography, and button styling.

---

##  Project Structure

  text
├── index.html   # Main HTML layout and structural components
├── app.js       # Main application state, API calls, DOM manipulation & state management
├── style.css    # Responsive styles, design tokens, and CSS layout
└── README.md    # Project documentation