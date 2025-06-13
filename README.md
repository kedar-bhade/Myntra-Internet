# Myntra Demo Full Stack Application

This repository contains a minimal Myntra-like application with a C# backend and React frontend. It demonstrates a simple catalogue and cart similar to a basic e-commerce site.

## Backend

The backend is an ASP.NET Core Web API (targeting **.NET 9.0**) located in the `backend` directory.

### Run Backend
```bash
cd backend
# restore packages and run on http://localhost:5000
dotnet run --urls http://localhost:5000
```

## Frontend

The frontend is a React application created with Vite in the `frontend` directory.

The frontend uses **React 19** via Vite.

### Install and Run Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend is configured to proxy API requests to `http://localhost:5000`.

## Features
- In-memory product, category and cart APIs
- Remote product images
- React interface with product grid and shopping cart

This is a lightweight starting point. Extend it further to add authentication or persistent storage as required.
