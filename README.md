<h1 align="center">Smart Campus Complaint System</h1>

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-17.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green)
![License](https://img.shields.io/badge/License-MIT-blue)

**A comprehensive complaint management platform for educational institutions with role-based access control, real-time tracking, and automated workflows.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

##  Screenshots

<div align="center">
  <img 
    src="https://github.com/user-attachments/assets/48127d29-d387-4ce2-85cb-0a2356d05b18"
    alt="Smart Campus Complaint System Landing Page"
    width="900"
  />
  <p><i>Smart Campus Complaint System – Landing Page</i></p>
</div>


---

## 📋 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

Smart Campus Complaint System is a full-stack web application designed to streamline complaint management in educational institutions. Students can submit complaints with image attachments, staff members can update assigned complaints, and administrators can manage complaint workflows and view protected aggregate statistics.

The system implements student, staff, and administrator roles with JWT authentication, complaint status updates, email notifications, and a feedback mechanism. Complaint images are stored in a private Amazon S3 bucket and delivered through expiring signed URLs.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control** - Student and staff self-registration; administrator accounts must be provisioned separately
- **JWT Token Management** - API requests use JWTs in the `Authorization: Bearer <token>` header; tokens expire after one hour
- **Password Encryption** - bcryptjs hashing for secure credential storage
- **Protected Routes** - Middleware-based route protection based on user roles

### 📝 Complaint Management
- **Complaint Submission** - Create complaints with title, description, category, urgency level, and image attachments
- **Status Tracking** - Three-tier status workflow: `pending` → `in-progress` → `resolved`
- **Private Image Storage** - Multer buffers image uploads and sends them to private S3 storage; complaint responses contain signed image URLs that expire after one hour
- **Urgency Levels** - Configurable due dates (1, 2, or 3+ days)

### 👥 Staff Operations
- **Assigned Complaints Dashboard** - View and manage complaints assigned to staff members
- **Progress Updates** - Add photos and remarks during complaint resolution
- **Status Updates** - Update complaint status with detailed notes

### 👨‍💼 Admin Dashboard
- **Complaint Overview** - View all complaints with filtering and search capabilities
- **Staff Assignment** - Assign complaints to available staff members
- **Statistics & Analytics** - Complaint, user-count, and response-time aggregates restricted to authenticated administrators
- **Staff Assignment** - Retrieve the staff list for assigning complaints

### 💬 Feedback System
- **Rating System** - 5-star rating mechanism for resolved complaints
- **Comments** - Textual feedback submission
- **Performance Tracking** - Monitor staff and system performance

### 📧 Notifications
- **Email Integration** - Automated email notifications via Nodemailer
- **Resolution Alerts** - Notify users when complaints are resolved

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 17.0.2 | UI framework |
| **React Router DOM** | 5.3.4 | Client-side routing |
| **Axios** | 0.21.4 | HTTP client for API calls |
| **Bootstrap** | 5.3.7 | CSS framework for responsive design |
| **JWT Decode** | 4.0.0 | Token decoding for authentication |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 4.21.2 | Web application framework |
| **Mongoose** | 5.13.23 | MongoDB object modeling |
| **jsonwebtoken** | 8.5.1 | JWT token generation and verification |
| **bcryptjs** | 2.4.3 | Password hashing |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **MongoDB** | 5.0+ | NoSQL database for data persistence |

### Tools & Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| **Multer** | 1.4.4 | File upload middleware |
| **Nodemailer** | 7.0.4 | Email service integration |
| **dotenv** | 10.0.0 | Environment variable management |
| **CORS** | 2.8.5 | Cross-origin resource sharing |

---

## 🏗 Architecture

The application follows a **three-tier architecture** pattern:

```
┌─────────────────┐
│   React Client  │  (Port configured at startup; local CORS origin: 3000)
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/REST API
         │ (Axios)
┌────────▼────────┐
│  Express Server │  (Port 5000)
│   (Backend)     │
└────────┬────────┘
         │ Mongoose ODM
┌────────▼────────┐
│    MongoDB      │
│   (Database)    │
└─────────────────┘
```

**Data Flow:**
1. **Frontend (React)** - User interactions trigger API calls via Axios
2. **Backend (Express)** - RESTful API endpoints handle business logic and authentication
3. **Database (MongoDB)** - Data persistence with Mongoose schemas
4. **Authentication** - JWT tokens stored in localStorage, validated via middleware
5. **File Storage** - Multer validates and buffers JPEG, PNG, and WebP uploads (maximum 5 MB); the backend stores them in a private S3 bucket and returns one-hour signed URLs when reading complaints
6. **Email Service** - Nodemailer sends resolution and assignment notifications

---

## 📦 Prerequisites

Before installation, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Install Dependencies

Install server dependencies:

```bash
cd server
npm install
```

Install client dependencies:

```bash
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `server/.env` using the variables described in [Configuration](#-configuration). Do not commit this file. The root `.gitignore` excludes `.env` files.

For local development, `client/.env` sets `REACT_APP_API_URL=http://localhost:5000/api`, and the backend uses `FRONTEND_URL=http://localhost:3000`. Restart the relevant development server after changing environment variables.

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

**MongoDB Atlas:**
- Use your Atlas connection string in `MONGO_URI`

### 4. Run the Application

**Start the backend server:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Start the frontend client (in a new terminal):**

The backend CORS setting is configured for the local frontend origin `http://localhost:3000`. Start CRA on that port:

PowerShell:
```powershell
cd client
npm start
# Client runs on http://localhost:3000
```

macOS/Linux:
```bash
cd client
PORT=3000 npm start
```

Open `http://localhost:3000` in your browser.

---

## ⚙️ Configuration

### Environment Variables

Create a private `server/.env` file and set the variables required by the deployment:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Local MongoDB URI or MongoDB Atlas URI |
| `JWT_SECRET` | Secret used to sign and verify JWTs | Set a long, unique secret outside source control |
| `PORT` | Server port number | `5000` |
| `FRONTEND_URL` | Exact allowed browser origin for CORS, without a path | `http://localhost:3000` |
| `EMAIL_USER` | Email account used for notifications | Set in deployment environment |
| `EMAIL_PASS` | Email account app password | Keep secret; set outside source control |
| `AWS_REGION` | S3 bucket region | Your bucket's AWS region |
| `AWS_S3_BUCKET` | Private S3 bucket name | Your bucket name |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Optional AWS SDK environment credentials | Prefer an IAM role in production; never commit credentials |

`server/.env.example` contains a non-secret local CORS origin example, not a complete secrets template. The root `.gitignore` excludes `.env` and `.env.*` while allowing `.env.example`.

The frontend uses Create React App environment variables:

| File/variable | Purpose |
|---------------|---------|
| `client/.env` / `REACT_APP_API_URL` | Local backend API base URL, including `/api` |
| `client/.env.production` / `REACT_APP_API_URL` | Set the production backend API base URL before building; it is blank until the deployed URL is known |

`client/src/config.js` is the central source for this API base URL. Restart the development server after changing `.env`; production variables are embedded when the frontend is built.

The public registration endpoint accepts only `student` and `staff` roles. It does not create administrators. Provision administrator accounts through a trusted database/admin process with a bcrypt-hashed password and `role: "admin"`; do not enable public admin registration.


### MongoDB Connection

**Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/smart-campus-complaints
```

**MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-campus-complaints?retryWrites=true&w=majority
```

### Email Configuration (Gmail Example)

1. Enable 2-Step Verification on your Google Account
2. Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the generated password in `EMAIL_PASS`

---

## 💻 Usage

### User Roles

#### 👨‍🎓 Student
- Register/Login at `/register/student` or `/login/student`
- Submit new complaints at `/complaints/new`
- View personal complaints at `/my-complaints`
- Track complaint status and updates
- Submit feedback on resolved complaints

#### 👨‍🏫 Staff
- Register/Login at `/register/staff` or `/login/staff`
- Access dashboard at `/staff/dashboard`
- View assigned complaints
- Update complaint status with photos and remarks
- Track resolution progress

#### 👨‍💼 Administrator
- Login at `/login/admin` with an administrator account provisioned through a trusted process
- Access admin dashboard at `/admin/dashboard`
- View all complaints across the system
- Assign complaints to staff members
- Update complaint statuses
- View statistics and analytics
- View staff options for complaint assignment

### API Endpoints

See [API Documentation](#-api-documentation) for complete endpoint details.

---

## 📁 Project Structure

```
smart-campus-complaint-system/
│
├── client/                          # React frontend application
│   ├── .env                          # Local REACT_APP_API_URL (ignored by Git)
│   ├── .env.example                  # Non-secret frontend config example
│   ├── .env.production               # Set deployed API URL before production build
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── config.js                 # API base URL from REACT_APP_API_URL
│   │   ├── api/
│   │   │   └── auth.js             # API service functions
│   │   ├── assets/
│   │   │   └── logo.jpeg           # Application logo
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx       # Login component
│   │   │   │   └── Register.jsx   # Registration component
│   │   │   ├── Complaint/
│   │   │   │   └── ComplaintForm.jsx  # Complaint submission form
│   │   │   └── Navbar.jsx          # Navigation bar
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  # Admin dashboard page
│   │   │   ├── CenterPage.jsx      # Center page component
│   │   │   ├── ComplaintDetail.jsx # Complaint details view
│   │   │   ├── Home.jsx            # Home page
│   │   │   ├── MyComplaints.jsx    # User's complaints list
│   │   │   └── StaffDashboard.jsx  # Staff dashboard page
│   │   ├── App.jsx                 # Main application component
│   │   ├── index.jsx               # Application entry point
│   │   └── index.css               # Global styles
│   ├── package.json                # Frontend dependencies
│   └── README.md                   # Client-specific README
│
├── server/                          # Express backend application
│   ├── config/
│   │   └── db.js                   # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── complaintController.js  # Complaint business logic
│   │   └── feedbackController.js   # Feedback handling
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT authentication middleware
│   │   ├── isAdmin.js              # Admin role verification
│   │   ├── isStaff.js              # Staff role verification
│   │   └── upload.js               # Multer file upload configuration
│   ├── models/
│   │   ├── Complaint.js            # Complaint data model
│   │   ├── Feedback.js             # Feedback data model
│   │   └── User.js                 # User data model
│   ├── routes/
│   │   ├── auth.js                 # Authentication routes
│   │   ├── complaint.js            # Complaint routes
│   │   ├── feedback.js             # Feedback routes
│   │   └── stats.js                # Statistics routes
│   ├── utils/
│   │   ├── emailTest.js            # Email testing utility
│   │   ├── mailer.js               # Email service configuration
│   │   └── s3.js                   # Private S3 upload and signed URL helpers
│   ├── app.js                      # Express application entry point
│   ├── package.json                # Backend dependencies
│   ├── .env.example                # Non-secret CORS origin example
│   └── .env                        # Environment variables (not in repo)
│
├── ClientSide.md                    # Client-side documentation
├── ServerSide.md                    # Server-side documentation
│
├── .gitignore                       # Git ignore rules
├── package.json                     # Root package.json
└── README.md                        # This file
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@student.edu",
  "password": "password123",
  "department": "Computer Science",
  "role": "student"
}
```

Public registration accepts `student` and `staff` roles only. Administrator accounts must be provisioned separately through a trusted process.

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@student.edu",
  "password": "password123",
  "role": "student"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Complaint Endpoints

#### Create Complaint
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Broken Wi-Fi in Library",
  "description": "Wi-Fi connection is unstable",
  "category": "Infrastructure",
  "dueInDays": 2,
  "image": <file>
}
```

The optional `image` field accepts JPEG, PNG, or WebP files up to 5 MB. Files are uploaded to private S3 storage; complaint read responses return signed URLs that expire after one hour.

#### Get User's Complaints
```http
GET /api/complaints/my
Authorization: Bearer <token>
```

#### Get All Complaints (Admin)
```http
GET /api/complaints
Authorization: Bearer <token>
```

#### Get Complaint by ID
```http
GET /api/complaints/:id
Authorization: Bearer <token>
```

#### Assign Complaint to Staff
```http
PUT /api/complaints/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "staffId": "staff_user_id"
}
```

#### Update Complaint Status
```http
PUT /api/complaints/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress"
}
```

#### Staff Update Complaint
```http
POST /api/complaints/:id/staff-update
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "remarks": "Issue resolved",
  "photo": <file>
}
```

### Statistics Endpoints

All statistics endpoints require a valid JWT belonging to an administrator. Send it in the `Authorization: Bearer <token>` header.

Requests without a token, or with an invalid or expired token, return `401 Unauthorized`. A valid student or staff token returns `403 Forbidden`.

The complaint statistics response contains `total`, `resolved`, and `avgResponseTime` (hours). The user statistics response contains only the `total`, `students`, and `staff` counts.

#### Get Complaint Statistics
```http
GET /api/stats/complaints
Authorization: Bearer <token>
```

#### Get User Statistics
```http
GET /api/stats/users
Authorization: Bearer <token>
```

The legacy aliases `GET /api/complaints/stats` and `GET /api/auth/stats` use the same admin authorization.

### Feedback Endpoints

#### Submit Feedback
```http
POST /api/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "complaintId": "complaint_id",
  "rating": 5,
  "comment": "Excellent service!"
}
```

---

## 🚢 Deployment

### Backend Deployment

1. Set `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, email settings, AWS region and S3 bucket settings in the hosting platform.
2. Set `FRONTEND_URL` to the exact production frontend origin, including scheme and any non-default port, with no path. CORS allows that origin only and does not enable cookie credentials.
3. Use a private MongoDB deployment and least-privilege access to the private S3 bucket. Do not commit secrets.
4. Configure the host to install dependencies in `server/` and start the application with `npm start` (or `npm run dev` for local development).

### Frontend Deployment

1. Set `REACT_APP_API_URL` in the frontend hosting environment to the backend API base URL ending in `/api` (for example, `https://<backend-host>/api`). `client/src/config.js` reads this value for frontend API requests.
2. Set the variable before building; Create React App embeds `REACT_APP_*` variables at build time. The local `client/.env.production` is intentionally blank until the real backend URL is known.
3. **Build the application:**

```bash
cd client
npm run build
```

4. Deploy the generated `client/build` folder to a static hosting provider.

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform's dashboard.

---

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: MongoDB connection failed
```
**Solution:** Verify `MONGO_URI` in `.env` file and ensure MongoDB is running.

#### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:** Change `PORT` in `.env` or kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

#### JWT Token Expired
```
Error: Token expired
```
**Solution:** Log out and log in again to generate a new token.

#### File Upload or Image Display Fails
```
Error: Multer error
```
**Solution:** Check the backend's AWS region and bucket settings, and verify the server identity has S3 object write/read permissions. Keep the bucket private; image signed URLs expire after one hour.

#### CORS Error
```
Error: CORS policy blocked
```
**Solution:** Verify CORS is enabled in `server/app.js` and frontend URL is whitelisted.
Set `FRONTEND_URL` to the exact frontend origin (local development: `http://localhost:3000`) and `REACT_APP_API_URL` to the backend API base URL. Restart the backend after changing CORS configuration and restart CRA after changing client environment variables.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🙏 Acknowledgments

- MongoDB for the database solution
- React team for the amazing framework
- Express.js community for the robust backend framework
- All contributors and users of this project

---

<div align="center">

**Made with ❤️ by akash**

⭐ Star this repo if you find it helpful!

</div>
