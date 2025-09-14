# Acquisitions API

A Node.js REST API built with Express.js for user authentication and acquisitions management, featuring JWT-based authentication and secure session management.

## 🏗️ Architecture

- **Framework**: Express.js with ES6 modules
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with secure HTTP-only cookies
- **Validation**: Zod schema validation
- **Logging**: Winston structured logging
- **Security**: bcrypt password hashing, Helmet security headers

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development without Docker)
- Neon Database account (for production)

## 🐳 Docker Setup

This application supports two deployment modes:

### 🔧 Development Environment (with Neon Local)

For local development, the application uses **Neon Local** - a Docker-based proxy that provides a local PostgreSQL environment compatible with Neon Cloud.

#### Quick Start - Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sysskp/acquistions.git
   cd acquisitions
   ```

2. **Start the development environment**
   ```bash
   # Build and start both Neon Local and the application
   docker-compose -f docker-compose.dev.yml up --build
   
   # Or run in detached mode
   docker-compose -f docker-compose.dev.yml up --build -d
   ```

3. **Run database migrations**
   ```bash
   # Access the running container and run migrations
   docker exec -it acquisitions-app-dev npm run db:migrate
   
   # Or generate new migrations after schema changes
   docker exec -it acquisitions-app-dev npm run db:generate
   ```

4. **Access the application**
   - API: http://localhost:3000
   - Health check: http://localhost:3000/health
   - Database: localhost:5432 (accessible from host)

#### Development Environment Details

- **Neon Local**: Runs a PostgreSQL-compatible proxy on port 5432
- **Hot Reloading**: Source code is mounted as a volume for instant updates
- **Database**: Automatically initialized with the `acquisitions` database
- **Logging**: Debug level logging with console and file output
- **Network**: Both services communicate via `acquisitions-dev-network`

### 🚀 Production Environment (with Neon Cloud)

For production, the application connects directly to your Neon Cloud Database.

#### Prerequisites - Production

1. **Neon Cloud Database**
   - Create a Neon project at https://neon.tech
   - Get your DATABASE_URL from the Neon dashboard
   
2. **Environment Variables**
   - Set production environment variables (see configuration section)

#### Quick Start - Production

1. **Set environment variables**
   ```bash
   # Create a .env file or export environment variables
   export DATABASE_URL="postgresql://neondb_owner:your_password@your-project.aws.neon.tech/neondb?sslmode=require"
   export JWT_SECRET="your_super_secure_jwt_secret_minimum_32_characters"
   export CORS_ORIGIN="https://yourdomain.com"
   ```

2. **Start the production environment**
   ```bash
   # Build and start the production application
   docker-compose -f docker-compose.prod.yml up --build
   
   # Or run in detached mode with nginx (optional)
   docker-compose -f docker-compose.prod.yml --profile nginx up --build -d
   ```

3. **Run database migrations**
   ```bash
   # Run migrations against Neon Cloud DB
   docker exec -it acquisitions-app-prod npm run db:migrate
   ```

#### Production Environment Details

- **Database**: Direct connection to Neon Cloud via SSL
- **Security**: Enhanced security with read-only filesystem, resource limits
- **Logging**: Info level logging with file rotation
- **Health Checks**: Extended intervals for production stability
- **Nginx**: Optional reverse proxy for SSL termination and load balancing

## ⚙️ Configuration

### Environment Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `NODE_ENV` | `development` | `production` | Application environment |
| `PORT` | `3000` | `3000` | Server port |
| `DATABASE_URL` | `postgresql://postgres:postgres@neon-local:5432/acquisitions` | Your Neon Cloud URL | Database connection string |
| `JWT_SECRET` | `dev_jwt_secret` | **Required** | JWT signing secret |
| `LOG_LEVEL` | `debug` | `info` | Logging level |
| `CORS_ORIGIN` | `http://localhost:3000` | Your domain | CORS allowed origin |

### Database Configuration

#### Development (Neon Local)
```bash
DATABASE_URL=postgresql://postgres:postgres@neon-local:5432/acquisitions
```

#### Production (Neon Cloud)
```bash
DATABASE_URL=postgresql://neondb_owner:password@your-project.aws.neon.tech/neondb?sslmode=require
```

## 🔍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Root endpoint |
| `GET` | `/health` | Health check |
| `GET` | `/api` | API status |
| `POST` | `/api/auth/sign-up` | User registration |
| `POST` | `/api/auth/sign-in` | User login |
| `POST` | `/api/auth/sign-out` | User logout |

### Example API Usage

#### User Registration
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🛠️ Development Commands

### Local Development (Non-Docker)

```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm run dev

# Run database migrations
npm run db:migrate

# Generate new migration
npm run db:generate

# Open Drizzle Studio (database GUI)
npm run db:studio

# Linting and formatting
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

### Docker Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop and remove containers
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Access application container
docker exec -it acquisitions-app-dev sh

# Run database commands in container
docker exec -it acquisitions-app-dev npm run db:migrate
docker exec -it acquisitions-app-dev npm run db:generate
```

### Production Docker Commands

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up --build -d

# Start with nginx reverse proxy
docker-compose -f docker-compose.prod.yml --profile nginx up --build -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f app

# Scale the application (if using orchestration)
docker-compose -f docker-compose.prod.yml up --scale app=3
```

## 📁 Project Structure

```
acquisitions/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # Database connection
│   │   └── logger.js    # Winston logger setup
│   ├── controllers/     # Route controllers
│   │   └── auth.controller.js
│   ├── models/          # Database models (Drizzle schemas)
│   │   └── user.model.js
│   ├── routes/          # API routes
│   │   └── auth.routes.js
│   ├── services/        # Business logic
│   │   └── auth.service.js
│   ├── utils/           # Utility functions
│   │   ├── cookies.js   # Cookie management
│   │   ├── format.js    # Data formatting
│   │   └── jwt.js       # JWT utilities
│   ├── validations/     # Input validation schemas
│   │   └── auth.validation.js
│   ├── app.js          # Express application setup
│   ├── index.js        # Application entry point
│   └── server.js       # Server startup
├── drizzle/            # Database migrations
├── logs/               # Application logs
├── docker-compose.dev.yml   # Development Docker Compose
├── docker-compose.prod.yml  # Production Docker Compose
├── Dockerfile               # Multi-stage Docker build
├── .env.development        # Development environment vars
├── .env.production         # Production environment template
└── package.json
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 rounds
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Security Headers**: Helmet middleware for common vulnerabilities
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configurable CORS origins
- **Rate Limiting**: (Ready for implementation)

## 🚨 Production Security Checklist

Before deploying to production, ensure:

- [ ] Strong `JWT_SECRET` (minimum 32 characters)
- [ ] Secure `DATABASE_URL` with SSL enabled
- [ ] Proper `CORS_ORIGIN` configuration
- [ ] Environment variables injected securely (not in .env files)
- [ ] SSL certificates configured (if using nginx)
- [ ] Database credentials rotated regularly
- [ ] Log monitoring and alerting set up
- [ ] Resource limits configured appropriately
- [ ] Health check endpoints accessible for monitoring

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check if Neon Local is running
docker ps | grep neon-local

# Check database connectivity
docker exec -it acquisitions-neon-local psql -U postgres -d acquisitions -c "SELECT 1;"
```

**Application Won't Start**
```bash
# Check application logs
docker logs acquisitions-app-dev

# Verify environment variables
docker exec -it acquisitions-app-dev env | grep DATABASE_URL
```

**Migrations Not Running**
```bash
# Run migrations manually
docker exec -it acquisitions-app-dev npm run db:migrate

# Check migration status
docker exec -it acquisitions-app-dev npm run db:studio
```

### Health Check Endpoints

- **Application Health**: `GET /health`
- **Database Connectivity**: Included in health check response
- **Docker Health**: `docker ps` shows health status

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- [Neon Database Documentation](https://neon.tech/docs)
- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Express.js Documentation](https://expressjs.com)