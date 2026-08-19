# TaskMaster Pro - SaaS Task Management Application

A full-stack, production-quality SaaS Task Management Web Application built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB** (with Mongoose & automatic zero-config fallback), **JWT Authentication**, and **Socket.IO** real-time updates.

---

## 🌟 Major Features

- **Authentication & Security**:
  - Secure User Registration & Login with JWT token authorization.
  - Password hashing using `bcryptjs`.
  - Protected API routes & strict user-task ownership isolation (User A cannot access or modify User B's tasks).

- **Task CRUD Operations**:
  - Create, view, edit, and delete tasks.
  - Quick status updates (`Pending`, `In Progress`, `Completed`) directly from grid cards or tabular list.
  - Task priority tagging (`High`, `Medium`, `Low`).
  - Dynamic Overdue calculation (`dueDate < current_date` AND `status != 'Completed'`).

- **Interactive SaaS Dashboard**:
  - Dynamic statistic summary cards (Total Tasks, Pending, In Progress, Completed, Overdue).
  - Responsive layout with toggleable **Grid View** and **Table View**.
  - Real-time instant sync across multiple tabs/clients via **Socket.IO** (room-authenticated).

- **Search, Filtering & Sorting**:
  - Live search by task title or description.
  - Filter tasks by Status, Priority, and Overdue toggle.
  - Multi-criteria sorting (Newest, Oldest, Due Date, Priority).

- **Modern Responsive SaaS UI/UX**:
  - Custom Tailwind CSS styling with dark slate backdrop, glassmorphism panels, soft borders, and micro-animations.
  - Toast notification system for instant action feedback.
  - Confirmation dialog modals before deleting tasks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router 6, Tailwind CSS, Lucide Icons, Axios, Socket.IO Client |
| **Backend** | Node.js, Express.js, Express Validator, JSON Web Tokens (JWT), BcryptJS, Socket.IO |
| **Database** | MongoDB, Mongoose ODM (*with automatic `mongodb-memory-server` fallback*) |

---

## 📁 Project Structure

```text
task-management-app/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Common UI, Dashboard, Task & Layout Components
│   │   ├── context/            # AuthContext & TaskContext
│   │   ├── pages/              # Login, Register, Dashboard, NotFound
│   │   ├── services/           # Axios API client & Socket.IO service
│   │   ├── utils/              # Date formatting & overdue calculation helpers
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── server/                     # Express.js REST API & Socket.IO Backend
│   ├── config/                 # MongoDB database connection
│   ├── controllers/            # Auth & Task controllers
│   ├── middleware/             # JWT Auth, Input Validation & Error Handling
│   ├── models/                 # Mongoose User & Task schemas
│   ├── routes/                 # Express API routes
│   ├── socket/                 # Socket.IO connection & room handler
│   ├── seed.js                 # Demo data seeder script
│   ├── server.js               # Main HTTP & Socket server
│   └── package.json
│
├── README.md
└── package.json                # Root package with workspace scripts
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Clone & Install Dependencies

In the project root directory, run:

```bash
# Install root, server, and client dependencies concurrently
npm run install:all
```

Alternatively, install dependencies in each directory manually:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

---

## 🔑 Environment Variables Setup

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=task_management_app_jwt_secret_key_2026_super_secure
CLIENT_URL=http://localhost:5173
```

*Note: If no external MongoDB daemon is running at `MONGODB_URI`, the server will automatically spin up an in-memory MongoDB instance (`mongodb-memory-server`) for frictionless zero-setup execution.*

---

## 🏃 Running the Application

### 1. Seed Demo Data (Optional but Recommended)

To populate the database with a pre-configured demo user and sample tasks across various statuses:

```bash
npm run seed
```

**Demo User Credentials:**
- **Email:** `demo@example.com`
- **Password:** `Demo@123`

### 2. Launch Client & Server Concurrently

Run the dev server command from the root directory:

```bash
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🔌 API Endpoints Documentation

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Yes |

### Task Routes (`/api/tasks`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get user tasks (supports search, filters & sort) | Yes |
| `GET` | `/api/tasks/stats` | Get dynamic dashboard metric counts | Yes |
| `GET` | `/api/tasks/:id` | Get single task details | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `PUT` | `/api/tasks/:id` | Update task details | Yes |
| `PATCH` | `/api/tasks/:id/status` | Update task status (`Pending`/`In Progress`/`Completed`) | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |

---

## ⚡ Real-Time Events (Socket.IO)

Connected clients join room `user:<userId>`. The server emits the following real-time events upon task operations:

- `taskCreated`: Emitted when a new task is created.
- `taskUpdated`: Emitted when a task is updated.
- `taskStatusChanged`: Emitted when status changes.
- `taskDeleted`: Emitted with `{ taskId }` when a task is deleted.

---

## 🧪 Verification & Testing

To test the application end-to-end:
1. Run `npm run seed` in terminal.
2. Start the application with `npm run dev`.
3. Open `http://localhost:5173` in your browser.
4. Register a new user or sign in with your registered account.
5. Create, edit, search, filter, and delete tasks.
6. Verify overdue task badge highlight for tasks past their due date.
