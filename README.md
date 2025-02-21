# Transaction Simulation API

## Overview
This project is a backend system that simulates user transaction processing providing a scalable 


## Features

### 1. User Registration & Authentication
- **Unique** Users can **sign up** and create an account.
- Users can **log in** and receive a **JWT token**.
- Authentication is handled using` **Bearer Token Authentication**`.

### 2. Transaction Processing
- Users can **send money** to other users.
- Transactions `**below 10 units**` are not allowed.
- Users **cannot send more money than they have**.
- `**Concurrency and race conditions**` are handled using **single-query-based `ACID transactions`. Incomplete transactions are rolled back and user balances are verified inquery**.
- Transactions are **queued using `BullMQ and Redis`** for processing.
- A separate `**BullMQ worker**` processes transactions asynchronously.

### 3. Transaction History
- Users can **retrieve their transaction history**.
- Transactions are **paginated** for efficient retrieval.
- Transactions include a **direction** attribute (`INCOMING | OUTGOING`).
- **Caching**: T`ransaction history is cached in **Redis** based on user, page, and page size` for **performance optimization**.

### 4. Security & Optimization
- **Environment Variables**: Sensitive configurations are stored in environment variables.
- **Authentication**: Private user API endpoints are protected using JWT authentication.
- **Input Validation**: **Zod** is used to validate and transfrom/reject user inputs.

### 5. Logging & Error Handling
- **Global Error Handling**: Centralized error management.
- `**Pino-based Logging**`:
  - Logs **errors, requests, and application events**.
  - Worker logs are also captured.

### 6. Rate Limiting
- `Custom middleware` that counts the `number of requests per ip address for 15 minutes`.
- Limits the **number of requests per time window**, stored in Redis.

### 7. Caching
- Uses `**Redis**` to cache transaction history.
- Caching is based on **user, page, and page size** for improved performance.

## Technologies Used
- **Node.js (Express.js)**
- **PostgreSQL** (ACID-compliant transactions)
- **Redis** (Queueing, caching, rate-limiting)
- **BullMQ** (Transaction queue processing)
- **JWT** (Authentication)
- **Pino** (Logging)
- **Zod** (Input validation)
- **Prsma** (DB schema, ORM, DB connection, QUeries, types)
- **Scalar** (OpenAPI client)


## Database: PostgreSQL & Prisma
- The backend uses **PostgreSQL**.
- **Prisma ORM** is used to interact with the database.
- **Database** is optimized with relevant indices to help in querying transaction history
- **DB schema changes** are managed by versioned prisma migrations


## Prerequisites
- Node.js (v22 or later)
- PostgreSQL
- Redis 

## Set Up
1. Clone the repository:
   ```sh
   git clone https://github.com/Anyungu/money-transaction-simulation
   cd transaction-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:54321/itisha?schema=public"
   DIRECT_URL="postgresql://postgres:password@localhost:54321/itisha?schema=public"
   PORT=8080
   JWT_SECRET="091f4aa256fac6feb4e31e0ab28dd5838aedad9faaa0b9583130b6a7cb5130f14d262850d634266beafdf6412ff87ba8e60c6d42125164d6a1454fc90db2b7fd"
   BYCRYPT_SALT=10
   REDIS_HOST=localhost
   REDIS_PORT=63791
   LIMITER_WINDOW_MS=900
   LIMITER_MAX_REQUESTS=100
   ```
4. Run database migrations:
   ```sh
   npx prisma migrate dev
   ```
5. Start the server:
   ```sh
   npm run dev
   ```
6. Start the worker:
   In a separate terminal at the root of the project,
   ```sh
   npm run worker
   ```
7. Preview docs
   In the browser, open this link to preview and test the endpoints `http://localhost:8080/api/v1/docs`

8. Prod build
   ```sh
   npm run build
   npm run extend
   node dist/app.js
   ```
## Docker
Use the docker-compose to spin up all the containers.

## API Endpoints

### Authentication
| Method | Endpoint          | Description        |
|--------|------------------|--------------------|
| POST   | /api/v1/auth/signup | Register a user   |
| POST   | /api/v1/auth/login  | Authenticate user |

### Transactions
| Method | Endpoint               | Description                 |
|--------|------------------------|-----------------------------|
| POST   | /api/v1/transactions/send | Initiate a transaction     |
| GET    | /api/v1/transactions      | Get transaction history    |





