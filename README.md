
# 📦 Roxiler RateIt — Store Rating Platform

A full-stack web application where users can discover stores, rate them, and owners can manage ratings across multiple stores. Admins can manage users & stores with a powerful dashboard.

Built using:

- **React + Tailwind CSS**
- **Node.js + Express**
- **MySQL (mysql2/promise)**
- **REST API Architecture**

## 🚀 Features

### 🔐 Authentication
- Login / Signup
- Role-based access (USER / OWNER / ADMIN)
- Session handling with sessionStorage

### 🧑‍💼 Admin Dashboard
- Total Users, Stores, Ratings count
- Create Users
- Create Stores & assign Owner
- View user details
- Sortable + filterable table
- Modal UI for CRUD

### 🏪 Owner Dashboard
- Owners can have multiple stores
- View average rating
- List of raters for each store
- Clean table UI

### ⭐ User Dashboard
- Search stores by name/address
- View overall rating
- View/update your rating
- Modal-based star rating UI

### 🧑 Profile Page
- Update password
- Client-side validations

## 🛠 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router v6

### Backend
- Node.js
- Express.js
- MySQL2 (promise pool)
- MVC structure (controllers/models/routes)

## 📁 Folder Structure

```
root/
├── client/
│   ├── src/
│   └── .env
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
└── README.md
```

## ⚙️ Environment Variables

### Frontend (`client/.env`)
```
VITE_API_BASE=http://localhost:5000/api
```

### Backend (`backend/.env`)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=rateitdb
PORT=5000
```

## ▶️ Installation Guide

### Clone Repository
```
git clone https://github.com/yourusername/rateit-app.git
cd rateit-app
```

## Backend Setup
```
cd backend
npm install
npm start
```

## Frontend Setup
```
cd client
npm install
npm run dev
```

## 🔌 API Endpoints

### Auth
- POST /api/auth/login
- POST /api/auth/signup

### Admin
- GET /api/admin/stats
- GET /api/admin/users
- POST /api/admin/users
- GET /api/admin/users/:userId
- GET /api/admin/stores
- POST /api/admin/stores

### Owner
- GET /api/owner/:ownerId/dashboard

### Stores
- GET /api/stores
- POST /api/stores/:storeId/rating

### Users
- PUT /api/users/:userId/password

## 👨‍💻 Author
**Akash Raj**

## ⭐ Support
If you like this project, please star the repo!
