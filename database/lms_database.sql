
-- Create database
CREATE DATABASE IF NOT EXISTS lms_database;
USE lms_database;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    teacher_id INT,
    section VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Enrollments table
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Assignments table
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    course_id INT,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Student assignments table
CREATE TABLE student_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    assignment_id INT,
    status ENUM('pending', 'submitted', 'graded') DEFAULT 'pending',
    submission_date TIMESTAMP NULL,
    grade VARCHAR(5) NULL,
    points INT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id)
);

-- Insert demo users with hashed passwords
INSERT INTO users (name, email, password, role) VALUES
('John Student', 'student@lms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Jane Teacher', 'teacher@lms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
('Admin User', 'admin@lms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert demo courses
INSERT INTO courses (name, description, teacher_id, section) VALUES
('Mathematics 101', 'Introduction to Mathematics', 2, 'A'),
('Physics 101', 'Introduction to Physics', 2, 'A'),
('Chemistry 101', 'Introduction to Chemistry', 2, 'B'),
('Mathematics 102', 'Advanced Mathematics', 2, 'B'),
('Statistics 101', 'Introduction to Statistics', 2, 'A');

-- Insert demo enrollments
INSERT INTO enrollments (student_id, course_id, progress) VALUES
(1, 1, 75),
(1, 2, 60),
(1, 3, 85);

-- Insert demo assignments
INSERT INTO assignments (title, description, course_id, due_date) VALUES
('Math Assignment 1', 'Basic algebra problems', 1, '2024-07-10'),
('Physics Lab Report', 'Lab experiment report', 2, '2024-07-08'),
('Chemistry Quiz', 'Chapter 1-3 quiz', 3, '2024-07-12'),
('Math Quiz 1', 'Quadratic equations', 1, '2024-07-05'),
('Physics Exam', 'Midterm examination', 2, '2024-07-03'),
('Chemistry Lab', 'Lab practical', 3, '2024-07-01');

-- Insert demo student assignments
INSERT INTO student_assignments (student_id, assignment_id, status, submission_date, grade, points) VALUES
(1, 1, 'pending', NULL, NULL, NULL),
(1, 2, 'submitted', '2024-07-07 10:30:00', NULL, NULL),
(1, 3, 'pending', NULL, NULL, NULL),
(1, 4, 'graded', '2024-07-04 14:20:00', 'A-', 87),
(1, 5, 'graded', '2024-07-02 16:45:00', 'B+', 82),
(1, 6, 'graded', '2024-06-30 11:15:00', 'A', 95);
