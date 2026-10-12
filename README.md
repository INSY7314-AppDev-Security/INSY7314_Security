# HustleHub+ — Secure Full-Stack Freelance Marketplace

## INSY7314 | Application Development Security POE

HustleHub+ is a secure freelance marketplace developed for the Application Development Security Portfolio of Evidence (POE). The platform connects clients with freelancers, allowing freelancers to advertise their services while clients browse gigs and make bookings.

The project progresses from a secure backend prototype in Part 1 to a full-stack MERN application in Part 2, integrating a React frontend, Node.js and Express REST API, and MongoDB database.

**Security is central to the application.** Implemented controls include bcrypt password hashing, JWT authentication, role-based access control (RBAC), input validation and sanitisation, resource ownership checks, rate limiting, security headers, Content Security Policy (CSP), and controlled error handling.

Part 2 introduces gig management, booking creation, transaction recording, and freelancer income tracking. The backend is tested using Postman and Newman, while frontend testing is demonstrated in the Part 2 demonstration video.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features and User Roles](#2-features-and-user-roles)
3. [Technologies Used](#3-technologies-used)
4. [System Architecture](#4-system-architecture)
5. [Getting Started](#5-getting-started)
6. [Environment Configuration](#6-environment-configuration)
7. [Security Implementation](#7-security-implementation)
8. [API Testing with Postman and Newman](#8-api-testing-with-postman-and-newman)
9. [Frontend Testing](#9-frontend-testing)
10. [Testing Evidence](#10-testing-evidence)
11. [Demonstration Video](#11-demonstration-video)
12. [Limitations and Future Enhancements](#12-limitations-and-future-enhancements)
13. [Repository Information](#13-repository-information)

---

## 1. Project Overview

HustleHub+ provides an online marketplace where freelancers can advertise services and clients can discover and book available gigs.

The project was developed in two stages:

**Part 1 — Secure Backend Foundation**
- User registration and login.
- Secure password hashing using bcrypt.
- JWT generation and verification.
- Protected API endpoints.
- Input validation and error handling.
- HTTPS configuration for local development.
- Initial Postman testing.

**Part 2 — Full-Stack Marketplace**
- React frontend and MongoDB persistence.
- Gig creation, viewing, updating, and deletion.
- Gig browsing and category filtering.
- Booking creation and simulated confirmation.
- Automatic transaction record creation.
- Freelancer booking visibility and income tracking.
- Expanded security controls and role-based permissions.
- Automated API testing using Postman and Newman.
- Frontend testing demonstrated in the project video.

The application combines practical marketplace functionality with security measures designed to protect user accounts, restrict access to private information, and maintain the integrity of booking-related data.

## 2. Features and User Roles

### 2.1 Application Features

| Feature | Description |
|---|---|
| Authentication | Registration, login, bcrypt password hashing, and JWT authentication. |
| Gig management | Freelancers create, view, update, and delete their own listings, subject to authorisation rules. |
| Gig browsing | Clients browse available services and filter listings by category. |
| Bookings | Clients create bookings and receive simulated confirmations. |
| Transactions | Successful bookings generate associated transaction records. |
| Income tracking | Freelancers view income totals associated with their bookings. |
| Security | Validation, sanitisation, RBAC, ownership checks, rate limiting, security headers, and controlled error responses. |
| Testing | Postman API collection, Newman execution and reporting, and frontend testing demonstrated in the video. |

### 2.2 User Roles

**Client**
- Register and log in.
- Browse available gigs and view service information.
- Create bookings.
- Access their own booking information and permitted transaction records.

**Freelancer**
- Register and log in.
- Create and manage their own gig listings.
- View permitted booking information.
- Track income associated with their bookings.

**Administrator**
- Access designated administrative functionality.
- Perform authorised administrative operations.
- Use an account created through the backend administrator seeding process.

Role permissions are enforced by the backend. Hiding a button in the frontend does not replace server-side authorisation checks.

---

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| MongoDB | Persistent database storage |
| Express.js | Backend REST API |
| React | Frontend user interface |
| Node.js | Backend JavaScript runtime |
| bcrypt | Password hashing |
| JSON Web Tokens (JWT) | Authentication |
| express-validator | Request validation |
| Helmet | HTTP security headers |
| Content Security Policy (CSP) | Restricts permitted content sources |
| Rate-limiting middleware | Limits repeated requests to sensitive endpoints |
| CORS | Controls permitted cross-origin browser requests |
| dotenv | Environment configuration |
| Postman | API testing |
| Newman | Command-line execution of Postman collections |
| Newman HTML reporting | Readable API testing reports |
| Git and GitHub | Version control and collaboration |
| npm | Dependency management |

---

## 4. System Architecture

HustleHub+ uses the MERN stack, separating the user interface, API, and database.

```text
┌──────────────────────────────┐
│        React Frontend        │
│                              │
│ Authentication               │
│ Gig Browsing and Management  │
│ Bookings and Income          │
└──────────────┬───────────────┘
               │
               │ HTTPS / API Requests
               ▼
┌──────────────────────────────┐
│    Node.js / Express API     │
│                              │
│ Authentication and JWT       │
│ Role-Based Authorisation     │
│ Validation and Sanitisation  │
│ Marketplace Business Logic   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│           MongoDB            │
│                              │
│ Users, Gigs, Bookings,       │
│ and Transaction Records      │
└──────────────────────────────┘

       Postman / Newman
               │
               ▼
         Express REST API
```

The backend processes requests through the relevant security middleware, validates incoming data, verifies authentication and permissions, and performs authorised database operations.

For example, a freelancer updating a gig must be authenticated, have the appropriate role, and own the gig. A valid JWT alone does not grant unrestricted access to marketplace resources.

---

## 5. Getting Started

### 5.1 Prerequisites

Install the following:

- [Node.js](https://nodejs.org/) and npm
- [MongoDB](https://www.mongodb.com/try/download/community) or a configured MongoDB instance
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/downloads/) for API testing

Newman must also be available through the project's configured dependencies or installation.

Verify your installations:

```bash
node --version
npm --version
git --version
```

### 5.2 Clone the Repository

```bash
git clone https://github.com/INSY7314-AppDev-Security/INSY7314_Security.git
cd INSY7314_Security
```

### 5.3 Install Backend Dependencies

```bash
cd backend
npm install
```

### 5.4 Configure the Environment

Create a local `.env` file in the `backend/` directory, using `.env.example` as a reference.

Configure the MongoDB connection, JWT secret, server settings, and administrator credentials according to the variable names expected by the application.

### 5.5 Generate the Development Certificate

If required by the current backend configuration, run:

```bash
node generate-cert.js
```

This generates the local TLS certificate and private key used for development HTTPS.

### 5.6 Seed the Administrator

Run the configured administrator seeding script:

```bash
npm run seed:admin
```

Use the administrator credentials configured in the backend environment. Never commit real passwords, database credentials, JWT secrets, or private keys to GitHub.

### 5.7 Start the Backend

From the `backend/` directory:

```bash
npm start
```

The Part 1 development server used `https://localhost:5000`. Confirm the actual URL and port configured in the current implementation.

### 5.8 Start the Frontend

Open a second terminal and navigate to the React frontend directory.

If the directory is named `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by the development server. If the frontend requires an API base URL, configure it using the environment-variable convention supported by the project.

**Note:** The frontend directory name and available npm scripts should be checked against the submitted repository if they differ from these examples.

---

## 6. Environment Configuration

The application uses environment variables to separate configuration and sensitive information from source code.

| Configuration | Purpose |
|---|---|
| Server port | Defines the API listening port |
| JWT secret | Signs and verifies authentication tokens |
| MongoDB connection string | Connects the backend to the database |
| Environment mode | Identifies the development or production environment |
| Administrator credentials | Supports administrator account setup |
| Frontend origin | Configures permitted cross-origin requests, where applicable |

Follow these security practices:

- Keep `.env` files out of version control.
- Use strong, unique secrets and passwords.
- Never expose backend secrets in frontend code.
- Keep the MongoDB instance accessible only to authorised components.
- Use a separate test database where possible.

---

## 7. Security Implementation

Security controls are applied across authentication, request processing, resource access, and marketplace operations.

| Security Control | Purpose |
|---|---|
| bcrypt password hashing | Avoids storing passwords in plain text. |
| JWT authentication | Verifies the identity of users accessing protected endpoints. |
| Role-based access control | Restricts operations according to client, freelancer, and administrator permissions. |
| Resource ownership checks | Prevents users from modifying or viewing resources belonging to other users without permission. |
| Input validation | Rejects invalid or incomplete request data. |
| Input sanitisation | Helps mitigate malicious input, including scripting and injection attempts. |
| Mass-assignment protection | Restricts which fields users may create or modify. |
| Rate limiting | Reduces repeated requests to sensitive endpoints. |
| Helmet and CSP | Configure browser-facing security headers and content-loading restrictions. |
| HTTPS | Encrypts communication in transit. |
| CORS | Restricts permitted browser origins. |
| Controlled error handling | Reduces exposure of internal stack traces and file paths. |
| Environment variables | Keep credentials and secrets separate from committed source code. |
| Server-controlled booking data | Prevents the frontend from being trusted as the authority for booking prices and user identities. |

### Important Security Decisions

**Authentication and authorisation:** Authentication identifies the user, while authorisation determines what that user may do. Both are required for protected operations.

**Ownership enforcement:** Resource identifiers supplied in requests cannot be treated as proof of ownership. The backend must verify permissions before allowing access or modification.

**Booking integrity:** Booking prices and associated user identities are derived or verified by the backend rather than trusted solely from frontend input.

**Rate limiting:** The documented local configuration includes a login limit of five attempts per IP address within 15 minutes and a booking limit of ten requests according to the configured limiter. Exceeding a limit should produce an HTTP `429 Too Many Requests` response.

**HTTPS:** The local development environment uses a self-signed certificate. Production deployment would require an appropriate trusted certificate and secure infrastructure configuration.

---

## 8. API Testing with Postman and Newman

The backend API is tested using Postman and Newman to evaluate both expected functionality and security enforcement.

### 8.1 Test Collection

The expanded Part 2 collection is located at:

`backend/postman/HustleHub-Part2.postman_collection.json`

The associated local environment file is:

`backend/postman/HustleHub.local.postman_environment.json`

The collection contains **104 requests and more than 200 assertions**, covering the documented Part 2 API functionality.

### 8.2 Test Coverage

| Test Area | Coverage |
|---|---|
| Health and setup | API availability and test-run setup |
| Authentication | Registration, login, invalid credentials, and privilege-escalation attempts |
| Gig management | CRUD operations, validation, sanitisation, and ownership enforcement |
| Gig browsing | Available gigs, category filtering, and role restrictions |
| Bookings | Booking creation, confirmation, and authorised access |
| Transactions | Record creation, visibility restrictions, and read-only access rules |
| Income | Income totals and protection against unauthorised access |
| Security and RBAC | Invalid tokens, injection scenarios, malformed requests, security headers, and CSP |
| Rate limiting | Login and booking limits, including HTTP 429 responses |
| Deletion and cleanup | Ownership rules and data integrity |

### 8.3 Positive and Negative Testing

The collection tests successful operations alongside deliberately invalid or unauthorised requests, including:

- Successful registration and login.
- Duplicate email addresses and weak passwords.
- Incorrect credentials and invalid JWTs.
- Attempts to register with administrator privileges.
- Attempts to modify another user's gig.
- Attempts to manipulate protected request fields.
- Malicious input and injection scenarios.
- Unauthorised transaction and income access.
- Requests that exceed configured rate limits.
- Unknown routes and controlled error responses.

Testing both positive and negative scenarios helps establish whether security controls are enforced rather than merely present in the code.

### 8.4 Running the Collection in Postman

1. Start the backend and ensure MongoDB is accessible.
2. Open Postman and select **Import**.
3. Import the collection and local environment JSON files.
4. Select the **HustleHub Local** environment.
5. Configure the administrator password using the local environment setting.
6. If necessary, disable SSL certificate verification only for the intended local self-signed certificate setup.
7. Run the collection and review the assertion results.

### 8.5 Running Newman

From the `backend/` directory, run:

```bash
npm run test:api
```

To execute the tests and generate the HTML report:

```bash
npm run test:api:report
```

The report location depends on the output path configured in the project's npm script. The documented location is `docs/newman/newman-report.html`.

If the test suite requires the administrator password to be supplied at execution time, use the configured script's supported environment-variable mechanism. For example:

```bash
npm run test:api -- --env-var "adminPassword=YOUR_ADMIN_PASSWORD"
```

Replace the placeholder with the local administrator password. Do not commit actual credentials or include them in screenshots.

**Testing considerations:**
- Restart the backend before a full test run when necessary, particularly because the documented rate limiters maintain in-memory counters.
- The collection uses unique run identifiers to avoid repeated registration conflicts.
- Test users, bookings, and transactions may remain in MongoDB after execution.
- Use a separate test database if demonstration data needs to remain unchanged.

---

## 9. Frontend Testing

Frontend testing complements the backend API tests by evaluating the React interface, component rendering, and user interactions.

**Frontend testing was demonstrated in the Part 2 demonstration video.** Refer to the video for the practical demonstration of the frontend and its interactions.

The frontend testing requirement focuses on checking that relevant components render correctly and that users can interact with the interface as intended.

Frontend testing and backend security testing serve different purposes. Even if an action is hidden or unavailable in the interface, the backend must independently reject unauthorised requests.

---

## 10. Testing Evidence

The repository includes supporting evidence for the application's authentication and security testing.

### 10.1 Part 1 Evidence

The original screenshots are stored in `docs/screenshots/` and include evidence of:

- Successful registration and login.
- Duplicate registration and incorrect password rejection.
- Protected endpoint access and invalid-token rejection.
- Weak password validation.
- Postman collection execution.

### 10.2 Part 2 Newman Evidence

The following images document the expanded API testing process.

**Newman terminal summary**

![Newman terminal execution summary](docs/screenshots/12-newman-run-summary.png)

**Newman HTML report summary**

![Newman HTML report summary](docs/screenshots/13-newman-report-summary.png)

**Requests grouped by collection folder**

![Newman report requests](docs/screenshots/14-newman-report-requests.png)

**Booking rate-limiting evidence**

![Newman booking rate-limiting results](docs/screenshots/15-newman-report-ratelimit-booking.png)

The corresponding report is stored under `docs/newman/`, according to the configured report output path.

The demonstration video provides additional evidence of the full-stack application and frontend testing.

---

## 11. Demonstration Video

The demonstration video provides a practical walkthrough of HustleHub+, including the full-stack application and frontend testing.

### Part 2 — Full-Stack Application and Frontend Testing

**[Watch the HustleHub+ Part 2 Demonstration on YouTube](https://youtu.be/AIqp65AaJ7w)**

The video serves as the primary demonstration of the expanded application and its frontend functionality.

### Part 1 — Secure Backend Foundation

**[Watch the Part 1 Backend Demonstration](https://youtu.be/-_D20fWGG3Q)**

The original demonstration covers the backend authentication foundation, including HTTPS, registration, login, JWT generation, protected endpoints, and rejection of invalid or missing tokens.

---

## 12. Limitations and Future Enhancements

Although HustleHub+ supports the core freelance marketplace workflow, several enhancements could be introduced in future development.

**Simulated payments:** Booking confirmations and transaction records simulate marketplace activity; the application does not integrate a real payment gateway.

**Development HTTPS:** The self-signed certificate is intended for local development, not production deployment.

**Future enhancements:**
- Real payment gateway integration.
- Notifications for bookings and status changes.
- Expanded client, freelancer, and administrator dashboards.
- More detailed financial reporting.
- Additional frontend and integration tests.
- Continuous integration and continuous deployment (CI/CD).
- Production deployment, monitoring, and infrastructure hardening.
- Further accessibility and usability improvements.

These are potential improvements rather than claims about existing functionality.

---

## 13. Repository Information

**GitHub Repository:** [INSY7314_Security](https://github.com/INSY7314-AppDev-Security/INSY7314_Security)

The repository contains the project source code, frontend and backend applications, configuration examples, Postman collection, Newman testing resources, screenshots, and supporting documentation.

### Part 1 Deliverables
- Secure backend authentication foundation.
- Password hashing and JWT utilities.
- Validation, authentication, and error-handling middleware.
- HTTPS certificate-generation script.
- Initial Postman collection and testing evidence.
- Project documentation.

### Part 2 Deliverables
- React frontend and Express backend.
- MongoDB integration.
- Gig management and browsing.
- Booking and transaction functionality.
- Freelancer income tracking.
- Authentication, RBAC, and additional security controls.
- Expanded Postman collection and Newman execution.
- Newman HTML report and testing screenshots.
- Frontend testing demonstrated in the video.
- Updated project documentation and demonstration video.

---

## Conclusion

HustleHub+ demonstrates the development of a full-stack MERN freelance marketplace with an emphasis on secure application development. The application integrates authentication, role-based permissions, gig management, bookings, transaction recording, and freelancer income tracking.

Security controls are supported by a structured API testing suite executed through Postman and Newman, while frontend testing is demonstrated in the Part 2 video. Together, the application, testing resources, and demonstration provide evidence of the project's functionality and its approach to protecting users and marketplace data.
