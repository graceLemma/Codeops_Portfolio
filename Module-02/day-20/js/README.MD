# Dish Fetcher Exercise

A lightweight asynchronous web page that fetches dish recommendations from a public REST API using JavaScript `async/await`, `fetch`, and robust error handling.

## API URL
- **Endpoint:** `https://dummyjson.com/recipes`

## Requirements Met
- [x] `async load()` function defined to manage state and API calls.
- [x] Displays a dynamic "Loading..." state before data fetching begins.
- [x] Handles `fetch()` responses and explicitly throws an error if `!res.ok`.
- [x] Parses responses via `await res.json()` and renders list items dynamically into `<ul id="list">`.
- [x] Wrapped inside `try / catch` to capture network/parsing errors and display user-friendly alert messages.
- [x] Utilizes `finally` block to clear loading indicators and re-enable controls regardless of outcome.
- [x] Includes a "Refresh Menu" button to trigger `load()` manually.

## Self-Check List
1. **Successful Load:** Open `index.html` in your browser. "Loading dishes..." appears briefly, followed by recipes rendered from the DummyJSON API with titles (`dish.name`) and thumbnails (`dish.image`).
2. **Refresh Action:** Click "Refresh Menu" button to trigger a reload cycle.
3. **Error Handling Check:** Intentionally alter `API_URL` to an invalid address (e.g., `https://dummyjson.com/invalid-endpoint`) in `app.js` and reload. A stylized error message will display on screen without crashing the script.