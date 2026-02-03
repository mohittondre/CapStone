# YouTube Clone

A full-stack YouTube clone application built with React and Node.js.

## Links

- **GitHub Repository**: https://github.com/mohittondre/CapStone
- **Live Demo**: https://your-youtube-clone.vercel.app

## Project Structure

```
CapStone/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite application
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on **http://localhost:5000**

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend application will be available at **http://localhost:5173**

## Features

- User authentication (register/login)
- Video browsing and search
- Video details with comments
- Channel creation and viewing
- Like videos

## Tech Stack

**Backend:**
- Node.js + Express
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

**Frontend:**
- React 19
- Vite
- CSS for styling

## Quick Start (Run Both)

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

Then open http://localhost:5173 in your browser.

## Sample Test Accounts

- **john@example.com** / password123
- **jane@example.com** / password123

