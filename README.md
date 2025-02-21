# Todo App Backend

This repository contains the backend server implementation for a Todo application built using Node.js, Express.js, MongoDB, and other technologies.

## Table of Contents

- [Introduction](#Introduction)
- [Features](#Features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#Contributing)

## View Live DEMO: 
[Click here to view LIVE](https://mytodo-pradip.vercel.app)

# Introduction

This backend server provides the core functionality for managing user authentication and tasks for a Todo application. It includes features such as user registration, login, task creation, updating, fetching, and deletion. The server is built with Node.js using Express.js framework and MongoDB as the database.

## Features

- User registration with email verification using OTP
- User login and logout with JWT-based authentication
- Resending verification OTP
- Creating, updating, fetching, and deleting tasks
- Profile picture upload and user information update

## Technologies Used

- Node.js
- Express.js
- MongoDB (mongoose ODM)
- JWT (JSON Web Tokens) for authentication
- bcrypt for password hashing
- Multer for file uploads
- Axios for HTTP requests
- dotenv for environment variables
- CORS for Cross-Origin Resource Sharing
- Other libraries and utilities for validation and error handling


# Setup Instructions

To run this project locally, follow these steps:

#### Clone the repository:

```bash
git https://github.com/singhpradip/Full-Stack-TODO-App-APIs.git
cd Full-Stack-TODO-App-APIs
```
#### Install dependencies:

```bash
npm install
```

#### Set up environment variables:
Create a .env file in the root directory and add the following variables:

```env
PORT=5000
IMAGE_SERVER_URL= http://localhost:4001
#MONGO_DB_URL= 
MONGO_DB_REMOTE_URL = 

NODE_ENV = 'dev'


CLIENT_URL = http://localhost:5173
#CLIENT_URL = https://www.thunderclient.com


# JWT keys
ACCESS_TOKEN_SECRET=
REFRESS_TOKEN_SECRET=
EXPIRES_IN='30d'
OTP_EXPIRES_IN= '20min'

# EMAIL API
EMAIL_ID=
CLIENT_ID = 
CLIENT_SECRET = 
REDIRECT_URL= https://developers.google.com/oauthplayground
REFRESH_TOKEN = 
accessToken = 
```

Run the server:
```bash
npm run dev
```
This will start the server on localhost:3000 (or the port specified in your .env file).



# API Endpoints

### Auth Routes

- `POST /api/auth/register`: User registration
- `POST /api/auth/register/resendOtp`: Resend OTP for registration
- `POST /api/auth/register/verify-account`: Verify user account with OTP
- `POST /api/auth/login`: User login
- `POST /api/auth/logout`: User logout
- `POST /api/auth/verify-token`: Verify if user is logged in
- `PUT /api/auth/update-user`: Update user information

### Task Routes

- `POST /api/tasks/create-task`: Create a new task
- `GET /api/tasks/get-tasks`: Fetch all tasks for a user
- `PUT /api/tasks/update-task/:taskId`: Update a task
- `DELETE /api/tasks/delete-task/:taskId`: Delete a task

### Notes:

- Make sure to replace `CLIENT_URL`, `your-mongodb-uri`, and `your-secret-key-for-jwt` with your actual values.
- Ensure MongoDB is running and accessible.


# Project Structure

The project structure is organized as follows:
```bash
Full-Stack-TODO-App-APIs/
│
├── config/
│ ├── db.js # MongoDB connection setup
│ └── config.js # Configuration variables
│
├── controllers/
│ ├── authController.js # Logic for user authentication
│ └── taskController.js # Logic for task management
│
├── middlewares/
│ └── authMiddleware.js # Middleware functions 
│
├── models/
│ ├── taskSchema.js # MongoDB schema for tasks
│ └── userSchema.js # MongoDB schema for users
│
├── routes/
│ ├── authRoutes.js # Express routes for authentication
│ └── taskRoutes.js # Express routes for task management
│
├── utils/
│ ├── responseUtils.js # Utility functions for HTTP responses
│ └── sendVerificationEmail.js # Utility for sending emails
│
├── .env # Environment variables
├── .gitignore
├── package.json
├── server.js # Entry point of the server
└── README.md # This file
```

# Contributing
I welcome contributions to improve this Full-Stack-TODO-App-APIs. To contribute, please follow the following steps.
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

