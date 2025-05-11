# Bus & Train Ticketing System Backend

This is the backend API for the Bus & Train Ticketing System built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Bus and train schedule management
- Booking management
- Seat availability tracking
- Refund processing
- Admin dashboard

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ticketing-system
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Buses

- `GET /api/bus` - Get all buses (with filters)
- `GET /api/bus/:id` - Get single bus
- `POST /api/bus` - Create new bus (admin only)
- `PUT /api/bus/:id` - Update bus (admin only)
- `DELETE /api/bus/:id` - Delete bus (admin only)
- `PUT /api/bus/:id/seats` - Update bus seats

### Bookings

- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/admin` - Get all bookings (admin only)

## Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Authentication

Most endpoints require authentication using JWT. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Development

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 