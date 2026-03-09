# Task Manager REST API

## Project Overview

This project is a **Task Management REST API** built using **Vanilla PHP, PDO, and MySQL**.
It allows users to register, log in, and manage their tasks through a RESTful API with full CRUD functionality.

The system also supports:

* Soft deletes
* Filtering
* Pagination
* Basic browser-based frontend

This project was developed as part of a **Software Engineering Intern technical assessment**.

---

## Tech Stack

Backend

* PHP (Vanilla PHP)
* PDO (PHP Data Objects)

Database

* MySQL

Frontend

* HTML
* CSS
* JavaScript (Fetch API)

Version Control

* Git
* GitHub

---

## Database Schema

### Users Table

| Column     | Type         | Description           |
| ---------- | ------------ | --------------------- |
| id         | INT          | Primary key           |
| name       | VARCHAR(100) | User name             |
| email      | VARCHAR(150) | Unique email          |
| password   | VARCHAR(255) | Hashed password       |
| created_at | TIMESTAMP    | Account creation time |

### Tasks Table

| Column      | Type         | Description           |
| ----------- | ------------ | --------------------- |
| id          | INT          | Primary key           |
| user_id     | INT          | Reference to user     |
| title       | VARCHAR(255) | Task title            |
| description | TEXT         | Task details          |
| status      | VARCHAR(50)  | Task status           |
| created_at  | TIMESTAMP    | Creation time         |
| updated_at  | TIMESTAMP    | Last update           |
| deleted_at  | TIMESTAMP    | Soft delete timestamp |

---

## Planned API Endpoints

Authentication

* POST /api/register
* POST /api/login

Tasks

* GET /api/tasks
* GET /api/tasks/{id}
* POST /api/tasks
* PUT /api/tasks/{id}
* DELETE /api/tasks/{id}

---

## Features

* User authentication
* Task creation and management
* Soft delete for tasks
* Task filtering
* Pagination
* RESTful API design

---

## How to Run the Project

*Install XAMPP
*Start Apache and MySQL
*Place the project inside:

C:\xampp\htdocs\Task-Manager-API

*Import the database into MySQL
*Open the frontend in your browser:

http://localhost/Task-Manager-API/public/login.html

---

## Author

Deeghayu Jayasundare
