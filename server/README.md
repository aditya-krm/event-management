# Event Manager Dashboard API

A backend API for an Event Manager Dashboard built with Node.js, Express, and PostgreSQL.

## Features

- **Authentication**: JWT-based auth system with user registration and login
- **Event Management**: Create, read, update, and delete events
- **Registration System**: Register for events and manage participants
- **Authorization**: Role-based access control for event management

## Tech Stack

- **Node.js & Express**: Backend API framework
- **PostgreSQL**: Database (using raw SQL queries with pg)
- **JWT**: Authentication
- **Zod**: Request validation
- **bcryptjs**: Password hashing

## Getting Started

### Prerequisites

- Node.js (>=18.x)
- PostgreSQL

### Installation

1. Clone the repository
2. Install dependencies

```bash
cd server
npm install
```

3. Configure environment variables

Create a `.env` file in the server directory with the following variables:

```
# Database Configuration
DATABASE_URL = "dburl"

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY=24h

# Server Configuration
PORT=5000
NODE_ENV=development
```

4. Initialize the database

```bash
npm run init-db
```

5. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login and get JWT
- **GET /api/auth/me**: Get current user profile

### Events

- **POST /api/events**: Create an event
- **GET /api/events**: List all events
- **GET /api/events/:id**: Get specific event
- **PUT /api/events/:id**: Update an event
- **DELETE /api/events/:id**: Delete an event

### Registrations

- **POST /api/events/:id/register**: Register for an event
- **GET /api/events/:id/participants**: List event participants
- **DELETE /api/registrations/:id**: Cancel registration
- **GET /api/registrations/user**: Get user's registrations

## License

ISC
