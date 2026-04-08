# ProjectPro — Project Management System

A full-stack web application for managing projects, tasks, and team collaboration with role-based access control. Built with **Next.js 16**, **Prisma ORM**, **PostgreSQL**, and **Tailwind CSS**.

---

## 🚀 Features

- **Authentication** — Secure user registration & login with JWT-based session management and bcrypt password hashing.
- **Role-Based Access Control** — Admin, Project Manager, and Member roles with permission-based UI rendering.
- **Project Management** — Create, view, and manage multiple projects with team member assignment.
- **Task Management** — Create tasks with priority levels (Low / Medium / High), status tracking (Pending → In Progress → Completed), due dates, and task lists.
- **Team Collaboration** — Add members to projects, assign tasks, and post comments on tasks.
- **Dashboard Analytics** — Overview of total projects, pending/completed tasks, and productivity metrics.
- **Task History** — Audit trail tracking all task changes with timestamps.
- **User Settings** — Update profile information (username, email).
- **Responsive UI** — Clean, modern interface built with Tailwind CSS and Lucide icons.

---

## 🛠️ Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Frontend     | React 19, Next.js 16 (App Router)      |
| Styling      | Tailwind CSS 4, MUI Components         |
| Backend/API  | Next.js API Routes (RESTful)            |
| ORM          | Prisma 7                                |
| Database     | PostgreSQL                              |
| Auth         | JSON Web Tokens (JWT), bcrypt           |
| Language     | TypeScript                              |

---


## ⚙️ Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/project-management-system.git
cd project-management-system/project-manager

# 2. Install dependencies
npm install

# 3. Configure environment variables
#    Create a .env file with the following:
DATABASE_URL="postgresql://user:password@localhost:5432/projectpro"
JWT_SECRET="your-secret-key"

# 4. Generate Prisma client & push schema to database
npx prisma generate
npx prisma db push

# 5. Start the development server
npm run dev
```

The app will be running at **http://localhost:3000**

---

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Projects Page
![Projects](screenshots/project.png)

### Task Management
![Tasks](screenshots/task.png)

### User Management
![Users](screenshots/user.png)

---

## 👤 Default Roles

| Role             | Permissions                                |
| ---------------- | ------------------------------------------ |
| Admin            | Full access — manage users, roles, projects |
| Project Manager  | Create/manage projects and assign tasks     |
| Member           | View projects, update assigned tasks        |

---

## 📜 License

This project is for educational purposes.
