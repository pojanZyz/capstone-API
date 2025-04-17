# Capstone API

Capstone API is a backend service built with Node.js, Express, and TypeScript. It provides endpoints for managing users, articles, feedback, and machine learning-based recommendations. The project integrates with Supabase for file storage and PostgreSQL for database management.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Users](#users)
  - [Articles](#articles)
  - [Feedback](#feedback)
  - [Recommendations](#recommendations)
- [Database Schema](#database-schema)
- [Scripts](#scripts)
- [License](#license)

---

## Features

- User authentication (register, login, logout).
- Role-based access control (admin and user roles).
- CRUD operations for articles.
- Feedback system for articles.
- Machine learning-based recommendations.
- File upload support using Supabase storage.
- PostgreSQL database integration with Prisma ORM.

---

## Technologies Used

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **File Storage**: Supabase
- **Authentication**: JSON Web Tokens (JWT)
- **Machine Learning**: TensorFlow.js

---

## Project Structure

```
capstone-API-rajif
├── prisma/                 # Prisma schema and migrations
├── src/
│   ├── config/             # Configuration files (Prisma, Supabase)
│   ├── controller/         # Controllers for handling API logic
│   ├── middleware/         # Middleware for validation and file handling
│   ├── model/              # Machine learning model files
│   ├── router/             # API route definitions
│   ├── types/              # TypeScript type definitions
│   └── index.ts            # Main entry point
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── readme.md               # Project documentation
```

---

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/capstone-API-rajif.git
   cd capstone-API-rajif
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and configure the following variables:
   ```properties
   DATABASE_URL="postgresql_connection_string"
   SUPABASE_URL="supabase_url"
   SUPABASE_KEY="supabase_key"
   JWT_SECRET="jwt_secret"
   ```

4. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Build the project**:
   ```bash
   npm run build
   ```

6. **Start the server**:
   ```bash
   npm start
   ```

---

## Environment Variables

| Variable         | Description                          |
|-------------------|--------------------------------------|
| `DATABASE_URL`    | PostgreSQL connection string         |
| `SUPABASE_URL`    | Supabase project URL                |
| `SUPABASE_KEY`    | Supabase API key                    |
| `JWT_SECRET`      | Secret key for JWT authentication   |

---

## API Endpoints

### Users

| Method | Endpoint         | Description                  |
|--------|-------------------|------------------------------|
| POST   | `/users/register` | Register a new user          |
| POST   | `/users/login`    | Login a user                 |
| POST   | `/users/logout`   | Logout a user                |
| GET    | `/users/me`       | Get logged-in user details   |

### Articles

| Method | Endpoint              | Description                  |
|--------|------------------------|------------------------------|
| POST   | `/articles`           | Create a new article         |
| GET    | `/articles`           | Get all articles             |
| GET    | `/articles/:id`       | Get article by ID            |
| PATCH  | `/articles/:id`       | Update an article            |
| DELETE | `/articles/:id`       | Delete an article            |

### Feedback

| Method | Endpoint                        | Description                  |
|--------|----------------------------------|------------------------------|
| POST   | `/articles/:id/feedback`        | Add feedback to an article   |
| GET    | `/articles/:id/feedback`        | Get feedback for an article  |
| DELETE | `/articles/:id/feedback`        | Delete feedback              |

### Recommendations

| Method | Endpoint         | Description                  |
|--------|-------------------|------------------------------|
| POST   | `/rekomendasi`    | Get recommendations based on query |

---

## Database Schema

### Users Table

| Column     | Type     | Description              |
|------------|----------|--------------------------|
| `id`       | Integer  | Primary key              |
| `username` | String   | Unique username          |
| `password` | String   | Hashed password          |
| `email`    | String   | Unique email             |
| `role`     | String   | User role (admin/user)   |
| `image`    | String   | Profile image URL        |

### Articles Table

| Column      | Type     | Description              |
|-------------|----------|--------------------------|
| `id`        | BigInt   | Primary key              |
| `title`     | String   | Article title            |
| `category`  | String   | Article category         |
| `shortdesc` | String   | Short description        |
| `longdesc`  | String   | Long description         |
| `location`  | String   | Location of the article  |
| `image`     | String   | Article image URL        |

### Feedback Table

| Column      | Type     | Description              |
|-------------|----------|--------------------------|
| `id`        | BigInt   | Primary key              |
| `rating`    | Integer  | Rating (1-5)             |
| `ulasan`    | String   | User review              |
| `userid`    | Integer  | Foreign key to users     |
| `articleid` | BigInt   | Foreign key to articles  |

---

## Scripts

| Script       | Description                          |
|--------------|--------------------------------------|
| `npm run build` | Compile TypeScript to JavaScript   |
| `npm start`     | Start the server                  |
| `npx prisma migrate dev` | Run database migrations |

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
