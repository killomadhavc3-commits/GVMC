# CleanCity AI

CleanCity AI is a responsive municipal waste-management platform for residents, collection agents, municipal administrators, and recycling buyers. It uses the MERN stack: MongoDB, Express, React, and Node.js. The roadmap below distinguishes features available in the current website from API-supported workflows and future work.

## Phase plan

1. **MERN foundation and secure accounts (available):** responsive React website, Express and Node.js API, MongoDB persistence, resident registration and sign-in, secure session cookies, and role-aware profiles.
2. **Waste segregation guide (in progress):** browse and search wet, dry, hazardous, and sanitary waste guidance. Photo-based AI classification and locally verified ward advice remain future enhancements.
3. **Resident pickup requests (available):** request a household collection, review its status, and cancel eligible requests; pickup data is persisted in MongoDB.
4. **Collection agent workspace (API ready):** pickup assignment and agent status updates are supported by the API; the dedicated agent dashboard remains future work.
5. **Routes and live collection updates (planned):** plan collection runs and add live agent location and pickup progress for residents to follow.
6. **Resident rewards and history (available):** show points and completed-pickup history; the current rule awards 10 points per completed pickup. Verified rewards for correct segregation remain future work.
7. **Complaints and service requests (available):** residents can submit neighborhood reports and follow their status; municipal status updates are supported by the API.
8. **Municipal administration (planned):** build zone and staff management, operational notifications, and city-level service analytics.
9. **Recycling marketplace (API ready):** listing and inquiry endpoints connect bulk sellers and recycling buyers; user-facing marketplace screens remain future work. Payments and shipping are not included in the first release.
10. **Testing, launch, and city pilot (planned):** complete accessibility, integration, performance, and security checks, then deploy, monitor, and pilot with participating local services.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- MongoDB running locally or a MongoDB connection string

## Run locally

1. Install dependencies from the project root:

   ```sh
   npm install
   ```

2. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI` and replace `JWT_SECRET` with a random value of at least 32 characters.
3. Start the client and API from the project root:

   ```sh
   npm run dev
   ```

4. Open `http://localhost:5173`. The API listens on `http://localhost:5000`; `GET /api/health` reports its status.

The API does not start without its required environment variables and an available MongoDB connection. Staff registration is not public: public sign-up creates resident accounts only. Staff onboarding and municipal zone management belong to phase 8.

## API endpoints

The Express API exposes 25 working endpoints. The routes persist operational data in MongoDB. The resident dashboard is connected to pickup requests, reward balance and history, complaints, and waste-guide search; marketplace endpoints and staff workflows are API-only until their screens are added. Protected routes use the HTTP-only session cookie from sign-in. Pickup assignment and complaint status changes require a municipal admin account; pickup progress changes require the assigned collection agent or an admin. Staff accounts are provisioned by the municipality, not public registration.

| # | Method and path | Access | Purpose |
|---|---|---|---|
| 1 | `GET /api/health` | Public | API health check |
| 2 | `POST /api/auth/register` | Public | Create a resident account |
| 3 | `POST /api/auth/login` | Public | Sign in |
| 4 | `POST /api/auth/logout` | Public | Clear the session |
| 5 | `GET /api/auth/me` | Signed in | Read the current profile |
| 6 | `PATCH /api/auth/me` | Signed in | Update the profile name |
| 7 | `GET /api/waste/categories` | Public | List waste categories |
| 8 | `GET /api/waste/guide?category=dry&q=paper` | Public | Search sorting guidance |
| 9 | `POST /api/pickups` | Resident | Request a pickup |
| 10 | `GET /api/pickups` | Resident, agent, admin | List own, assigned, or all pickups by role |
| 11 | `PATCH /api/pickups/:id/assign` | Municipal admin | Assign a pickup to a collection agent |
| 12 | `PATCH /api/pickups/:id/status` | Resident, assigned agent, admin | Cancel or progress a pickup |
| 13 | `POST /api/complaints` | Resident | Submit a service complaint |
| 14 | `GET /api/complaints` | Resident, municipal admin | List own complaints or all complaints |
| 15 | `PATCH /api/complaints/:id/status` | Municipal admin | Update complaint status |
| 16 | `GET /api/rewards/wallet` | Resident | Read points balance |
| 17 | `GET /api/rewards/history` | Resident | Read completed-pickup reward history |
| 18 | `GET /api/marketplace/listings?material=plastic` | Signed in | Browse active recycling listings |
| 19 | `POST /api/marketplace/listings` | Resident, recycling buyer | Publish a recyclable-material listing |
| 20 | `POST /api/marketplace/listings/:id/inquiries` | Resident, recycling buyer | Send an inquiry to a listing owner |
| 21 | `GET /api/pickups/:id` | Pickup owner, assigned agent, municipal admin | Read a pickup request |
| 22 | `PATCH /api/pickups/:id/reschedule` | Pickup owner | Reschedule a pickup that is still requested |
| 23 | `GET /api/complaints/:id` | Complaint owner, municipal admin | Read a complaint |
| 24 | `GET /api/marketplace/my-listings` | Resident, recycling buyer | List the signed-in user's marketplace listings |
| 25 | `GET /api/marketplace/my-inquiries` | Resident, recycling buyer | List inquiries sent by the signed-in user |

The rewards API currently awards 10 points per completed pickup. Marketplace support covers listings and inquiries; payment and shipping are not included.

Example request bodies:

```json
POST /api/pickups
{
  "wasteType": "dry",
  "address": "12 Beach Road, Visakhapatnam",
  "ward": "Ward 4",
  "scheduledDate": "2026-10-08",
  "notes": "Please collect after 10 AM"
}
```

```json
POST /api/complaints
{
  "category": "missed_pickup",
  "description": "The scheduled collection did not arrive.",
  "location": "12 Beach Road, Visakhapatnam"
}
```

```json
POST /api/marketplace/listings
{
  "material": "paper",
  "title": "Sorted cardboard boxes",
  "description": "Clean, dry cardboard ready for collection.",
  "quantity": 12,
  "unit": "kg",
  "location": "Visakhapatnam"
}
```

Authentication uses an HTTP-only, same-site cookie; passwords are hashed before storage. Set `CLIENT_ORIGIN` to the exact frontend origin when changing the development port or deploying.
