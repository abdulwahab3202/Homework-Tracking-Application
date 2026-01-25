# 📚 Student–Faculty Homework Tracking Application

A full-stack web application that streamlines homework management and academic interaction between students and faculty. Built using the MERN stack, the system enables faculty to post assignments and monitor completion while allowing students to view, submit, and track homework efficiently.

---

## 🚀 Features

### 👨‍🎓 Student
- View all assigned homework
- See due dates and status (Pending, Due Today, Overdue, Completed)
- Mark homework as completed
- Download attached files
- Add and view comments on homework
- Track personal completion status

### 👩‍🏫 Faculty
- Post new homework with optional file attachments and due dates
- View completion status of each homework
- See lists of completed and non-completed students
- Comment and interact with students
- Monitor overall student participation

### 🔐 Authentication & Security
- Role-based authentication (Student / Faculty)
- Protected routes
- Secure password handling
- Token-based session management

---

## 🛠 Technology Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (file uploads)

---

Homework-Tracking-Application/
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── .gitignore
│
├── backend/
│ ├── src/
│ ├── .gitignore
│
├── README.md


---

## ⚙️ Installation & Setup

### Backend
```bash
cd backend
npm install
npm start

### Frontend
cd frontend
npm install
npm start
