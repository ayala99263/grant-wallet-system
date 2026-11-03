# Grant Wallet – Digital Grant Wallet System

A full-stack platform that lets residents receive grants into a digital wallet and redeem them at approved local businesses.

> Status: in progress

## Features

- **Ledger-based wallet** – every load, redemption and refund is recorded as a transaction, so the balance is always calculated from the history.
- **Safe redemption** – database transactions with row locking (`SELECT … FOR UPDATE`) prevent double spending when a grant is redeemed.
- **Redemption coupons** – a unique coupon code is generated for each redemption and emailed to the resident (Nodemailer).
- **Admin dashboard** – approve residents and businesses, load balances in bulk, send messages and review transactions.
- **Business directory** – business registration with admin approval, plus resident recommendations for new businesses.
- **Security** – Helmet, rate limiting, bcrypt password hashing and JWT authentication.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Client | React 19, React Router, Axios, Vite |
| Server | Node.js, Express 5, JWT, bcrypt, Helmet, express-rate-limit, Nodemailer |
| Database | MySQL (mysql2) |

## Project structure

```
client/   React frontend (pages, components, admin views)
server/   Express API – routes, controllers, repositories, middlewares
server/db Database connection and schema initialization
```

## Getting started

```bash
# Server
cd server
npm install
cp .env.example .env   # fill in your own values
npm run db:init        # create the tables
npm run dev

# Client
cd client
npm install
npm run dev
```
