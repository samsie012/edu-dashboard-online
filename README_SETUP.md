# LMS (Learning Management System) - Complete Setup Guide

## Prerequisites
- XAMPP installed on your system
- Web browser (Chrome, Firefox, Safari, etc.)
- Text editor (optional, for customization)

## Installation Steps

### 1. Setup XAMPP
1. Download and install XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Start XAMPP Control Panel
3. Start **Apache** and **MySQL** services

### 2. Setup Project Files
1. Copy all project files to your XAMPP htdocs directory
   - Example: `C:\xampp\htdocs\lms\` (Windows)
   - Example: `/Applications/XAMPP/htdocs/lms/` (Mac)
   - Example: `/opt/lampp/htdocs/lms/` (Linux)

### 3. Create Database
1. Open phpMyAdmin in your browser: `http://localhost/phpmyadmin`
2. Click "Import" tab
3. Choose file: `database/complete_lms_schema.sql`
4. Click "Go" to import the database
5. The database `lms_database` will be created with all tables and demo data

### 4. Configure Database Connection
1. Open `php/config.php`
2. Verify database settings:
   ```php
   $host = 'localhost';
   $dbname = 'lms_database';
   $username = 'root';
   $password = '';
   ```
3. Adjust if your MySQL settings are different

### 5. Set Permissions (Linux/Mac only)
```bash
chmod 755 uploads/
chmod 644 uploads/.htaccess
```

### 6. Access the Application
1. Open your web browser
2. Navigate to: `http://localhost/lms/`
3. You should see the login page

## Demo Credentials

### Admin Login
- **Email:** admin@lms.com
- **Password:** password123
- **Role:** Administrator

### Teacher Login
- **Email:** teacher@lms.com
- **Password:** password123
- **Role:** Teacher

### Student Login
- **Email:** student@lms.com
- **Password:** password123
- **Role:** Student

## Features Overview

### 🔧 Admin Dashboard
- **User Management:** Add, edit, delete students, teachers, and admins
- **Class Management:** Create classes with year and cohort information
- **Course Management:** Create courses and assign them to classes
- **Teacher Assignment:** Assign teachers to specific classes
- **Student Enrollment:** Enroll students in classes
- **System Statistics:** View total users, classes, courses, etc.
- **Reports:** System activity and performance metrics

### 👨‍🏫 Teacher Dashboard
- **Class Overview:** View assigned classes with student and course counts
- **Course Management:** Manage courses in assigned classes
- **Topic Management:** Add, edit, delete course topics with rich content
- **Assignment Creation:** Create assignments with due dates and instructions
- **Grading System:** Grade student submissions and provide feedback
- **Quiz Management:** Create quizzes with multiple choice and true/false questions
- **Student Management:** View enrolled students and their progress

### 👨‍🎓 Student Dashboard
- **Course Access:** View enrolled courses with progress tracking
- **Assignment Submission:** Submit assignments and view grades
- **Quiz Taking:** Take timed quizzes with auto-submission
- **Grade Tracking:** View all grades and feedback
- **Course Materials:** Access course topics and materials

## Technical Features

### 🔒 Security Features
- Password hashing using PHP's `password_hash()`
- Session management with regeneration
- CSRF token protection
- SQL injection prevention with prepared statements
- File upload validation and restrictions
- Role-based access control

### 📱 User Interface
- Responsive Bootstrap 5 design
- Modern gradient color schemes
- Smooth animations and transitions
- Interactive modals and forms
- Real-time notifications
- Mobile-friendly interface

### 🗄️ Database Structure
- **Users:** Store user information with roles
- **Classes:** Organize students by year and cohort
- **Courses:** Link courses to classes and teachers
- **Assignments:** Manage assignments and submissions
- **Quizzes:** Handle quiz creation and attempts
- **Enrollments:** Track student course enrollments
- **Topics:** Store course content and materials

## File Structure
```
/lms/
├── index.html                 # Login page
├── admin-dashboard.html       # Admin interface
├── teacher-dashboard.html     # Teacher interface
├── student-dashboard.html     # Student interface
├── quiz-management.html       # Quiz creation interface
├── take-quiz.html            # Quiz taking interface
├── /php/                     # Backend PHP files
│   ├── config.php           # Database configuration
│   ├── functions.php        # Helper functions
│   ├── login.php           # Authentication
│   └── [various APIs]      # CRUD operations
├── /assets/                 # Frontend assets
│   ├── /css/style.css      # Custom styles
│   └── /js/               # JavaScript files
├── /database/              # SQL schema files
├── /uploads/              # File upload directory
└── README_SETUP.md        # This file
```

## Customization

### Adding New Features
1. Create new PHP files in the `php/` directory
2. Add corresponding JavaScript in `assets/js/`
3. Update the database schema if needed
4. Add new HTML interfaces as required

### Styling Changes
- Modify `assets/css/style.css` for custom styles
- Bootstrap classes can be overridden
- Color schemes are defined using CSS custom properties

### Database Modifications
- Always backup before making changes
- Use migrations for production environments
- Update the schema file for new installations

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check XAMPP MySQL is running
   - Verify database credentials in `config.php`
   - Ensure database exists

2. **File Upload Issues**
   - Check `uploads/` directory permissions
   - Verify PHP upload settings in `php.ini`
   - Ensure sufficient disk space

3. **Login Problems**
   - Clear browser cache and cookies
   - Check if demo users exist in database
   - Verify password hashing is working

4. **Permission Denied Errors**
   - Set proper file permissions (755 for directories, 644 for files)
   - Check Apache user permissions
   - Ensure .htaccess files are readable

### Getting Help
- Check browser console for JavaScript errors
- Review Apache error logs in XAMPP
- Verify PHP error reporting is enabled
- Test with different browsers

## Production Deployment

### Security Checklist
- [ ] Change default passwords
- [ ] Update database credentials
- [ ] Enable HTTPS
- [ ] Configure proper file permissions
- [ ] Set up regular backups
- [ ] Enable error logging
- [ ] Disable debug mode
- [ ] Configure email settings
- [ ] Set up monitoring

### Performance Optimization
- Enable PHP OPcache
- Use database indexing
- Implement caching strategies
- Optimize images and assets
- Configure server compression
- Set up CDN for static files

## License
This project is open source and available under the MIT License.

## Support
For technical support or questions, please refer to the documentation or create an issue in the project repository.