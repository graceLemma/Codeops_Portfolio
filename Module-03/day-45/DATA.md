# Data Fetching & Caching Strategy (DATA.md)

- **Session Data**: Fetched server-side via simulated session cookies/JWT lookup with immediate redirection on failure.
- **Task State**: Managed client-side via React `useState` with optimistic UI updates and robust empty states.
