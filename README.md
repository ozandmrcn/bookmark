# bookmark

Welcome to the **bookmark** project! A clean, production-minded REST API for managing personal bookmarks, built with **Node.js**, **NestJS**, **TypeScript**, and **Prisma**. Every endpoint is protected with **JWT** authentication, and data is stored relational in **PostgreSQL** — a solid foundation for anything from a personal link-saver to the backbone of a larger application.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Bullseye.png" alt="Bullseye" width="25" height="25" /> Project Overview

bookmark enables users to:

- **User Registration & Login:** Secure authentication with **JWT access/refresh** tokens and password hashing via **argon2**.
- **Profile Management:** Read and update your own profile without ever exposing the password hash.
- **Bookmark CRUD:** Create, list, view, update and delete bookmarks — each scoped to the authenticated user.
- **Token Refresh Flow:** Short-lived access tokens (`15m`) extended seamlessly with a long-lived refresh token (`7d`) that is **rotated on every refresh**.
- **Real Logout with Revocation:** Logout deletes the stored refresh token and **blacklists the access token**, so no previously issued token can be reused.
- **Validation by Default:** A global validation pipeline with `whitelist` + `forbidNonWhitelisted` rejects unknown and malformed payloads out of the box.
- **Strict Type Safety:** Entire codebase runs under **TypeScript** strict mode for better maintainability.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="25" height="25" /> Features

- **NestJS Modular Architecture:** Auth, User and Bookmark modules with clean separation of concerns (controller / service / DTO).
- **Passport + JWT Strategies:** Two dedicated strategies — `jwt-access` for protected routes and `jwt-refresh` for the refresh flow.
- **Prisma ORM:** Type-safe database access with `User → Bookmark`, `User → RefreshToken` and `User → BlacklistedToken` relations and auto timestamps.
- **Granular Token Pair:** `accessToken` (`15m`) for API calls and `refreshToken` (`7d`) issued by the Auth service.
- **Argon2 Password Hashing:** Modern, memory-hard hashing — the `hash` column never leaves the server.
- **Class-Validator DTOs:** Runtime validation for emails, URL formats and field length constraints.
- **Developer Experience:** Hot-reload watch mode, `vitest` for unit + e2e tests, `oxlint` fast linting, Prettier formatting.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Hammer%20and%20Wrench.png" alt="Hammer and Wrench" width="25" height="25" /> Technologies Used

- **Node.js** (Runtime Environment)
- **NestJS** (Progressive Web Framework)
- **Express.js** (HTTP Layer)
- **TypeScript** (Language)
- **Prisma & PostgreSQL** (ORM & Database)
- **Passport + passport-jwt** (Authentication)
- **Argon2** (Password Hashing)
- **class-validator & class-transformer** (DTO Runtime Validation)
- **@nestjs/jwt** (Token Signing & Verification)
- **@nestjs/config** (Environment Configuration)
- **Vitest & Supertest** (Testing)
- **Oxlint & Prettier** (Linting & Formatting)

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Desktop%20Computer.png" alt="Desktop Computer" width="25" height="25" /> Setup & Installation

To run the project locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/ozandmrcn/bookmark.git

# Navigate to the project folder
cd bookmark

# Install dependencies
npm install

# Create your .env file (see the annotated template below)
# and point it at a running PostgreSQL instance
npx prisma migrate dev

# Start the development server (watch mode)
npm run start:dev   # API -> http://localhost:3000
```

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" alt="Gear" width="25" height="25" /> Environment Variables (.env Setup)

Create a `.env` file in the project root. An annotated reference template:

```env
# PostgreSQL connection string (adjust user / password / db name)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/nest_bookmark"

# Secret used to sign short-lived access tokens (15 min)
JWT_ACCESS_SECRET="super-secret-access"

# Secret used to sign long-lived refresh tokens (7 days)
JWT_REFRESH_SECRET="super-secret-refresh"

# Optional: port the NestJS server listens on (default: 3000)
PORT=3000
```

> ⚠️ **Note:** A running **PostgreSQL** instance is required before starting the server.
>
> 💡 **Tip:** `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` should be strong, unique, random strings in any real deployment.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Clipboard.png" alt="Clipboard" width="25" height="25" /> API Endpoints

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| GET | `/` | — | Health check (`Hello World!`) |
| POST | `/auth/signup` | — | Register a new user → returns tokens |
| POST | `/auth/login` | — | Log in with email + password → returns tokens |
| POST | `/auth/refresh` | `jwt-refresh` | Exchange a Bearer refresh token for a fresh token pair (rotation revokes the old one) |
| POST | `/auth/logout` | `jwt-access` | Real revocation — deletes the stored refresh token and blacklists the access token |
| GET | `/user/profile` | `jwt-access` | Fetch the authenticated user (`id`, `email`) |
| PATCH | `/user/update` | `jwt-access` | Update `firstName`, `lastName`, `email` |
| GET | `/bookmark` | `jwt-access` | List the user's bookmarks (404 when empty) |
| GET | `/bookmark/:id` | `jwt-access` | Fetch a single bookmark |
| POST | `/bookmark` | `jwt-access` | Create a bookmark (201) |
| PATCH | `/bookmark/:id` | `jwt-access` | Partially update a bookmark |
| DELETE | `/bookmark/:id` | `jwt-access` | Delete a bookmark (204) |

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Paperclip.png" alt="Paperclip" width="25" height="25" /> Testing with Postman

Import the **`Bookmark API.postman_collection.json`** file from the repository root and hit **Run Collection**. The collection follows the full happy path (signup → login → refresh → profile → bookmark CRUD → logout) and ships with per-request test assertions, dynamic variables and re-runnable unique emails, so every run is green on a fresh database. **Logout intentionally runs last** because it revokes the server-side tokens.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/E-Mail.png" alt="E-Mail" width="25" height="25" /> Contact

For any questions or feedback, feel free to contact:  
**Ozan Demircan** – ozandmrcn47@gmail.com