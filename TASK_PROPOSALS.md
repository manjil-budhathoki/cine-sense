# Codebase Task Proposals

## 1) Typo fix task
**Title:** Correct typo in watchlist deletion comment (`URl` → `URL`).

**Why:** There is a minor typo in `WatchlistDestroyView` comment text (`URl`) that should be corrected for clarity and professionalism.

**Scope:**
- Update the inline comment in `backend/api/views.py` to use `URL`.

**Acceptance criteria:**
- Comment reads clearly and uses correct spelling/capitalization.
- No behavior changes.

---

## 2) Bug fix task
**Title:** Implement `register` and `updateUser` methods in `AuthContext`.

**Why:** `AuthContext` currently ships placeholder implementations (`/* ... */`) for `register` and `updateUser`. `RegisterPage` calls `register(...)`, so registration flow can silently fail or behave unexpectedly because the context method is a stub.

**Scope:**
- Replace placeholder `register` with a real call to `registerUser` API function.
- Implement `updateUser` to update local `user` state consistently.
- Add/adjust error handling to preserve current UX patterns.

**Acceptance criteria:**
- Registration form submits through `registerUser` and returns/rejects as expected.
- `updateUser` updates context state with merged user data.
- Existing login/watchlist behavior remains unchanged.

---

## 3) Comment/documentation discrepancy task
**Title:** Replace scaffolded frontend README with project-specific setup and architecture docs.

**Why:** `frontend/README.md` is still the default Vite template and does not describe this app’s actual auth model, API proxying, environment variables (`VITE_TMDB_API_KEY`), or run/test commands. This is misleading for contributors.

**Scope:**
- Rewrite `frontend/README.md` with:
  - project purpose,
  - local setup,
  - required env vars,
  - backend/frontend run commands,
  - common troubleshooting notes.

**Acceptance criteria:**
- README content matches current app behavior and folder structure.
- New contributor can run frontend without opening source files.

---

## 4) Test improvement task
**Title:** Add API tests for auth + watchlist permissions and recommendation validation.

**Why:** `backend/api/tests.py` currently has no real tests, leaving critical behavior (auth requirements, per-user watchlist isolation, and recommendation input validation) unverified.

**Scope:**
- Add Django REST tests for:
  - unauthenticated access blocked on protected endpoints,
  - authenticated user only sees own watchlist items,
  - recommendation endpoint returns `400` when `mood` is missing.

**Acceptance criteria:**
- Test module contains meaningful test cases with assertions.
- Tests pass locally with `python manage.py test`.
