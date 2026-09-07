# HustleHub+ — Secure Backend API

## INSY7314 / Application Development Security

HustleHub+ is a secure freelance marketplace platform being developed as part of the Application Development Security POE. The platform is designed to allow freelancers to advertise their services and allow clients to browse and book those services.

For Part 1, the focus is on establishing the secure backend foundations of the application. This includes user registration and authentication, secure password storage, JSON Web Token (JWT) authentication, input validation, HTTPS communication, protected API routes, and controlled error handling.

The Part 1 implementation uses Node.js and Express and stores users temporarily in memory. A persistent database will be introduced in a later stage of the project.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Part 1 Objectives](#part-1-objectives)
* [Intended Users](#intended-users)
* [Technologies Used](#technologies-used)
* [System Architecture](#system-architecture)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Environment Configuration](#environment-configuration)
* [HTTPS Configuration](#https-configuration)
* [Running the Application](#running-the-application)
* [API Endpoints](#api-endpoints)
* [Authentication Flow](#authentication-flow)
* [Security Implementation](#security-implementation)
* [Password Security](#password-security)
* [JWT Authentication](#jwt-authentication)
* [Input Validation](#input-validation)
* [HTTPS and Secure Communication](#https-and-secure-communication)
* [Error Handling](#error-handling)
* [Protected Routes](#protected-routes)
* [User Roles](#user-roles)
* [Testing](#testing)
* [Postman Test Scenarios](#postman-test-scenarios)
* [Testing Evidence](#testing-evidence)
* [Security Decisions and Rationale](#security-decisions-and-rationale)
* [Known Part 1 Limitations](#known-part-1-limitations)
* [Future Development](#future-development)
* [Conclusion](#conclusion)
* [Demonstration](#demonstration)

---

# Project Overview

HustleHub+ is intended to provide a secure online marketplace where:

* Freelancers can advertise their services.
* Clients can browse available services.
* Clients can book freelance services.
* User accounts can be securely authenticated.
* Different user roles can be identified by the system.

Because the application is intended to process account credentials and, in later versions, transactional and income-related information, security is treated as a core requirement of the application.

Part 1 establishes the secure backend foundation that later parts of the system can build upon.

---

# Part 1 Objectives

The main objectives of Part 1 are:

1. Develop a backend API using Node.js and Express.
2. Implement user registration.
3. Implement secure user login.
4. Store passwords using secure hashing rather than plain text.
5. Generate JWTs after successful authentication.
6. Protect API routes using JWT authentication.
7. Validate user input before processing it.
8. Run the API over HTTPS using a local TLS certificate.
9. Provide controlled error responses.
10. Test successful and unsuccessful API scenarios using Postman.

The implementation has been structured so that authentication, validation, middleware, routing, controllers, and utility functions are separated into different components.

---

# Intended Users

The final HustleHub+ system is intended to support three user roles:

### Client

Clients will use HustleHub+ to browse freelance services and book gigs.

### Freelancer

Freelancers will use HustleHub+ to advertise their services and manage their freelance activity.

### Administrator

An administrator role is planned for later stages of the system to support administrative functionality.

For Part 1, registration allows users to register as either a `client` or `freelancer`. The default role is `client`.

---

# Technologies Used

| Technology        | Purpose                                  |
| ----------------- | ---------------------------------------- |
| Node.js           | Backend JavaScript runtime               |
| Express.js        | Web application and REST API framework   |
| JavaScript        | Backend programming language             |
| bcrypt            | Secure password hashing                  |
| JSON Web Token    | Authentication and protected API access  |
| express-validator | Input validation                         |
| Helmet            | Security-related HTTP headers            |
| CORS              | Cross-origin request handling            |
| dotenv            | Environment variable management          |
| HTTPS             | Encrypted communication                  |
| selfsigned        | Local development certificate generation |
| Postman           | API testing                              |
| GitHub            | Source-code management and submission    |

---

# System Architecture

The Part 1 backend follows the backend portion of the MERN architecture.

The system can be represented as:

```text
                    ┌──────────────────────┐
                    │       Client         │
                    │   Postman / Future   │
                    │       React UI       │
                    └──────────┬───────────┘
                               │
                               │ HTTPS
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │      Node.js         │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │   Routes    │ │ Middleware  │ │ Controllers │
        │             │ │             │ │             │
        │ Auth Routes │ │ Validation  │ │ Register    │
        │             │ │ JWT Auth    │ │ Login       │
        │             │ │ Errors      │ │             │
        └─────────────┘ └─────────────┘ └──────┬──────┘
                                               │
                          ┌────────────────────┼────────────────────┐
                          │                    │                    │
                          ▼                    ▼                    ▼
                  ┌──────────────┐     ┌──────────────┐    ┌──────────────┐
                  │ User Store   │     │   bcrypt     │    │     JWT      │
                  │ In-Memory    │     │   Hashing    │    │ Generation   │
                  └──────────────┘     └──────────────┘    └──────────────┘
```

The MERN architecture diagram supplied with the project can be found at:

`docs/MERN/MERN.jpg`

### Request Flow

A typical registration request follows this process:

```text
Client
  ↓
HTTPS Request
  ↓
Express Server
  ↓
Authentication Route
  ↓
Input Validation
  ↓
Validation Result
  ↓
Registration Controller
  ↓
Check Existing User
  ↓
bcrypt Password Hashing
  ↓
In-Memory User Store
  ↓
Safe JSON Response
```

A login request follows:

```text
Client
  ↓
HTTPS Request
  ↓
Login Route
  ↓
Input Validation
  ↓
Login Controller
  ↓
Find User
  ↓
bcrypt Password Comparison
  ↓
JWT Generation
  ↓
JWT + User Information
  ↓
Client
```

---

# Project Structure

```text
INSY7314_Security-main/
│
├── docs/
│   ├── MERN/
│   │   └── MERN.jpg
│   │
│   └── screenshots/
│       ├── 01-register-success.png
│       ├── 02-register-duplicate-email.png
│       ├── 03-login-success.png
│       ├── 04-login-wrong-password.png
│       ├── 05-protected-route-success.png
│       ├── 06-protected-route-invalid-token.png
│       ├── 07-postman-collection-run.png
│       ├── 08-postman-login-success.png
│       ├── 09-postman-register-weak-password.png
│       ├── 10-postman-login-wrong-password.png
│       └── 11-postman-get-profile.png
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── validators.js
│   │   │
│   │   ├── models/
│   │   │   └── userStore.js
│   │   │
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   │
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── hashPassword.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── generate-cert.js
│   ├── HustleHub-Part1.postman_collection.json
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

### Separation of Concerns

The backend uses a modular structure:

* **Routes** define the API endpoints.
* **Controllers** contain the authentication logic.
* **Middleware** performs validation, authentication, and error handling.
* **Models** provide the temporary user storage functionality.
* **Utilities** contain reusable password hashing and JWT generation functions.
* **Server.js** configures the Express application, middleware, routes, HTTPS server, and global error handling.

This separation makes the application easier to understand, maintain, test, and extend.

---

# Installation

## Prerequisites

The following software is required:

* Node.js
* npm
* Postman
* Git

Node.js and npm should be installed and available through the command line.

Verify the installation with:

```bash
node --version
npm --version
```

---

## Clone the Repository

Clone the GitHub repository:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Navigate into the project:

```bash
cd INSY7314_Security-main
```

Then navigate to the backend:

```bash
cd backend
```

---

# Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

The project dependencies include:

* Express
* bcrypt
* jsonwebtoken
* express-validator
* helmet
* cors
* dotenv
* selfsigned

---

# Environment Configuration

Create a `.env` file inside the `backend` directory.

The `.env` file should contain:

```env
PORT=5000
JWT_SECRET=your_long_random_secret_key
NODE_ENV=development
```

### Environment Variable Explanation

| Variable     | Purpose                                 |
| ------------ | --------------------------------------- |
| `PORT`       | Defines the port used by the API        |
| `JWT_SECRET` | Secret key used to sign and verify JWTs |
| `NODE_ENV`   | Defines the current environment         |

The actual JWT secret should **not** be committed to GitHub.

The repository therefore provides `.env.example` instead of storing sensitive secret values.

---

# HTTPS Configuration

The application is configured to run over HTTPS rather than plain HTTP.

A local self-signed certificate can be generated using:

```bash
node generate-cert.js
```

This creates:

```text
backend/certs/key.pem
backend/certs/cert.pem
```

The server checks that both files exist before starting.

If the certificate or private key is missing, the application stops rather than falling back to unencrypted HTTP.

This decision was made because authentication requests contain sensitive information such as passwords and authentication tokens.

### Development Certificate

The certificate generated for Part 1 is a **self-signed development certificate** for local testing.

It is not intended to replace a trusted certificate authority certificate in a production environment.

---

# Running the Application

From the `backend` directory:

```bash
npm start
```

The server should start on:

```text
https://localhost:5000
```

A successful startup should display a message similar to:

```text
Server is running securely on https://localhost:5000
```

The root endpoint can be accessed at:

```text
GET https://localhost:5000/
```

A successful response is:

```json
{
    "success": true,
    "message": "HustleHub+ API is running"
}
```

---

# API Endpoints

All authentication endpoints use the following base path:

```text
/api/auth
```

## Register

```http
POST /api/auth/register
```

Example request:

```json
{
    "name": "John Smith",
    "email": "john@example.com",
    "password": "Password123",
    "role": "freelancer"
}
```

Successful response:

```json
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "id": "...",
        "name": "John Smith",
        "email": "john@example.com",
        "role": "freelancer"
    }
}
```

The password is intentionally excluded from the response.

---

## Login

```http
POST /api/auth/login
```

Example request:

```json
{
    "email": "john@example.com",
    "password": "Password123"
}
```

Successful login returns a JWT:

```json
{
    "success": true,
    "message": "Login successful",
    "token": "...",
    "user": {
        "id": "...",
        "name": "John Smith",
        "email": "john@example.com",
        "role": "freelancer"
    }
}
```

---

## Get Current User

```http
GET /api/auth/me
```

This is a protected endpoint and requires a valid JWT.

The request must contain:

```http
Authorization: Bearer <JWT_TOKEN>
```

A valid token produces a successful response containing the authenticated user's ID and role.

---

# Authentication Flow

HustleHub+ uses JWT-based authentication.

### Registration

1. The user submits their name, email, password and optional role.
2. Input validation is performed.
3. The system checks whether the email already exists.
4. The password is hashed using bcrypt.
5. Only the hashed password is stored.
6. The user is added to the temporary in-memory user store.
7. A safe response is returned without the password.

### Login

1. The user submits their email and password.
2. Input validation is performed.
3. The system searches for the email.
4. The submitted password is compared with the stored bcrypt hash.
5. If the credentials are valid, a JWT is generated.
6. The JWT contains the user's ID and role.
7. The JWT is returned to the client.

### Accessing Protected Routes

1. The client sends the JWT using the `Authorization` header.
2. The authentication middleware extracts the token.
3. `jsonwebtoken` verifies the token using `JWT_SECRET`.
4. If valid, the user's ID and role are attached to `req.user`.
5. The request continues to the protected endpoint.
6. If the token is missing or invalid, the request is rejected with HTTP 401.

---

# Security Implementation

Security has been incorporated throughout the Part 1 backend.

The main controls are:

* Password hashing with bcrypt.
* JWT-based authentication.
* Protected API routes.
* Input validation.
* Email normalisation.
* Role validation.
* HTTPS communication.
* Helmet security headers.
* CORS configuration.
* Controlled error responses.
* Environment variables for secrets.
* No password returned in API responses.
* Token expiration.
* Duplicate account prevention.

---

# Password Security

Passwords are never stored in plain text.

The application uses the `bcrypt` package to hash passwords.

The implementation uses:

```javascript
const SALT_ROUNDS = 10;
```

During registration:

```text
Plain password
      ↓
bcrypt.hash()
      ↓
Password hash
      ↓
Stored in user object
```

During login:

```text
Entered password
      ↓
bcrypt.compare()
      ↓
Stored password hash
      ↓
Match / no match
```

This means that the original password cannot simply be retrieved from the stored value.

The password is also never included in the registration or login response.

---

# JWT Authentication

JSON Web Tokens are used to authenticate subsequent requests.

The JWT contains:

```javascript
{
    id: user.id,
    role: user.role
}
```

The token is signed using the `JWT_SECRET` environment variable.

Tokens expire after:

```text
1 day
```

The expiry limits the period during which a stolen token could be used.

The protected `/api/auth/me` route uses middleware to verify the token before allowing access.

---

# Input Validation

Input validation is implemented using `express-validator`.

## Registration Validation

The following checks are applied:

### Name

* Required.
* Trimmed.
* Between 2 and 50 characters.

### Email

* Required.
* Must use a valid email format.
* Normalised before being processed.

### Password

The password must:

* Be at least 8 characters.
* Contain an uppercase letter.
* Contain a lowercase letter.
* Contain a number.

### Role

If supplied, the role must be either:

```text
client
```

or:

```text
freelancer
```

This prevents unexpected role values from being accepted.

---

# Login Validation

Login requires:

* A valid email address.
* A password.

Password-strength requirements are not re-applied during login because the purpose of the login operation is to compare the submitted password with the already stored password hash.

---

# Validation Error Responses

Invalid requests return HTTP 400 with a structured response.

Example:

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        {
            "field": "password",
            "message": "Password must be at least 8 characters long"
        }
    ]
}
```

This provides useful feedback while keeping the response structured and predictable.

---

# HTTPS and Secure Communication

The backend is configured to use HTTPS.

Instead of:

```text
http://localhost:5000
```

the API runs using:

```text
https://localhost:5000
```

HTTPS is important because authentication requests contain sensitive information.

Without encryption, network traffic could potentially expose credentials or authentication tokens.

For Part 1, a locally generated self-signed certificate is used for development and demonstration.

The application deliberately does not silently fall back to HTTP if the certificate is missing.

---

# Error Handling

The application uses centralised error handling.

Two pieces of middleware are responsible for this:

```text
notFound
errorHandler
```

### 404 Handling

Requests to unknown routes return a controlled JSON response rather than an Express HTML error page.

Example:

```json
{
    "success": false,
    "message": "Route not found: GET /api/unknown"
}
```

### Global Error Handling

Unexpected server errors are logged internally using:

```javascript
console.error('ERROR:', err);
```

However, the client receives a safe generic response for HTTP 500 errors.

The server therefore retains useful debugging information without exposing:

* Stack traces.
* Internal file paths.
* Configuration information.
* Other implementation details.

This reduces the amount of information that can be gathered by an attacker through error responses.

---

# Protected Routes

The `/api/auth/me` endpoint is protected by the JWT authentication middleware.

A request without a token returns:

```http
401 Unauthorized
```

with:

```json
{
    "success": false,
    "message": "Not authorized, no token provided"
}
```

An invalid or malformed token also returns HTTP 401.

A valid JWT allows the request to continue.

This demonstrates that authentication is being enforced beyond the login endpoint.

---

# User Roles

Part 1 supports two registration roles:

```text
client
freelancer
```

If a role is not provided, the system defaults to:

```text
client
```

The user's role is also included in the JWT payload.

This establishes the foundation for role-based access control in later parts of HustleHub+.

An administrator role is part of the overall system requirements but is not enabled through the Part 1 registration validation.

---

# Testing

The API was tested using Postman.

The project includes the following Postman collection:

```text
backend/HustleHub-Part1.postman_collection.json
```

The collection contains both successful and invalid scenarios to demonstrate that the API does not only work under ideal conditions.

Testing covers:

* Successful registration.
* Duplicate registration.
* Weak passwords.
* Invalid email formats.
* Invalid roles.
* Missing registration fields.
* Successful login.
* Incorrect passwords.
* Unknown email addresses.
* Missing login fields.
* Valid JWT access.
* Missing JWT.
* Invalid JWT.

---

# Postman Test Scenarios

| Test                        | Expected Result |
| --------------------------- | --------------- |
| Register - Success          | HTTP 201        |
| Register - Duplicate Email  | HTTP 409        |
| Register - Weak Password    | HTTP 400        |
| Register - Invalid Email    | HTTP 400        |
| Register - Invalid Role     | HTTP 400        |
| Register - Missing Name     | HTTP 400        |
| Login - Success             | HTTP 200        |
| Login - Wrong Password      | HTTP 401        |
| Login - Unknown Email       | HTTP 401        |
| Login - Missing Password    | HTTP 400        |
| Get Profile - Valid Token   | HTTP 200        |
| Get Profile - No Token      | HTTP 401        |
| Get Profile - Invalid Token | HTTP 401        |

Testing both positive and negative cases helps demonstrate that validation and security controls are actually being enforced.

---

# Testing Evidence

Screenshots of API testing are stored in:

```text
docs/screenshots/
```

The evidence includes:

* Successful registration.
* Duplicate email rejection.
* Successful login.
* Incorrect password rejection.
* Successful protected-route access.
* Invalid-token rejection.
* Weak password rejection.
* Postman collection execution.
* Additional login and profile tests.

The Postman collection can be imported directly into Postman for reproduction of the tests.

---

# Security Decisions and Rationale

## bcrypt Password Hashing

Passwords are hashed rather than stored in plain text.

**Reason:** If the user store were compromised, attackers should not immediately obtain the original passwords.

---

## JWT Authentication

JWTs are used to identify authenticated users after login.

**Reason:** JWT authentication allows protected endpoints to verify a user's identity without requiring the user to submit their password with every request.

The JWT also contains the user's role, establishing the foundation for role-based authorisation.

---

## JWT Expiration

Tokens expire after one day.

**Reason:** Limiting token lifetime reduces the period during which a compromised token can be used.

---

## HTTPS

The backend requires HTTPS and a TLS certificate.

**Reason:** Credentials and tokens must be protected while travelling between the client and server.

---

## Input Validation

All important registration and login inputs are validated before controller processing.

**Reason:** Validation prevents malformed, unexpected, or unacceptable data from entering the application's processing logic.

---

## Email Normalisation

Email addresses are normalised before being stored or checked.

**Reason:** This helps maintain consistent email values and reduces problems caused by formatting differences.

---

## Controlled Error Messages

The server logs detailed errors internally but provides safe responses to clients.

**Reason:** Detailed server errors can expose information about the application's internal implementation.

---

## Environment Variables

The JWT signing secret is stored using an environment variable.

**Reason:** Secrets should not be hard-coded into the application's source code or committed to the repository.

---

## Helmet

Helmet is enabled globally.

```javascript
app.use(helmet());
```

**Reason:** Helmet adds security-related HTTP headers that help reduce exposure to common web-based attacks.

---

# Known Part 1 Limitations

The following limitations are intentional because Part 1 focuses on establishing the secure backend foundation.

### In-Memory User Storage

Users are currently stored in an in-memory JavaScript array.

This means that registered users are lost when the server restarts.

This is acceptable for Part 1 because the assessment allows local in-memory or file-based storage at this stage.

A persistent database will be introduced during later development.

### No Frontend

Part 1 focuses on the backend API.

The React frontend is part of the later full-stack implementation.

### No Real Payments

Payment functionality is not implemented in Part 1.

### Limited Authorisation

The user's role is included in the JWT, establishing the foundation for RBAC. Full role-based access control will be expanded in later development.

---

# Future Development

The secure Part 1 backend provides the foundation for the later HustleHub+ system.

Future development will include:

* Persistent database storage.
* React frontend.
* Freelancer gig management.
* Client gig browsing.
* Booking functionality.
* Transaction records.
* Income tracking.
* Tax estimation.
* Financial dashboards.
* Expanded role-based access control.
* Additional security controls.
* Automated testing.
* DevSecOps practices.
* CI/CD.
* Docker containerisation.
* Logging and monitoring.

---

# Conclusion

Part 1 establishes a secure backend foundation for HustleHub+.

The implementation demonstrates:

* Node.js and Express backend development.
* Modular code structure.
* Secure password hashing using bcrypt.
* JWT-based authentication.
* Protected API routes.
* Input validation.
* HTTPS communication.
* Security headers using Helmet.
* Controlled error handling.
* Environment-based secret configuration.
* Positive and negative API testing using Postman.

The architecture has been designed so that these security foundations can be extended as the HustleHub+ marketplace develops in later parts of the POE.

---

# Demonstration

A demonstration video accompanies this submission.

The video demonstrates the Part 1 backend running over HTTPS and shows:

1. The API starting successfully.
2. Successful user registration.
3. Validation/security handling.
4. Successful login.
5. JWT generation.
6. Access to a protected endpoint using the JWT.
7. Rejection of an invalid or missing token.

### Demonstration Video

**Video Link:**
`<INSERT VIDEO LINK HERE>`

---

# Repository

**GitHub Repository:**
https://github.com/INSY7314-AppDev-Security/INSY7314_Security.git

---

## Part 1 Submission Contents

The repository contains:

* Backend source code.
* Authentication implementation.
* Password hashing utilities.
* JWT utilities.
* Validation middleware.
* Authentication middleware.
* Error-handling middleware.
* HTTPS certificate-generation script.
* Postman collection.
* API testing screenshots.
* MERN architecture diagram.
* Project README.
