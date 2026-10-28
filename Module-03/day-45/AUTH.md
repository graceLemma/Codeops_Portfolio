# Authentication & Security Implementation (AUTH.md)

## Protected Routes & Boundaries
- `/dashboard`: Protected via server-side session verification. Unauthenticated requests are automatically redirected to `/signin?next=/dashboard`.

## Mitigated Attack Vectors
1. **Unauthenticated Server Mutations**: Blocked via strict session checks inside Server Actions (`lib/actions.ts`).
2. **Horizontal Privilege Escalation (ID Tampering)**: Prevented by verifying session user IDs against requested record parameters (`searchParams.id`).
3. **Open Redirect Vulnerabilities**: Prevented by validating incoming `?next=` query parameters on sign-in before routing.
