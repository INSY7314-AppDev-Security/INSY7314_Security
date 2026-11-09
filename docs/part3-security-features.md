## Additional Security Features (Part 3)

Beyond the baseline controls from Parts 1 and 2 (bcrypt hashing, JWT, RBAC, validation, rate limiting, Helmet/CSP, HTTPS, ownership checks), Part 3 adds two further features that close specific gaps found while reviewing the Part 2 code.

| # | Feature | Gap in Part 2 | Main files |
|---|---|---|---|
| A | Account lockout and timing-safe login | Login was limited per IP only, and unknown emails were answered faster than wrong passwords | `utils/lockout.js`, `controllers/authController.js`, `utils/hashPassword.js`, `models/User.js` |
| B | Server-side session revocation (real logout, live role check, short-lived tokens) | A stolen token stayed valid for 24 hours, logout only deleted it in the browser, and the role in the token was trusted even after a user was deleted or changed | `middleware/authMiddleware.js`, `utils/sessionCheck.js`, `utils/generateToken.js`, `POST /api/auth/logout` |

### Feature A: Account lockout and timing-safe login

**Threat addressed:** brute-force and credential-stuffing attacks, and user enumeration (working out which emails are registered).

**Why the existing rate limit was not enough:** the login limiter counts requests per IP address (5 per 15 minutes). An attacker who spreads guesses over many IP addresses is never limited, yet can try unlimited passwords against one victim. Lockout counts failures per **account**, whichever IP they come from, so it protects the victim directly.

**How it works**

1. Every wrong password increases `failedLoginAttempts` on that user. The increase uses MongoDB `$inc`, which is atomic, so simultaneous requests cannot undercount.
2. When the count reaches `LOCKOUT_MAX_ATTEMPTS` (default 5) the account is locked until `lockUntil` (default 15 minutes ahead).
3. While locked, the API answers `423 Locked` **without checking the password**, so even the correct password cannot be used to confirm a guess during the lock.
4. When the lock runs out, the counter is reset and the user gets a fresh set of attempts. A successful login also resets the counter.
5. **Timing-safe login:** if the email does not exist, the server still runs a bcrypt comparison against a throwaway hash. A wrong password and an unknown email therefore take about the same time and return the same `401 Invalid email or password`, so response time and message do not reveal which emails are registered.
6. Each step writes a security event (`LOGIN_FAILED`, `ACCOUNT_LOCKED`, `LOGIN_BLOCKED_LOCKED`, `LOGIN_SUCCESS`) for the logging system. Events never contain passwords or tokens.

**Configuration (`backend/.env`)**

| Variable | Default | Meaning |
|---|---|---|
| `LOCKOUT_MAX_ATTEMPTS` | 5 | Failed logins before the account locks |
| `LOCKOUT_MINUTES` | 15 | Length of the lock |

**Trade-off (documented decision):** the `423` response tells someone that the email belongs to a real account. We accepted this because genuine users need to know why they cannot log in, and the per-IP limiter already limits how quickly anyone can probe emails. A temporary lock can also be triggered on purpose against a known email, which only delays that user for the lock period; no data is exposed.

### Feature B: Server-side session revocation

**Threat addressed:** stolen or leaked tokens (for example through XSS, because the token is kept in `localStorage`), tokens that outlive a logout, and stale roles.

**How it works**

1. Each user has a `tokenVersion` number. Every JWT carries that number (`tv`).
2. The `protect` middleware verifies the signature and expiry, then loads the user from the database. It rejects the request with `401` if the user no longer exists or if the token's `tv` does not match the stored `tokenVersion`.
3. `POST /api/auth/logout` raises `tokenVersion`. That cancels **every** token issued so far, on this device and any other, immediately.
4. The role used for authorisation (`req.user.role`) comes from the database, not from the token, so a changed or removed account loses access straight away instead of when the token expires.
5. Tokens are now short-lived: 2 hours by default (`JWT_EXPIRES_IN`), down from 24 hours.
6. All rejections return the same `401 Not authorized, token failed` message, so the API does not explain why a token was refused. The reason is written to the security log (`TOKEN_REJECTED` with `token_revoked`, `user_not_found` or `invalid_or_expired`). Logging out writes `LOGOUT`.
7. The React logout button calls the endpoint before it removes the token from the browser.

**Configuration:** `JWT_EXPIRES_IN` (default `2h`).

**Cost and limits:** every protected request now makes one small database read. Tokens issued before this feature carry no `tv` and are treated as version 0, so they keep working until their normal expiry. The token is still stored in `localStorage`; revocation and the shorter lifetime limit the damage of a stolen token but do not stop it being stolen. Moving to an `httpOnly` cookie would be the next step.

### Threats and the controls that address them

| Threat | Control |
|---|---|
| Password guessing against one account from many IPs | Account lockout (A) |
| Finding registered emails through response time or error text | Dummy bcrypt comparison and one generic message (A) |
| Using a correct password found mid-attack during a lock | Password is not checked while locked (A) |
| Stolen token used after the user logs out | Token version check and `POST /api/auth/logout` (B) |
| Token valid for a deleted user | Database lookup in `protect` (B) |
| Old role kept after an account change | Role read from the database (B) |
| Long window for a leaked token | 2 hour default expiry (B) |
| Attacker learns why a token failed | Identical `401` message, detail only in the log (B) |

### Testing the features

**Unit tests (no database needed):** from `backend/`, run `npm test`. 22 Jest tests cover the lockout helpers, the token version check, token creation and the `protect` middleware (valid, revoked, deleted-user, bad-signature and database-failure cases).

**API tests with Newman:** these need the server running with a low lockout limit and a raised IP limit, so the lockout can be reached within the same run:

```bash
# in backend/.env (test only)
LOCKOUT_MAX_ATTEMPTS=3
LOGIN_RATE_LIMIT_MAX=100
```

Start the backend, then run:

```bash
npm run test:api:part3
```

The collection `backend/postman/HustleHub-Part3-Security.postman_collection.json` has 18 requests and 44 assertions: three failures then a locked correct password (`423`), a generic response for unknown emails, logout, rejection of the old token and of a second device's token, and a fresh login working afterwards. Run it separately from the Part 2 collection, which depends on the default rate limit.
