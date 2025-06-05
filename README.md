# Event Management System

A comprehensive full-stack web application for managing events, registrations, and participants. Built with modern technologies to provide a seamless experience for event organizers and attendees.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure JWT-based registration and login system
- **Event Management**: Create, read, update, and delete events with rich details
- **Event Registration**: Easy registration system with reason tracking
- **Dashboard Analytics**: Visual insights with charts and statistics
- **Participant Management**: View and manage event participants
- **Search & Filter**: Advanced filtering by location, date, and search terms

### User Roles & Permissions
- **Event Organizers**: Create and manage their own events, view participants
- **Attendees**: Browse events, register for events

### Technical Features
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Form Validation**: Client and server-side validation
- **Security**: Password hashing, JWT tokens, CORS protection

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: ShadeCN
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: Sonner (Toast notifications)
- **Charts**: Recharts for dashboard analytics

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with raw SQL queries
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcryptjs
- **Validation**: Zod schemas

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint
- **Build Tool**: Next.js built-in bundler
- **Process Manager**: Nodemon for development

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18.x or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (version 12 or higher)
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/aditya-krm/event-management.git>
cd event-management
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/event_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=24h

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Database Setup

```bash
# Initialize the database (creates tables and schema)
npm run init-db
```

### 5. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 6. Frontend Environment Configuration

Create a `.env.local` file in the `client` directory:

```env
# API Configuration
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start the Backend Server
```bash
cd server
npm run dev
```
The API server will start on `http://localhost:5000`

#### Start the Frontend Development Server
```bash
cd client
npm run dev
```
The web application will be available at `http://localhost:3000`

### Production Mode

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
cd client
npm run build
npm start
```

## 📁 Project Structure

```
event-management/
├── client/                     # Frontend Next.js application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   ├── events/        # Event-related pages
│   │   │   ├── login/         # Authentication pages
│   │   │   └── register/
│   │   ├── components/        # Reusable React components
│   │   │   └── ui/            # UI component library
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions and API client
│   │   ├── store/             # Zustand state management
│   │   └── types/             # TypeScript type definitions
│   ├── package.json
│   └── tailwind.config.js
├── server/                     # Backend Node.js application
│   ├── controllers/           # Request handlers
│   ├── middlewares/           # Express middlewares
│   ├── models/                # Database models
│   ├── routes/                # API route definitions
│   ├── db.js                  # Database connection
│   ├── schema.sql             # Database schema
│   ├── server.js              # Express server entry point
│   └── package.json
└── README.md
```

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Event Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get all events | No |
| POST | `/api/events` | Create new event | Yes |
| GET | `/api/events/:id` | Get event by ID | No |
| PUT | `/api/events/:id` | Update event | Yes (Owner) |
| DELETE | `/api/events/:id` | Delete event | Yes (Owner) |

### Registration Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/events/:id/register` | Register for event | Yes |
| GET | `/api/events/:id/participants` | Get event participants | Yes (Owner) |
| DELETE | `/api/registrations/:id` | Cancel registration | Yes (Owner/Creator) |
| GET | `/api/registrations/user` | Get user registrations | Yes |

### Request/Response Examples

#### Register for Event
```bash
POST /api/events/123/register
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "reason": "I'm interested in learning about this topic"
}
```

#### Create Event
```bash
POST /api/events
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "React Conference 2024",
  "description": "Annual React developer conference",
  "date": "2024-12-15T10:00:00Z",
  "location": "San Francisco, CA"
}
```

## 🌐 Deployment

### AWS Deployment with Nginx

This application is designed to be deployed on AWS with Nginx as a reverse proxy. Here's a high-level deployment strategy:

#### Backend Deployment
1. **EC2 Instance**: Deploy the Node.js backend on an EC2 instance
2. **PostgreSQL**: Use NeonDB for the PostgreSQL database
3. **Environment Variables**: Configure production environment variables
4. **PM2**: Use PM2 for process management in production

#### Frontend Deployment
1. **Vercel**:  deployment on Vercel platform
2. **Cloudflare**: for caching and proxies

#### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name https://apievm.krmsolutions.in;

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Environment Variables for Production

#### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@rds-endpoint:5432/event_management
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRY=24h
PORT=5000
NODE_ENV=production
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_API_URL=https://apievm.krmsolutions.in/api
```

## 📊 Database Schema

The application uses a PostgreSQL database with the following main tables:

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `name`
- `created_at`
- `updated_at`

### Events Table
- `id` (UUID, Primary Key)
- `name`
- `description`
- `date`
- `location`
- `created_by` (Foreign Key to Users)
- `created_at`
- `updated_at`

### Registrations Table
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key to Users)
- `event_id` (Foreign Key to Events)
- `registration_date`
- `reason`
- Unique constraint on (user_id, event_id)

### Code Style & Guidelines
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and TypeScript
- **Prettier**: Recommended for code formatting
- **Component Structure**: Organized by feature and reusability
- **API Structure**: RESTful design with proper HTTP status codes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write descriptive commit messages
- Add comments for complex logic
- Include error handling for all API calls
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Port Already in Use
```bash
# Find process using port 3000 or 5000
lsof -i :3000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

#### CORS Issues
- Ensure `FRONTEND_URL` is correctly set in backend environment
- Check that the frontend is making requests to the correct API URL

## 👨‍💻 Author

**Aditya Karmakar**
- Email: adkarmakar521@gmail.com
- GitHub: https://github.com/aditya-krm

## 🎯 Future Enhancements

- [ ] Email notifications for event updates
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Event categories and tags
- [ ] File upload for event images
- [ ] Social media integration
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Payment integration for paid events
- [ ] Real-time chat for events

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository
4. Contact the development team

---

**Happy Event Managing! 🎉**
