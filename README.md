# StudioSpace Server

REST API for **StudioSpace**, a peer-to-peer creative workspace and studio sharing platform. It handles studio listings, bookings and secure access to protected operations.

**Live client:** https://studio-space-orpin.vercel.app/
**Client repository:** https://github.com/rabbicodes/studio-space

---

## Key Features

- **Studio management:** Create, read, update and delete studio listings stored in MongoDB.
- **Featured studios:** Endpoint that returns the six newest or top-rated studios using `.limit(6)`.
- **Category filtering:** Filter studios by category through query parameters.
- **Booking system:** Create bookings with an initial status of `Pending`, list a user's bookings and cancel pending ones.
- **Double-booking prevention:** New reservations are checked for time overlap against existing `Confirmed` bookings, and collisions are rejected with a clear error message.
- **JWT security:** Protected mutations read a JWT from an HTTPOnly cookie and return `401 Unauthorized` for unauthenticated requests.
- **Ownership checks:** Users can only update or delete listings that match their own email.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Atlas) |
| Security | JWT, HTTPOnly cookies, CORS |
| Deployment | Vercel / Render |

## API Endpoints

### Studios

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/studios` | Public | List all studios (supports `?category=`) |
| GET | `/api/studios/featured` | Public | Six featured studios |
| GET | `/api/studios/:id` | Public | Single studio details |
| GET | `/api/studios/my-listings` | Required | Studios owned by the logged-in user |
| POST | `/api/studios` | Required | Add a new studio |
| PUT | `/api/studios/:id` | Required | Update a studio (owner only) |
| DELETE | `/api/studios/:id` | Required | Delete a studio (owner only) |

### Bookings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/bookings` | Required | Create a booking (overlap-checked) |
| GET | `/api/bookings/my-bookings` | Required | Bookings of the logged-in user |
| PATCH | `/api/bookings/:id/cancel` | Required | Cancel a pending booking |

> Adjust the paths above so they match your actual route definitions.

## Data Models

**studios**

```json
{
  "title": "Creative Light Photo Studio",
  "category": "Photo Studio",
  "hourlyRate": 45,
  "securityDeposit": 100,
  "maxCapacity": 12,
  "location": "Sonadanga, Khulna",
  "image": "https://...",
  "amenities": ["Wi-Fi", "Air conditioning"],
  "overview": "...",
  "ownerName": "...",
  "ownerEmail": "...",
  "createdAt": "ISO date"
}
```

**bookings**

```json
{
  "studioId": "ObjectId",
  "userEmail": "...",
  "date": "YYYY-MM-DD",
  "startTime": "10:00",
  "endTime": "13:00",
  "totalPrice": 135,
  "status": "Pending"
}
```

## Local Setup

### Prerequisites

- Node.js 20 or later
- A MongoDB database (local or MongoDB Atlas)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/rabbicodes/studio-space-server.git
   cd studio-space-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

5. The API runs at http://localhost:5000.

## Security Notes

- Never commit `.env` files or secrets.
- Cookies are `httpOnly`, and `secure` plus `sameSite` are configured for production.
- CORS only allows the configured client origin.

## Author

**Rabbi** — [@rabbicodes](https://github.com/rabbicodes)
