---
sidebar_position: 4
---

# Authentication

## 1. Overview

Adamas2Aurum uses **Better Auth** as the central authentication system. It provides email/password authentication, Google OAuth, session management, password reset, and account deletion.

The authentication system is integrated with the project's existing **Node.js + Express server** and **MySQL database**.

### Authentication at a Glance

| Feature | Implementation |
|---|---|
| Email/password sign-up | Better Auth |
| Email/password sign-in | Better Auth |
| Google sign-in | Google OAuth 2.0 through Better Auth |
| Password reset | Better Auth |
| Account deletion | Better Auth |
| Session management | Better Auth |
| Password hashing | Better Auth |
| Authentication database | MySQL |
| Frontend | Plain HTML + CSS + JavaScript |

---

## 2. Authentication Architecture

The authentication system consists of the browser client, Express server, Better Auth, MySQL, and Google OAuth.

```mermaid
flowchart TD
    User([User])
    Frontend["Adamas2Aurum Frontend<br/>HTML / CSS / JavaScript"]
    Client["Better Auth Client<br/>auth-client.bundle.mjs"]
    Server["Node.js / Express Server"]
    BetterAuth["Better Auth<br/>Authentication Service"]
    Database[("MySQL Database")]
    Google["Google OAuth 2.0"]

    User --> Frontend
    Frontend --> Client
    Client --> Server
    Server --> BetterAuth
    BetterAuth --> Database
    Client -->|Google sign-in| Google
    Google -->|OAuth callback| BetterAuth
```

### Component Responsibilities

| Component | Responsibility |
|---|---|
| **Frontend** | Provides sign-up, login, password reset and account-management interfaces |
| **Better Auth Client** | Sends authentication requests from the browser |
| **Express** | Acts as the application's HTTP server and forwards authentication requests |
| **Better Auth** | Handles authentication logic, credentials, sessions, OAuth and account operations |
| **MySQL** | Stores users, sessions, linked accounts and verification tokens |
| **Google OAuth** | Provides external identity authentication |

The Express server delegates authentication requests under `/api/auth/*` to Better Auth.

---

## 3. Authentication Requirements

| Requirement | Implementation | Status |
|---|---|---|
| User sign-up | Better Auth email/password and Google OAuth | Implemented |
| User sign-in | Better Auth email/password and Google OAuth | Implemented |
| Password reset | Better Auth reset-token flow | Implemented |
| Account deletion | Better Auth account deletion | Implemented |
| Session management | Better Auth sessions and cookies | Implemented |
| Password hashing | Handled internally by Better Auth | Implemented |
| Custom authentication system | Not used | Requirement satisfied |

---

## 4. Authentication Methods

Users can authenticate using either their email/password credentials or Google.

| Authentication Method | User Action | Authentication Provider |
|---|---|---|
| **Email/password sign-up** | Enter name, email and password | Better Auth |
| **Email/password sign-in** | Enter email and password | Better Auth |
| **Google** | Select Google sign-in/sign-up | Google OAuth 2.0 through Better Auth |

The frontend authentication handlers call Better Auth through the exposed `authClient`.

---

## 5. Sign-Up

Users can create an account using either email/password authentication or Google.

### 5.1 Email/Password Sign-Up

```mermaid
flowchart TD
    A([User]) --> B["Open Sign Up"]
    B --> C["Enter name, email and password"]
    C --> D["Submit sign-up form"]
    D --> E["Better Auth Client"]
    E --> F["Better Auth"]
    F --> G[("MySQL")]
    G --> H["User account created"]
    H --> I["Authenticated session"]
    I --> J["Dashboard"]
```

The email sign-up handler sends the user's name, email and password to Better Auth using:

```js
authClient.signUp.email()
```

### 5.2 Google Sign-Up

```mermaid
flowchart TD
    A([User]) --> B["Open Sign Up"]
    B --> C["Select Sign up with Google"]
    C --> D["Better Auth Client"]
    D --> E["Google OAuth"]
    E --> F["Google authenticates user"]
    F --> G["OAuth callback"]
    G --> H["Better Auth"]
    H --> I[("MySQL")]
    I --> J["Account/session created"]
    J --> K["Dashboard"]
```

Google sign-up uses Better Auth's social sign-in functionality with the Google provider.

---

## 6. Sign-In

### 6.1 Email/Password Sign-In

```mermaid
flowchart TD
    A([User]) --> B["Open Log In"]
    B --> C["Enter email and password"]
    C --> D["Submit login form"]
    D --> E["Better Auth Client"]
    E --> F["Better Auth"]
    F --> G[("MySQL")]
    G --> H{"Credentials valid?"}

    H -->|Yes| I["Create / restore session"]
    I --> J["Dashboard"]

    H -->|No| K["Display authentication error"]
```

The login form uses:

```js
authClient.signIn.email()
```

to submit email/password credentials to Better Auth.

### 6.2 Google Sign-In

```mermaid
flowchart TD
    A([User]) --> B["Select Log in with Google"]
    B --> C["Better Auth Client"]
    C --> D["Google OAuth"]
    D --> E["User authenticates with Google"]
    E --> F["OAuth callback"]
    F --> G["Better Auth"]
    G --> H[("MySQL")]
    H --> I["Session established"]
    I --> J["Dashboard"]
```

---

## 7. Password Reset

Password reset is implemented using Better Auth's reset-token flow.

The current development implementation **does not send an email**. Instead, the generated reset URL is logged to the server console.

### 7.1 Password Reset Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant BetterAuth as Better Auth
    participant DB as MySQL
    participant Server as Server Console

    User->>Frontend: Select "Forgot password?"
    Frontend->>User: Request email
    User->>Frontend: Enter email
    Frontend->>BetterAuth: requestPasswordReset()
    BetterAuth->>DB: Generate and store reset token
    BetterAuth->>Server: Log reset URL
    Server-->>User: Reset URL available in console

    User->>Frontend: Open reset URL
    Frontend->>User: Request new password
    User->>Frontend: Submit new password
    Frontend->>BetterAuth: resetPassword()
    BetterAuth->>DB: Validate token and update password
    BetterAuth-->>Frontend: Reset successful
    Frontend-->>User: Redirect to home page
```

### 7.2 Password Reset Behaviour

| Aspect | Implementation |
|---|---|
| **Reset request** | User provides their email |
| **Token generation** | Better Auth |
| **Token storage** | MySQL verification table |
| **Email delivery** | Not configured in the development implementation |
| **Reset URL** | Logged to the server console |
| **Token validation** | Better Auth |
| **New password** | Submitted through reset-password page |
| **Password update** | Handled by Better Auth |
| **Successful reset** | User is redirected to `/` |

---

## 8. Account Deletion

Users can delete their account from the authenticated application.

```mermaid
flowchart TD
    A([Authenticated User]) --> B["Select Delete My Account"]
    B --> C{"Confirm deletion?"}

    C -->|Cancel| D([Account remains])
    C -->|Confirm| E["Request password confirmation"]

    E --> F["Better Auth"]
    F --> G{"Authentication valid?"}

    G -->|No| H["Display deletion error"]
    G -->|Yes| I["Delete user and associated authentication data"]
    I --> J["Redirect to home page"]
```

### 8.1 Behaviour by Authentication Method

| Authentication Method | Password Required? | Behaviour |
|---|---|---|
| **Email/password** | Yes | User confirms their password before deletion |
| **Google OAuth** | No | Password field may be left empty |

---

## 9. Session Management

Better Auth manages the application's authentication sessions.

### 9.1 Session Lifecycle

```mermaid
flowchart LR
    A["Sign-up / Sign-in"] --> B["Session created"]
    B --> C[("Session stored in MySQL")]
    C --> D["Session cookie sent to browser"]
    D --> E["Browser makes authenticated request"]
    E --> F{"Session valid?"}

    F -->|Yes| G["Request continues"]
    F -->|No / expired| H["Request rejected"]

    G --> I["Session remains active"]
    I --> J["Sign-out / Account deletion"]
    J --> K["Session destroyed"]
```

---

## 10. Database Integration

Better Auth manages the authentication database schema.

The project's migration script determines which Better Auth tables and columns are required and applies the migrations to MySQL.

### 10.1 Authentication Tables

| Table | Purpose |
|---|---|
| `user` | Stores user profile information |
| `session` | Stores active authentication sessions |
| `account` | Stores linked authentication providers |
| `verification` | Stores verification and password-reset tokens |

The authentication database therefore separates user information, sessions, linked accounts and verification data.

---

## 11. Security Decisions

The project delegates security-sensitive authentication functionality to Better Auth instead of implementing it manually.

| Security Decision | Reason |
|---|---|
| **Better Auth used for authentication** | Avoids implementing a custom authentication system |
| **Password hashing handled by Better Auth** | Prevents custom credential hashing logic |
| **OAuth handled by Better Auth** | Delegates OAuth processing and related security handling |
| **Session cookies managed by Better Auth** | Reduces the risk of incorrect session-cookie configuration |
| **Secrets stored in `.env`** | Prevents credentials and OAuth secrets from being committed to source control |
| **Google provider conditionally enabled** | Prevents OAuth configuration from being used when required credentials are unavailable |
| **Password reset URL logged during development** | Allows the reset flow to be tested without configuring SMTP |

---

## 12. Technologies Used

| Technology | Purpose |
|---|---|
| **Better Auth** | Core authentication library |
| **Node.js** | Server runtime |
| **Express** | HTTP server and Better Auth request handling |
| **MySQL** | Authentication database |
| **mysql2** | MySQL connection driver |
| **dotenv** | Loads environment variables |
| **Google OAuth 2.0** | External authentication provider |
| **JavaScript** | Frontend and server-side application logic |
| **HTML** | Authentication interface |
| **CSS** | Authentication interface styling |
| **esbuild** | Bundles the Better Auth browser client |

---

## 13. Implementation

### 13.1 Express Authentication Handler

The Express server delegates authentication requests to Better Auth:

```js
app.all("/api/auth/*", toNodeHandler(auth));
```

This allows Better Auth to handle the authentication endpoints rather than requiring separate custom routes for each authentication operation.

### 13.2 Better Auth Server Configuration

The server-side Better Auth configuration contains the following major components:

| Configuration | Purpose |
|---|---|
| **MySQL connection pool** | Provides database access |
| **Google OAuth provider** | Enables Google authentication |
| **Email/password** | Enables credential-based authentication |
| **Account deletion** | Enables user account deletion |
| **Password reset callback** | Handles reset URL generation during development |

The Google provider is conditionally registered when the required Google OAuth environment variables are available.

### 13.3 Browser Client

The Better Auth browser client is bundled before being loaded by the frontend.

```text
src/client-entry.js
        │
        ▼
     esbuild
        │
        ▼
public/js/auth-client.bundle.mjs
        │
        ▼
Browser authentication pages
```

The client entry point creates the Better Auth client using the application's current origin and exposes it to the frontend authentication handlers.

### 13.4 Frontend Authentication Handlers

| Function | User Action | Better Auth Operation |
|---|---|---|
| `handleGoogleSignUp()` | Sign up with Google | `signIn.social()` |
| `handleGoogleLogin()` | Log in with Google | `signIn.social()` |
| `handleEmailSignUp()` | Submit sign-up form | `signUp.email()` |
| `handleEmailLogin()` | Submit login form | `signIn.email()` |
| `handleForgotPassword()` | Select forgot password | `requestPasswordReset()` |

---

## 14. Testing and Verification



## 15. Authentication Summary

The Adamas2Aurum authentication system uses **Better Auth as the central authentication layer**, integrated with the Node.js/Express server and MySQL database.

The system supports:

- Email/password registration
- Email/password login
- Google OAuth
- Password reset
- Account deletion
- Session management

The implementation deliberately delegates security-sensitive authentication operations to Better Auth rather than implementing custom credential handling.

### Authentication Architecture Summary

```mermaid
flowchart LR
    User([User])
    Auth["Better Auth"]
    DB[("MySQL")]
    Google["Google OAuth"]

    User --> Auth
    Auth --> DB
    Auth <--> Google

    Auth --> Session["Authenticated Session"]
    Session --> App["Adamas2Aurum"]
```

This architecture keeps authentication functionality centralised while allowing the rest of the application to work with authenticated user sessions.
