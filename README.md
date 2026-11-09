# HustleHub+ — Secure Full-Stack Freelance Marketplace

## INSY7314 | Application Development Security POE (Parts 1–3)

HustleHub+ is a secure freelance marketplace built for the Application Development Security Portfolio of Evidence (POE). Freelancers advertise services, and clients browse gigs and make bookings.

The project progressed from a secure backend prototype (Part 1), to a full-stack MERN application (Part 2), to a containerised, continuously tested and statically analysed system with cloud logging (Part 3).

**Security is central to the application.** Controls include bcrypt password hashing, JWT authentication, role-based access control (RBAC), input validation and sanitisation, resource ownership checks, rate limiting, security headers, Content Security Policy (CSP), HTTPS, and controlled error handling. Part 3 adds automated security checks in a CI/CD pipeline, SonarQube static analysis, cloud logging, and two additional security features.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features and User Roles](#2-features-and-user-roles)
3. [Technologies Used](#3-technologies-used)
4. [System Architecture](#4-system-architecture)
5. [Getting Started](#5-getting-started)
6. [Environment Configuration and Secrets](#6-environment-configuration-and-secrets)
7. [Security Implementation](#7-security-implementation)
8. [Security Review: Threats and Protections](#8-security-review-threats-and-protections)
9. [Testing](#9-testing)
10. [CI/CD Pipeline](#10-cicd-pipeline)
11. [SonarQube Static Analysis](#11-sonarqube-static-analysis)
12. [Logging and Monitoring](#12-logging-and-monitoring)
13. [Evidence](#13-evidence)
14. [Demonstration Videos](#14-demonstration-videos)
15. [Limitations and Future Enhancements](#15-limitations-and-future-enhancements)
16. [Repository Information](#16-repository-information)
17. [AI Declaration](#17-ai-declaration)
18. [References](#18-references)

---

## 1. Project Overview

**Part 1 — Secure Backend Foundation:** registration and login, bcrypt hashing, JWT generation and verification, protected endpoints, validation and error handling, local HTTPS, initial Postman testing.

**Part 2 — Full-Stack Marketplace:** React frontend, MongoDB persistence, gig CRUD and category filtering, booking creation with simulated confirmation, automatic transaction records, freelancer income tracking, expanded RBAC, and a 104-request Postman/Newman collection.

**Part 3 — DevSecOps and Hardening:**
- Docker containers for backend and frontend, run together with Docker Compose.
- Correct tax calculation logic for bookings and transactions.
- Two additional security features (see [Section 7](#7-security-implementation)).
- Cloud-based logging (see [Section 12](#12-logging-and-monitoring)).
- GitHub Actions CI/CD pipeline running backend unit tests, Newman integration tests, frontend unit tests, Playwright integration tests, builds, dependency audit and SonarQube analysis.
- Secrets held in GitHub repository secrets.
- Written security review mapping threats to protections.

---

## 2. Features and User Roles

### 2.1 Application Features

| Feature | Description |
|---|---|
| Authentication | Registration, login, bcrypt hashing, JWT authentication. |
| Gig management | Freelancers create, view, update and delete their own listings. |
| Gig browsing | Clients browse gigs and filter by category. |
| Bookings | Clients create bookings and receive simulated confirmations. |
| Transactions | Bookings generate transaction records with tax calculated server-side. |
| Tax logic | **[TEAMMATE TO COMPLETE: tax rate used (e.g. VAT %), whether prices are tax-inclusive or exclusive, rounding rule, and which file implements it.]** |
| Income tracking | Freelancers view income totals for their bookings. |
| Extra security features | **[TEAMMATE TO COMPLETE: name the two features; see Section 7.]** |
| Cloud logging | **[TEAMMATE TO COMPLETE: provider; see Section 12.]** |
| Containerisation | Backend and frontend Dockerfiles and a Compose file that runs the full stack. |
| CI/CD | Automated tests, builds and static analysis on every push and pull request. |

### 2.2 User Roles

**Client:** registers and logs in, browses gigs, creates bookings, views their own bookings and permitted transactions.

**Freelancer:** registers and logs in, manages their own gigs, views permitted bookings, tracks income.

**Administrator:** accesses designated administrative functionality. The account is created by the backend seeding script, never through public registration.

Role permissions are enforced by the backend. Hiding a button in the frontend does not replace server-side authorisation.

---

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| MongoDB | Persistent storage |
| Express.js / Node.js | Backend REST API and runtime |
| React | Frontend user interface |
| bcrypt | Password hashing |
| JSON Web Tokens | Authentication |
| express-validator | Request validation |
| Helmet and CSP | Security headers and content restrictions |
| express-rate-limit (or equivalent) | Rate limiting on sensitive endpoints |
| dotenv | Environment configuration |
| Jest | Backend and frontend unit tests |
| Postman and Newman | API integration testing and reporting |
| Playwright | Frontend end-to-end integration testing |
| GitHub Actions | CI/CD pipeline |
| SonarQube | Static analysis and quality gate |
| Docker and Docker Compose | Containerisation |
| **[Logging provider]** | Cloud-based logging |

---

## 4. System Architecture

```text
 Developer push / PR
        │
        ▼
 ┌─────────────────────────┐        ┌──────────────────────┐
 │ GitHub Actions pipeline │───────▶│ SonarQube analysis   │
 │ tests · build · audit   │        │ + quality gate       │
 └─────────────────────────┘        └──────────────────────┘

 ┌──────────────────────────────┐
 │        React Frontend        │  (container)
 └──────────────┬───────────────┘
                │ HTTPS / API requests
                ▼
 ┌──────────────────────────────┐        ┌──────────────────────┐
 │    Node.js / Express API     │───────▶│ Cloud logging        │
 │ JWT · RBAC · validation ·    │        └──────────────────────┘
 │ rate limiting · tax logic    │  (container)
 └──────────────┬───────────────┘
                ▼
 ┌──────────────────────────────┐
 │           MongoDB            │
 └──────────────────────────────┘
```

Every request passes through security middleware, validation, authentication and authorisation before any database operation. For example, a freelancer updating a gig must be authenticated, hold the freelancer role, and own that gig. A valid JWT alone does not grant access to marketplace resources.

---

## 5. Getting Started

### 5.1 Prerequisites

- [Node.js](https://nodejs.org/) 20 and npm
- [MongoDB](https://www.mongodb.com/try/download/community) (or use Docker Compose)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) and Docker Compose (for the containerised option)
- [Postman](https://www.postman.com/downloads/) (optional, Newman runs from the command line)

### 5.2 Clone the Repository

```bash
git clone https://github.com/INSY7314-AppDev-Security/INSY7314_Security.git
cd INSY7314_Security
```

### 5.3 Option A: Run with Docker Compose

1. Create `backend/.env` from `backend/.env.example` (see [Section 6](#6-environment-configuration-and-secrets)).
2. From the repository root:

```bash
docker compose up --build
```

**[TEAMMATE TO CONFIRM: the service names, exposed ports and the URLs where the frontend and API become available.]**

### 5.4 Option B: Run locally

**Backend**

```bash
cd backend
npm install
cp .env.example .env        # then edit the values
node generate-cert.js       # local development TLS certificate
npm run seed:admin          # creates the administrator from the .env credentials
npm start
```

The API listens on `https://localhost:5000` by default. **[Confirm the port against `PORT` in your `.env`.]** The development certificate is self-signed, so browsers and Newman need to be told to trust it for local use.

**Frontend** (second terminal)

```bash
cd frontend
npm install
npm start
```

The frontend reads the API address from `REACT_APP_API_URL` (for example `https://localhost:5000/api`). Environment variables prefixed with `REACT_APP_` are embedded in the browser bundle at build time, so never place secrets in them. The development server runs on `http://localhost:3000`.

---

## 6. Environment Configuration and Secrets

Configuration is kept out of source code and out of Git.

| Variable | Purpose |
|---|---|
| `PORT` | API listening port |
| `NODE_ENV` | Environment mode |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Signs and verifies tokens |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Administrator seeding |
| `REACT_APP_API_URL` | Frontend API base URL (public, not secret) |

**[Match these names to `backend/.env.example` and correct any that differ.]**

### 6.1 GitHub repository secrets

The pipeline reads sensitive values from **Settings → Secrets and variables → Actions**. None are hardcoded in the workflow or repository.

| Secret | Used by |
|---|---|
| `JWT_SECRET` | Backend and E2E jobs |
| `ADMIN_EMAIL` | Admin seeding in CI |
| `ADMIN_PASSWORD` | Admin seeding and Newman `adminPassword` variable |
| `SONAR_TOKEN` | SonarQube authentication |
| `SONAR_HOST_URL` | SonarQube server address |

GitHub masks secret values in workflow logs. The CI database is a throwaway MongoDB service container that exists only for the duration of the run.

Good practice followed: `.env` is git-ignored, secrets are unique per environment, and the MongoDB instance is reachable only by the services that need it.

---

## 7. Security Implementation

| Security Control | Purpose |
|---|---|
| bcrypt password hashing | Passwords are never stored in plain text. |
| JWT authentication | Verifies the identity of callers on protected endpoints. |
| Role-based access control | Restricts operations by client, freelancer and administrator role. |
| Resource ownership checks | Prevents access to or modification of other users' resources. |
| Input validation | Rejects invalid or incomplete data. |
| Input sanitisation | Mitigates script and NoSQL injection attempts. |
| Mass-assignment protection | Restricts which fields a caller may set. |
| Rate limiting | Limits repeated requests (login: 5 per IP per 15 minutes; bookings: per the configured limiter). Excess requests receive HTTP `429`. |
| Helmet and CSP | Security headers and content-loading restrictions. |
| HTTPS | Encrypts traffic in transit (self-signed certificate for development only). |
| Controlled error handling | Hides stack traces and file paths from clients. |
| Server-controlled booking data | Prices, tax and user identity are computed or verified by the backend, never trusted from the client. |
| Environment variables and GitHub secrets | Keep credentials out of source control. |
| **[Extra feature 1]** | **[TEAMMATE TO COMPLETE]** |
| **[Extra feature 2]** | **[TEAMMATE TO COMPLETE]** |
| Automated dependency audit | `npm audit` in the pipeline fails the build on high or critical vulnerabilities. |
| Static analysis | SonarQube detects vulnerabilities, security hotspots and code smells on every run. |

**Authentication versus authorisation:** authentication identifies the user, authorisation decides what that user may do. Both are required.

**Ownership enforcement:** an identifier in a request is not proof of ownership. The backend checks it before every read or write.

**Booking integrity:** price, tax and identities are derived on the server so a tampered frontend cannot alter financial data.

---

## 8. Security Review: Threats and Protections

The review maps threats (grouped by the [OWASP Top 10 (2021)](https://owasp.org/Top10/) categories) to the controls that address them and the evidence that those controls work.

| # | Threat | OWASP category | Protection(s) | Verified by |
|---|---|---|---|---|
| 1 | A user reads or edits another user's gig, booking or income data (IDOR) | A01 Broken Access Control | RBAC middleware, ownership checks on every resource | Newman ownership and RBAC tests; backend unit tests |
| 2 | Privilege escalation by registering as an admin or changing a role | A01 Broken Access Control | Mass-assignment protection, admin created only by seeding | Newman privilege-escalation tests |
| 3 | Credentials or tokens exposed in transit | A02 Cryptographic Failures | HTTPS, JWTs signed with a secret held outside source code | Newman header checks; manual certificate review |
| 4 | Stolen password database is cracked | A02 Cryptographic Failures | bcrypt salted hashing | Unit tests for hashing and comparison |
| 5 | NoSQL or script injection via request bodies | A03 Injection | express-validator, sanitisation, schema typing | Newman injection scenarios; SonarQube |
| 6 | Cross-site scripting | A03 Injection | Output encoding by React, CSP, input sanitisation | Newman CSP tests; Playwright E2E |
| 7 | Client tampers with price, tax or user id in a booking | A04 Insecure Design | Server-side calculation of price and tax, identity taken from the JWT | Newman booking tests; tax unit tests |
| 8 | Weak defaults and verbose errors reveal internals | A05 Security Misconfiguration | Helmet, controlled error handler, environment-based config | Newman unknown-route and header tests |
| 9 | Vulnerable or malicious dependency | A06 Vulnerable Components | `npm audit` gate in CI, SonarQube analysis, lockfiles with `npm ci` | CI pipeline run |
| 10 | Brute-force login or booking spam | A07 Identification and Authentication Failures | Rate limiting, password-strength validation, generic login errors | Newman rate-limit tests (HTTP 429) |
| 11 | Insecure code merged unnoticed | A08 Software and Data Integrity Failures | Pull-request checks, failing pipeline, SonarQube quality gate | CI pipeline run |
| 12 | Attack or misuse goes undetected | A09 Logging and Monitoring Failures | Cloud logging of security-relevant events | Logging screenshots (Section 12) |
| 13 | Secrets leaked through the repository or CI logs | A02 / A05 | GitHub repository secrets, git-ignored `.env`, masked logs | Repository review; workflow file contains no literals |
| 14 | **[Threat addressed by extra feature 1]** | **[TEAMMATE]** | **[TEAMMATE]** | **[TEAMMATE]** |
| 15 | **[Threat addressed by extra feature 2]** | **[TEAMMATE]** | **[TEAMMATE]** | **[TEAMMATE]** |

**Residual risks:** payments are simulated, the development certificate is self-signed, rate-limit counters are held in memory (they reset on restart and are not shared across instances), and the JWT is not revocable before expiry.

---

## 9. Testing

| Layer | Tool | Location | Run with |
|---|---|---|---|
| Backend unit | Jest | `backend/` | `npm run test:unit` |
| Backend integration | Postman + Newman | `backend/postman/` | `npm run test:api` / `npm run test:api:report` |
| Frontend unit | Jest + React Testing Library | `frontend/src/` | `npm test` |
| Frontend integration (E2E) | Playwright | `frontend/e2e/` | `npx playwright test` |

### 9.1 Backend unit tests

Unit tests cover isolated logic without a running server. Files are in `backend/tests/unit/`:

| File | What it checks |
|---|---|
| `hashPassword.test.js` | bcrypt hashing format, salting (same password gives different hashes), correct and incorrect password comparison |
| `generateToken.test.js` | JWT contains the user id and role, expires after one day, is rejected with the wrong secret or if tampered with |
| `sanitize.test.js` | HTML and script tags are stripped from input, whitespace is trimmed, non-string values pass through unchanged |

**[Add further files here as more tests are written, for example the authorisation middleware and the tax calculation.]**

### 9.2 Newman integration tests

The collection is `backend/postman/HustleHub-Part2.postman_collection.json` with 104 requests and more than 200 assertions, with the local environment in `backend/postman/HustleHub.local.postman_environment.json`.

| Test Area | Coverage |
|---|---|
| Health and setup | API availability |
| Authentication | Registration, login, invalid credentials, privilege-escalation attempts |
| Gig management | CRUD, validation, sanitisation, ownership |
| Gig browsing | Available gigs, category filtering, role restrictions |
| Bookings | Creation, confirmation, authorised access |
| Transactions | Record creation, visibility rules, read-only access |
| Income | Totals and unauthorised-access protection |
| Security and RBAC | Invalid tokens, injection, malformed requests, headers, CSP |
| Rate limiting | Login and booking limits (HTTP 429) |
| Cleanup | Ownership rules and data integrity |

Run locally from `backend/`:

```bash
npm run test:api -- --insecure --env-var "adminPassword=YOUR_ADMIN_PASSWORD"
npm run test:api:report -- --insecure --env-var "adminPassword=YOUR_ADMIN_PASSWORD"
```

`--insecure` is needed only because the local certificate is self-signed. Restart the backend before a full run because rate-limit counters are held in memory. Never commit or screenshot real credentials. The HTML report is written to `docs/newman/newman-report.html`.

### 9.3 Frontend unit tests

React Testing Library tests check that key components render correctly (login and registration forms, gig list, booking form) and that validation messages and role-specific views behave as expected. **[List the actual test files.]**

### 9.4 Frontend integration tests (Playwright)

Playwright drives a real browser against the built frontend and a running backend. Scenarios include: register and log in, a freelancer creates a gig, a client browses and books it, and an unauthorised page redirects to login. The browser context ignores HTTPS certificate errors so that the self-signed development certificate is accepted in CI. **[List the actual specs.]**

---

## 10. CI/CD Pipeline

The workflow is defined in `.github/workflows/ci.yml` and runs on every push and pull request to `main` (and on manual dispatch).

| Job | What it does | Fails the pipeline when |
|---|---|---|
| **backend** | Installs dependencies with `npm ci`, runs `npm audit`, runs backend unit tests with coverage, generates the dev certificate, seeds the admin, starts the API against a MongoDB service container, runs Newman and generates the HTML report | An audit finding is high or critical, a unit test fails, the API does not start, or any Newman assertion fails |
| **frontend** | Installs dependencies, audits, runs frontend unit tests with coverage, builds the production bundle, starts the backend and the built frontend, runs Playwright tests | Audit, unit test, build or Playwright failure |
| **sonarqube** | Runs after both jobs, imports coverage, scans the code and waits for the quality gate | The quality gate fails |
| **docker-build** | Validates the Compose file and builds both images | A Dockerfile or Compose error |

How the requirements are met:

- **Pipeline fails when checks fail:** every step exits non-zero on failure, Newman returns a non-zero exit code on failed assertions, and `sonar.qualitygate.wait=true` turns a failed quality gate into a failed step. Downstream jobs use `needs`, so Sonar and Docker are skipped if tests fail. Enable **branch protection** on `main` and mark these jobs as required status checks so failing code cannot be merged.
- **Build backend and frontend:** the frontend is built with `npm run build`. The Node.js backend has no compile step, so its build is proven by the Docker image build in the `docker-build` job.
- **Secrets:** all sensitive values come from `${{ secrets.* }}` (see [Section 6.1](#61-github-repository-secrets)). The workflow requests only `contents: read` permission.
- **Artifacts:** the Newman report, Playwright report and coverage files are uploaded on every run (including failures) and are downloadable from the run summary.
- **Reproducibility:** `npm ci` and committed lockfiles ensure identical dependency versions in CI and locally.

---

## 11. SonarQube Static Analysis

SonarQube is configured through `sonar-project.properties` and runs in the `sonarqube` job. It analyses backend and frontend source, imports the Jest coverage reports, and enforces the Quality Gate.

### 11.1 Results

**[Fill this table from your first real analysis. Do not estimate: copy figures from the SonarQube dashboard.]**

| Metric | Before fixes | After fixes |
|---|---|---|
| Quality Gate | | |
| Bugs | | |
| Vulnerabilities | | |
| Security hotspots reviewed | | |
| Code smells | | |
| Coverage | | |
| Duplications | | |

### 11.2 Issues fixed

| Issue (rule) | Severity | File | Why it matters | Fix |
|---|---|---|---|---|
| **[e.g. rule key and description]** | | | | |

### 11.3 Issues accepted or marked safe

| Issue | Justification |
|---|---|
| **[e.g. a hotspot on the local-only self-signed certificate script]** | **[Explain why it is acceptable and why it is not used in production.]** |

---

## 12. Logging and Monitoring

**[TEAMMATE TO COMPLETE.]** Cover: the provider used, how the backend ships logs, which events are logged (failed logins, rate-limit hits, authorisation failures, booking and transaction creation, admin actions), the log fields recorded, and how sensitive data is kept out of logs (never passwords, tokens or full card-like data). Add the screenshots listed in [Section 13](#13-evidence).

---

## 13. Evidence

All screenshots are in `docs/screenshots/`. Never include secrets in screenshots.

| # | Evidence | File |
|---|---|---|
| 1 | Part 1 authentication screenshots | `docs/screenshots/` (existing) |
| 2 | Newman terminal summary | `12-newman-run-summary.png` |
| 3 | Newman HTML report | `13-newman-report-summary.png`, `14-newman-report-requests.png` |
| 4 | Booking rate-limit results | `15-newman-report-ratelimit-booking.png` |
| 5 | GitHub Actions run, all jobs green | `16-ci-pipeline-success.png` |
| 6 | A deliberately failing run (shows the pipeline blocks bad code) | `17-ci-pipeline-failure.png` |
| 7 | GitHub repository secrets page (names only) | `18-github-secrets.png` |
| 8 | SonarQube dashboard and quality gate | `19-sonarqube-dashboard.png` |
| 9 | SonarQube issues before and after fixes | `20-sonarqube-before.png`, `21-sonarqube-after.png` |
| 10 | Playwright report | `22-playwright-report.png` |
| 11 | Cloud logging dashboard with sample events | `23-logging-*.png` |
| 12 | `docker compose up` and running containers | `24-docker-*.png` |

---

## 14. Demonstration Videos

- **[Part 2 — Full-Stack Application and Frontend Testing](https://youtu.be/AIqp65AaJ7w)**
- **[Part 1 — Secure Backend Foundation](https://youtu.be/-_D20fWGG3Q)**
- **Part 3:** **[add link if a video is required]**

---

## 15. Limitations and Future Enhancements

- **Simulated payments:** no real payment gateway is integrated.
- **Development HTTPS:** the self-signed certificate is for local use only. Production needs a trusted certificate and hardened infrastructure.
- **In-memory rate limiting:** counters reset on restart and are not shared across instances. A shared store such as Redis would be required at scale.
- **Non-revocable JWTs:** refresh tokens and a revocation list would improve session control.
- **Deployment:** the pipeline builds and tests but does not deploy. A continuous-deployment stage with an environment-protected release is a natural next step.
- Further features: notifications, richer dashboards, financial reporting, accessibility improvements.

---

## 16. Repository Information

**GitHub Repository:** [INSY7314_Security](https://github.com/INSY7314-AppDev-Security/INSY7314_Security)

```text
.github/workflows/ci.yml     CI/CD pipeline
backend/                     Express API, unit tests, Postman collection
frontend/                    React app, unit tests, Playwright tests
docs/screenshots/            Evidence screenshots
docs/newman/                 Newman HTML report
sonar-project.properties     SonarQube configuration
docker-compose.yml           Runs backend and frontend together
```

**[Confirm this tree matches the merged repository.]**

### Team contributions (Part 3)

| Member | Contribution |
|---|---|
| **[Your name]** | GitHub Actions CI/CD pipeline, backend unit and Newman integration tests in CI, SonarQube integration, security review, README, evidence collection |
| **[Name]** | Cloud-based logging |
| **[Name]** | Two additional security features |
| **[Name]** | Tax logic |
| **[Name]** | Dockerfiles and Docker Compose |

---

## 17. AI Declaration

**[Edit this so it is true for your own use. State only what you actually did.]**

Generative AI (Claude, by Anthropic) was used during Part 3 to assist with: drafting the GitHub Actions workflow and SonarQube configuration, structuring the README, and drafting the threat-to-protection mapping. All AI-generated content was reviewed, tested in the project's pipeline, and adapted by the author. The author takes responsibility for the final submission. Test results, SonarQube figures and screenshots are from real runs of the project and were not generated by AI.

---

## 18. References

Replace or reformat these to the Harvard style required by your institution and confirm each link opens before submitting.

- Anthropic (2026) *Claude* [Large language model]. Available at: https://claude.ai (Accessed: 9 November 2026).
- GitHub (2026) *GitHub Actions documentation*. Available at: https://docs.github.com/en/actions (Accessed: 9 November 2026).
- Sonar (2026) *SonarQube documentation*. Available at: https://docs.sonarsource.com/ (Accessed: 9 November 2026).
- Microsoft (2026) *Playwright documentation*. Available at: https://playwright.dev/ (Accessed: 9 November 2026).
- Postman (2026) *Newman command-line companion for Postman*. Available at: https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/ (Accessed: 9 November 2026).
- OWASP Foundation (2021) *OWASP Top 10:2021*. Available at: https://owasp.org/Top10/ (Accessed: 9 November 2026).
- Express (2026) *Production best practices: security*. Available at: https://expressjs.com/en/advanced/best-practice-security.html (Accessed: 9 November 2026).
- Helmet (2026) *Helmet.js documentation*. Available at: https://helmetjs.github.io/ (Accessed: 9 November 2026).
- Jest (2026) *Jest documentation*. Available at: https://jestjs.io/ (Accessed: 9 November 2026).
- Docker (2026) *Docker Compose documentation*. Available at: https://docs.docker.com/compose/ (Accessed: 9 November 2026).