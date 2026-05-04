# Hotel booking microservices

Node.js 20 + Express (CommonJS) microservices for hourly hotel room slots (4 / 8 / 12 / 16 / 20 / 24 hours), with MongoDB per service, Redis, RabbitMQ (`hotel_events` topic exchange), Razorpay, Cloudinary, Nodemailer, and MSG91.

## Prerequisites

- Docker Engine with Compose v2
- Node.js 20+ (for local runs outside Docker)

## Quick start (Docker)

1. Copy the environment template and fill in secrets (JWT, Razorpay, Cloudinary, SMTP, MSG91):

   ```bash
   cp .env.example .env
   ```

2. Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are at least 16 characters and match across services that verify access tokens (`api-gateway`, `auth-service`, `booking-service`, `payment-service`, `host-admin-service`).

   `docker compose` is configured so `.env` is **optional** for validating the compose file (`docker compose config`). For a running stack, you still need a `.env` (or equivalent) with all required secrets or each Node service will exit during Joi validation at startup.

3. Build and start the stack:

   ```bash
   docker compose up --build
   ```

4. Entry point: **API gateway** on [http://localhost:3000](http://localhost:3000). Health: `GET http://localhost:3000/health`.

5. RabbitMQ management UI: [http://localhost:15672](http://localhost:15672) (default `guest` / `guest`).

## Service ports

| Service               | Port |
|-----------------------|------|
| api-gateway           | 3000 |
| auth-service          | 3001 |
| search-service        | 3002 |
| booking-service       | 3003 |
| payment-service       | 3004 |
| notification-service  | 3005 |
| host-admin-service    | 3006 |

## Gateway routing

| Path prefix                 | Target              |
|----------------------------|---------------------|
| `/api/v1/auth/*`           | auth-service        |
| `/api/v1/search/*`        | search-service      |
| `/api/v1/bookings/*`      | booking-service     |
| `/api/v1/payments/*`      | payment-service     |
| `/api/v1/notifications/*` | notification-service|
| `/api/v1/host/*`          | host-admin-service  |
| `/api/v1/admin/*`         | host-admin-service  |

Public (no JWT on gateway): `GET /api/v1/search/*`, `POST /api/v1/payments/webhook`, selected `POST /api/v1/auth/*` (register, login, forgot-password, reset-password, refresh). All other proxied routes require a valid `Authorization: Bearer <access_token>`.

Auth routes are rate-limited to **10 requests / 15 minutes** per IP at the gateway.

### search-service (via `/api/v1/search`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rooms` | Filtered, paginated listings; Redis key `search:<sha256(normalized query)>` TTL **5 min** |
| GET | `/rooms/:sourceRoomId` | Single active room by host listing id (24-char hex) |
| GET | `/meta/cities` | Distinct cities for filters (`prefix`, `limit` query params) |
| GET | `/health` | Liveness (also `GET /health` on the service root) |

## Event bus (RabbitMQ)

- Exchange: `hotel_events` (topic, durable).
- Dead-letter exchange: `hotel_events_dlx`, queue: `hotel_events_dlq`.

| Publisher          | Routing key          | Consumers                                      |
|--------------------|----------------------|------------------------------------------------|
| booking-service    | `booking.created`    | notification-service                           |
| booking-service    | `booking.confirmed`  | notification-service                           |
| booking-service    | `booking.cancelled`  | notification-service, payment-service        |
| payment-service    | `payment.confirmed`  | booking-service                                |
| payment-service    | `payment.failed`     | booking-service, notification-service          |
| host-admin-service | `room.created`       | search-service                                 |
| host-admin-service | `room.updated`       | search-service                                 |

## Local development (without Docker)

Install dependencies in each package (`api-gateway` and each folder under `services/`), export the variables from `.env` (or use per-service `.env.example`), start MongoDB/Redis/RabbitMQ locally, then `npm run dev` or `npm start` per service. Ports must match the gateway target URLs.

## Environment matrix

| Variable | Used by |
|----------|---------|
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | auth, gateway, booking, payment, host-admin |
| `MONGO_*_URI` | respective Mongo-using service |
| `REDIS_URL` | booking, search |
| `RABBITMQ_URL` | all publishers/subscribers except auth (stub) |
| `RAZORPAY_*` | payment-service |
| `CLOUDINARY_*` | host-admin-service |
| `SMTP_*` | auth-service (password reset), notification-service |
| `MSG91_*` | notification-service |
| `BOOKING_SERVICE_INTERNAL_URL`, `AUTH_SERVICE_INTERNAL_URL` | host-admin-service (server-to-server) |

## Troubleshooting

- If containers exit on boot, check logs for **Joi env validation** messages; every service validates required variables at startup.
- Razorpay **webhook** must reach `POST /api/v1/payments/webhook` with a raw body; the gateway forwards it without JSON parsing.
- Search cache keys use `search:<sha256(query)>` with a **5 minute** TTL; room sync clears `search:*` keys on `room.created` / `room.updated`.

## Layout

See the repository tree: `api-gateway/`, `services/*`, root `docker-compose.yml`, `.env.example`, and per-service `.env.example` files.
