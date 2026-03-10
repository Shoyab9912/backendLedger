# Backend Ledger

A backend system that implements **double-entry bookkeeping** — the same accounting principle used by real banks. Every transaction creates both a CREDIT and DEBIT ledger entry atomically, ensuring financial data is always consistent and auditable.

## Features

- **Double-entry ledger** — every transaction records both debit and credit entries
- **Atomic transactions** using MongoDB sessions — rolls back automatically on failure
- **Idempotency keys** — prevents duplicate transactions from being processed twice
- **Immutable ledger entries** — ledger records can never be modified or deleted
- **Account management** — accounts have Active / Frozen / Closed status
- **Balance calculation** via MongoDB aggregation pipeline
- **Email notifications** — sends confirmation or failure emails via Nodemailer
- **JWT authentication** — all user routes are protected
- **System user** — special privileged user for seeding initial funds

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Email:** Nodemailer
- **Security:** bcryptjs for password hashing

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| POST | `/auth/logout` | Logout user |

### Accounts
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/accounts` | Create a new account |
| GET | `/accounts` | Get all user accounts |
| GET | `/accounts/:accountId/balance` | Get account balance |

### Transactions
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/transactions` | Transfer funds between accounts |
| POST | `/transactions/initial-funds` | Seed initial funds (system user only) |

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB

### Installation
```bash
git clone https://github.com/Shoyab9912/backendLedger.git
cd backendLedger
npm install
```

### Environment Variables

Create a `.env` file in the root:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Run
```bash
npm run dev
```

## How It Works

When a transfer is made between two accounts:
1. The sender's balance is checked via aggregation
2. A `Transaction` document is created with status `PENDING`
3. Inside a MongoDB session, a `DEBIT` ledger entry is created for the sender and a `CREDIT` entry for the receiver
4. If both succeed, the transaction is marked `COMPLETE` and committed
5. If anything fails, the session aborts and rolls back all changes
6. An email notification is sent to the sender on success or failure
