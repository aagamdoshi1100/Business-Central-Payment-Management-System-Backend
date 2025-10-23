# 🧾 Business Central Payment Management System

A full-stack **MERN + React (MUI)** application for managing cases, agents, payments, and transactions.  
This project implements pagination, authentication, and form validations using **React Hook Form**, **Axios**, **Zod**, and **Express.js**.

---

## 🚀 Tech Stack

### 🖥️ Frontend

- **React.js** (with Hooks & Context API)
- **Material UI (MUI)** for responsive UI components
- **React Hook Form** for form management and validation
- **Zod** for schema-based validation
- **Axios** for API communication
- **React Toastify** for notifications
- **Context API** for Global State

### ⚙️ Backend

- **Node.js** with **Express.js**
- **MongoDB + Mongoose**
- **Zod** for backend validation
- **CORS**, **dotenv**, and **morgan** middlewares
- **Modular controllers and routes** for clarity

## 📄 Postman collection

https://documenter.getpostman.com/view/23649133/2sB3QRp87g

## 🔐 Authentication Flow

- `AuthContext` manages login state.
- Stores authenticated user globally.
- Redirects users to `/dashboard` after successful login.

## 📄 Pagination Logic

Pagination is handled via a **custom hook**:

```js
const {
  totalCount,
  loading,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  refresh,
} = usePaginatedData("cases");
```

Each page fetches fresh data from backend using:

```
GET /cases?page={page}&limit={limit}
```

---

## ⚙️ Environment Variables (`.env`)

```bash
NODE_ENV=development
PORT="3000"   [Backend Port]
VITE_API_URL=3000
MONGO_URI=mongodb+srv://your_mongo_connection
JWT_SECRET=your_jwt_secret
FRONTEND_URL="http://localhost:5173"
```

---

## 🧩 Setup Instructions

### 1️⃣ Clone and Run Repository

```bash
# Client
git clone https://github.com/aagamdoshi1100/Business-Central-Payment-Management-System-Frontend.git
cd Business Central Payment Management System Frontend
npm install
npm run dev

# Server
git clone https://github.com/aagamdoshi1100/Business-Central-Payment-Management-System-Backend.git
cd Business Central Payment Management System Backend
npm install
npm run dev
---

## 🧠 Key Features

✅ Paginated case management
✅ Agent assignment and tracking
✅ Payment confirmation with details view
✅ Validation with `Zod` and `React Hook Form`
✅ Toast notifications
✅ Modularized Context and API handling
✅ Fully responsive Material UI layout
✅ Debouncing for work id verification

---

## 👨‍💻 Author

**Aagam Doshi**
Full Stack Developer (MERN, Next.js, AWS, GCP, Docker)
🚀 _ACL Digital_
📧 Email: aagamdoshi1100@gmail.com

---

> “Code. Automate. Scale.” — Built with ❤️ using React + Node.js
```
