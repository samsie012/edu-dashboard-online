
# LMS (Learning Management System) - XAMPP Setup Guide

## Prerequisites
- XAMPP installed on your system
- Web browser

## Installation Steps

1. **Copy Files**
   - Copy all project files to your XAMPP htdocs directory
   - Example: `C:\xampp\htdocs\lms\`

2. **Start XAMPP Services**
   - Start Apache and MySQL services from XAMPP Control Panel

3. **Create Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Import the SQL file: `database/lms_database.sql`
   - This will create the database and insert demo data

4. **Access the Application**
   - Open your web browser
   - Navigate to: `http://localhost/lms/`

## Demo Credentials

### Student Login
- Email: student@lms.com
- Password: student123
- Role: Student

### Teacher Login
- Email: teacher@lms.com
- Password: teacher123
- Role: Teacher

### Admin Login
- Email: admin@lms.com
- Password: admin123
- Role: Administrator

## Features

### Student Dashboard
- View enrolled courses with progress tracking
- View assignments (pending/submitted)
- View grades and scores

### Teacher Dashboard
- Manage courses and sections
- Grade submitted assignments
- View recent grades
- Student management

### Admin Dashboard
- System overview with statistics
- User management (students, teachers, admins)
- Course management
- System reports

## File Structure
```
lms/
├── index.html (Login page)
├── student-dashboard.html
├── teacher-dashboard.html
├── admin-dashboard.html
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── auth.js
│       ├── student-dashboard.js
│       ├── teacher-dashboard.js
│       └── admin-dashboard.js
├── php/
│   ├── config.php (Database configuration)
│   ├── login.php
│   ├── logout.php
│   └── [various API endpoints]
└── database/
    └── lms_database.sql
```

## Technologies Used
- HTML5
- CSS3
- Bootstrap 5
- Procedural JavaScript
- Procedural PHP
- MySQL

## Notes
- All passwords are hashed using PHP's password_hash() function
- Session management is implemented for user authentication
- Role-based access control is enforced
- Responsive design using Bootstrap
