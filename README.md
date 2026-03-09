Task Manager REST API
Project Overview

This project is a Task Management REST API built using Vanilla PHP, PDO, and MySQL. It allows users to register, log in, and manage their tasks through a RESTful API with full CRUD functionality.

The system also supports:

Soft deletes

Filtering

Pagination

Basic browser-based frontend

The frontend communicates with the backend API using JavaScript fetch() requests, allowing asynchronous interaction with the API without page reloads.

This project was developed as part of a Software Engineering Intern technical assessment.

Tech Stack
Backend

PHP (Vanilla PHP)

PDO (PHP Data Objects)

Database

MySQL

Frontend

HTML

CSS

JavaScript (Fetch API)

Server

Apache (XAMPP)

Version Control

Git

GitHub

Project Structure
Task-Manager-API
│
├── api
│   ├── register.php
│   ├── login.php
│   └── tasks.php
│
├── config
│   └── database.php
│
├── models
│
├── public
│   ├── login.html
│   ├── dashboard.html
│   ├── style.css
│   └── app.js
│
└── README.md
Database Schema
Users Table
Column	Type	Description
id	INT	Primary key
name	VARCHAR(100)	User name
email	VARCHAR(150)	Unique email
password	VARCHAR(255)	Hashed password
created_at	TIMESTAMP	Account creation time
Tasks Table
Column	Type	Description
id	INT	Primary key
user_id	INT	Reference to user
title	VARCHAR(255)	Task title
description	TEXT	Task details
status	VARCHAR(50)	Task status
created_at	TIMESTAMP	Creation time
updated_at	TIMESTAMP	Last update
deleted_at	TIMESTAMP	Soft delete timestamp
API Endpoints
Authentication

POST /api/register.php
Create a new user account.

POST /api/login.php
Authenticate a user and return user details.

Tasks

POST /api/tasks.php
Create a new task.

GET /api/tasks.php
Retrieve tasks (supports filtering and pagination).

PUT /api/tasks.php
Update an existing task.

DELETE /api/tasks.php
Soft delete a task by setting the deleted_at timestamp.

Features

User registration and login

Task creation

Task listing

Task updating

Task deletion (soft delete)

Pagination support

Task filtering

RESTful API design

Secure password hashing

Asynchronous frontend communication using fetch()

Frontend Functionality
Login

The login page collects the user's email and password. JavaScript sends a POST request to the login API using the Fetch API.

If authentication is successful:

The user ID is stored in localStorage

The user is redirected to the dashboard page

Dashboard

When dashboard.html loads:

The user ID is retrieved from localStorage

A GET request fetches the user's tasks from the API

Tasks are dynamically displayed in a table

Task Operations

Users can:

Create tasks
Update tasks
Delete tasks

All operations communicate with the backend API using fetch(), and the UI updates automatically without reloading the page.

How to Run the Project

Install XAMPP

Start Apache and MySQL

Place the project inside:

C:\xampp\htdocs\Task-Manager-API

Import the database into MySQL

Open the frontend in your browser:

http://localhost/Task-Manager-API/public/login.html
Demo Flow

Register a new user

Log in using the created account

Create a new task

View the task list

Update a task

Delete a task

Author

Deeghayu Jayasundare