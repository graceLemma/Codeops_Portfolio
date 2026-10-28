# Addis Eats - Week 1 React Project

## Custom Hooks & Architecture Summary

* **`useFetch.js`**: Custom hook encapsulating network requests, loading, error handling, and `AbortController` cancellation cleanup to eliminate race conditions.
* **`cartReducer.js`**: Pure transition logic for managing cart items (`add`, `remove`, `clear`) without side effects.
* **`CartContext.jsx`**: Global context provider using `useReducer` to manage global cart state and avoid prop drilling across components like `Header` and `CheckoutPanel`. Memoized using `useMemo` to preserve reference equality.
* **`DishList.jsx`**: Uses `React.memo` alongside `useCallback` to prevent superfluous re-renders of the dish list when non-dependent state changes.