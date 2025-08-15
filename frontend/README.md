I built a small MERN Todo app to practice secure authentication and private routes.
Users can sign up, log in, and manage their own todos (CRUD). Passwords are hashed with bcrypt and sessions use JWT stored in HTTP-only cookies for better security. All todo APIs and pages are protected, so each user only sees their own data. I also added basic hardening (helmet, CORS with credentials, rate limiting). The goal was to show clean, per-user CRUD with modern auth done safely.

Interview

1. JWT: signed token (header.payload.signature) to prove identity.

2. Signup/Login: hash on signup; compare on login; issue JWT cookie.

3. Password hashing: one-way transform; never store plain text.

4. bcrypt use: hash on signup, compare on login; slow by design.

5. Private route: only accessible with valid JWT (backend & frontend).

6. Store tokens: HTTP-only cookie (safer than localStorage).

7. Middleware (Express): code that runs before handlers (auth, validation, etc.).

8. AuthN vs AuthZ: who you are vs what you can do.

9. JWT missing: return 401 Unauthorized.

10. Keep routes secure: verify JWT, HTTPS, HTTP-only cookies, input validation, rate limit, helmet, least privilege.
