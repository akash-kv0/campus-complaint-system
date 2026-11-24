# File: app.js

Functions:

Creates and configures the Express application and middleware (CORS, JSON parsing)

Registers the application API routes

Loads environment variables via .env

Exports the Express application without connecting to MongoDB or listening on a port

Key Points:

Uses express for backend framework

Uses mongoose for database connection

Uses socket.io for live updates between users and admins

Loads config securely using dotenv

The HTTP server is started by index.js only after the initial MongoDB connection succeeds

# File: index.js

Functions:

Loads environment variables and validates startup configuration

Awaits the initial MongoDB connection before starting the HTTP listener

Reports startup failures without exposing the MongoDB connection URI

Closes the HTTP server and MongoDB connection on SIGINT or SIGTERM

# File: config/db.js

Functions:

Establishes MongoDB connection using Mongoose

Returns a promise that resolves after the initial connection succeeds and rejects on failure

Logs successful connection status without terminating the process on failure

Key Points:

Centralized DB connection for better reusability

Uses process.env.MONGO_URI for connection string

Exports the single connect function used by index.js

# File: routes/auth.js

Functions:

Defines routes for registration, login, and user profile

Protects private routes using authMiddleware

Provides endpoints for admin to view staff list

Key Points:

Uses express.Router() for modular route handling

Imports controllers for logic separation

Includes role-based protection using isAdmin middleware

