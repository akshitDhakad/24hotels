## Fake backend (frontend testing)

This project includes a lightweight JSON-backed API server for local frontend testing.

### Endpoints

- `GET /api/hotels` – list hotels
- `GET /api/hotels/:id` – hotel details
- `GET /api/bookings` – list bookings
- `POST /api/bookings` – create booking (json-server default)

### Run

1. Install deps:

```bash
npm i
```

2. Start fake API:

```bash
npm run mock:server
```

Server runs at `http://localhost:4000`.

