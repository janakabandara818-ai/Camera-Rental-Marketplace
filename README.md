# Camera & Gear

A full-stack camera equipment rental and marketplace application built
with React, Node.js, Express and MongoDB.

Customers can browse equipment, request rentals or purchases, manage
bookings and submit reviews. Administrators manage equipment inventory
and booking requests.

## Features

### Customers

- Register, sign in and sign out.
- Search, filter and sort equipment.
- View equipment details and prices.
- Select rental start and return dates.
- Add rental or purchase items to an account-specific cart.
- Submit booking requests.
- View rental and purchase booking statuses.
- Cancel pending or confirmed bookings.
- Submit one review per product and delete their own reviews.

### Administrators

- Create, read, update and delete equipment.
- Upload equipment images.
- Mark equipment available or unavailable.
- Search and filter bookings.
- Confirm, cancel and complete eligible bookings.
- Delete reviews for moderation.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, TypeScript/JavaScript, Tailwind CSS |
| Routing | React Router |
| API client | Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Image uploads | Cloudinary, Multer |
| Icons | Lucide React |

## Requirements

- Node.js 24.x and npm.
- MongoDB Atlas or another MongoDB deployment supporting transactions.
- Cloudinary credentials for new equipment image uploads.

A standalone MongoDB server without replica-set configuration cannot
run the transaction-based operations used by this application.

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
  setAdmin.js

frontend/
  public/
  src/
    components/
    context/
    pages/
    services/
    types/
    utils/
    App.jsx
    main.jsx
```

The active frontend entry point is `frontend/src/main.jsx`.
It loads the routes defined in `frontend/src/App.jsx`.

## Installation

From the project root, install backend dependencies:

```bash
cd backend
npm install
```

In another terminal, from the project root, install frontend dependencies:

```bash
cd frontend
npm install
```

## Environment Setup

### Backend

Copy `backend/.env.example` to `backend/.env`.

Fill in your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Use a dedicated project database in the connection string.

For MongoDB Atlas, configure a database user and network access for the
machine running the backend.

Cloudinary credentials are required for uploading new equipment images.
Existing local product images are served by the frontend.

### Frontend

Copy `frontend/.env.example` to `frontend/.env` when configuring the API URL.

```env
VITE_API_URL=http://localhost:5000/api
```

Restart the frontend after changing environment variables.

Frontend environment variables are public. Never put passwords, database
credentials or API secrets in them.

Do not commit real `.env` files.

## Run the Application

Start the backend:

```bash
cd backend
npm run dev
```

After connecting successfully:

```text
MongoDB Connected
Server running on port 5000
```

Start the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

Keep both servers running.

The backend currently allows frontend origins at
`http://localhost:5173` and `http://localhost:3000`.
Update the backend CORS configuration if using another origin.

## Administrator Setup

New registrations receive the normal user role.

To create the development administrator:

1. Register `admin@camerarental.test` through the website.
2. Choose your own password.
3. Open a separate terminal in `backend`.
4. Run:

```bash
node setAdmin.js
```

5. Sign out and sign in again.
6. Open Admin Panel.

The script promotes the existing account. It does not create an account
or set a password. There is no default administrator password.

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/products` | Equipment catalog |
| `/product/:id` | Equipment details and reviews |
| `/login` | Sign in |
| `/register` | Registration |
| `/cart` | Cart and booking submission |
| `/checkout` | Protected checkout route |
| `/dashboard` | Customer bookings |
| `/admin` | Administrator dashboard |
| Other paths | 404 page |

Catalog query parameters include `category`, `type`, `q` and `sort`.

## REST API Groups

| Base path | Purpose |
| --- | --- |
| `/api/auth` | Registration, login and current account |
| `/api/products` | Equipment listing and CRUD |
| `/api/bookings` | Booking submission and management |
| `/api/reviews` | Product reviews |
| `/api/upload` | Administrator image uploads |

Protected requests use:

```text
Authorization: Bearer <token>
```

The backend verifies the token and checks the account's current role
in MongoDB. Administrator operations are protected on the server.

## Database Design

The main collections are:

- Users: account details, hashed passwords and roles.
- Products: equipment descriptions, categories, prices and availability.
- Bookings: user/product references, rental dates, totals and status.
- Reviews: user/product references, ratings and comments.

Relationships:

- One user can have many bookings.
- One product can have many booking records.
- One user can review multiple products.
- One product can have multiple reviews.
- A user may submit one review per product.

References use MongoDB ObjectIds.

## Booking Rules

- Each product represents one equipment unit.
- Rental dates use the Asia/Colombo business timezone.
- The return date must be after the start date.
- The return date is exclusive when calculating rental days.
- Pending and confirmed reservations block conflicting bookings.
- Adjacent rental periods are allowed.
- Active purchase bookings block new reservations for that equipment.
- Completed purchases mark equipment unavailable.
- The backend calculates the final booking price.
- Request IDs help prevent duplicate bookings during submission retries.
- Cart items are submitted individually. If a later item fails, earlier
  successful bookings remain submitted.

Status flow:

```text
Pending → Confirmed → Completed
Pending → Cancelled
Confirmed → Cancelled
```

Completed and cancelled bookings are terminal.

Rentals can only be completed on or after the return date.
Administrators must verify the physical return before completing them.

## Safe Product Deletion

Products without booking or review history can be permanently deleted.

Products with booking or review history cannot be deleted.
Administrators can mark them unavailable instead.

## Image Uploads

Supported upload formats:

- JPEG
- PNG
- WebP

Maximum file size: 5 MB.

## Build and Lint

Run from `frontend`:

```bash
npm run build
npm run lint
```

To preview the production build, stop the frontend development server
and run:

```bash
npm run preview -- --port 5173
```

Keep the backend running.

The current lint configuration may report Fast Refresh warnings because
context files export both provider components and hooks. These warnings
are separate from production build errors.

## Manual Test Checklist

- Register, sign in and sign out.
- Verify customer and administrator access restrictions.
- Create, read, update and delete a test product.
- Refresh to verify database persistence.
- Search, filter and sort equipment.
- Check invalid rental dates and unavailable equipment.
- Add rental equipment to the cart.
- Submit a booking and verify Pending status.
- Confirm it as an administrator.
- Verify Confirmed status in the customer dashboard.
- Cancel a test booking and verify persistence after refresh.
- Check review submission and deletion permissions.
- Check mobile navigation, product pages, cart and administrator forms.
- Open an invalid URL and verify the 404 page.
- Run the production build and lint checks.

## Troubleshooting

### Equipment does not load

Check that the backend is running and MongoDB connected successfully.
Verify the frontend API URL and backend port.

### MongoDB connection fails

Check credentials, Atlas network access and DNS connectivity.
Restart the backend after correcting the configuration.

### Image upload fails

Check Cloudinary credentials, supported file formats and the 5 MB limit.

### Port is already in use

Stop the existing server process before starting another instance.

## Limitations

- Booking submission does not collect online payments.
- Each equipment listing represents one unit.
- Pending bookings do not automatically expire.
- Cart storage is browser-local and account-specific.
- Booking status changes appear after refreshing the booking list.

## Development Utilities

`backend/seeder.js` replaces the product collection with sample equipment.
Do not run it against a database containing bookings or reviews.

`backend/fixProductPhotos.js` is a separate image-path maintenance utility.

## Image Credit

Homepage desk camera photograph: Brunno Tozzo / Unsplash.

https://unsplash.com/photos/a-canon-camera-sitting-on-top-of-a-table-5vCq_w-SQTs