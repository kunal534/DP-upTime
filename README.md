
# Decentralized Uptime Monitoring Platform

A project built to monitor the uptime of websites using decentralized validators on the Solana blockchain network.

## 🚀 Project Overview

This platform allows users to:

- Register websites for uptime monitoring.
- Collect uptime reports from distributed validators.
- View website status (up/down) and response code logs.
- Track validator contributions.
- Build toward a trustless uptime monitoring ecosystem.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL with Prisma ORM
- **Blockchain:** Solana (using `@solana/web3.js`)
- **Auth:** JWT-based authentication (via `authMiddleware`)
- **Frontend:** (Planned) React-based dashboard
- **Hosting:** (Planned) Vercel / Railway

## ✅ Features Implemented

- Create and manage websites for monitoring.
- Validator can submit reports on website status.
- Track each website's status using a relational `WebsiteTick` model.
- Basic validation on user and validator submissions.
- REST API endpoints secured with authentication middleware.

## ❌ Current Issues

- Data submitted from validator reports is not consistently updating in the Prisma DB.
- Dashboard frontend isn't displaying website status correctly (likely due to `ticks` not populating).
- Need better error handling and logging across endpoints.
- Project needs frontend integration to visualize stats (status history, uptime %, etc).

## 🔒 Authentication Flow

- Uses JWT to authorize and identify users making requests.
- Middleware in place to extract and validate tokens.

## 📂 Project Structure

```
/api
  - /v1
    - website.ts (CRUD routes)
    - validator.ts (status reporting routes)
db/
  - prisma/
    - schema.prisma
frontend/
  - (Planned React dashboard)
```

## 📌 Future Goals

- Improve validator trust scoring and decentralize submissions.
- Add latency and uptime visualization via graphs.
- Deploy fully to cloud with CI/CD and monitoring.
