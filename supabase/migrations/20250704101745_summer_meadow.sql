-- Complete LMS Database Schema
-- Drop database if exists and create new one
DROP DATABASE IF EXISTS lms_database;
CREATE DATABASE lms_database;
USE lms_database;

-- Users table with enhanced fields
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    profile_picture VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    year VARCHAR(10) NOT NULL,
    cohort VARCHAR(50) NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Courses table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    class_id INT,
    teacher_id INT,
    section VARCHAR(10) DEFAULT 'A',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Class-Teachers relationship table
CREATE TABLE class_teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT,
    teacher_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_class_teacher (class_id, teacher_id)
);

-- Class-Students relationship table
CREATE TABLE class_students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT,
    student_id INT,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enrolled_by INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (enrolled_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_class_student (class_id, student_id)
);

-- Course enrollments table
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INT DEFAULT 0,
    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);

-- Course topics table
CREATE TABLE course_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    order_index INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Assignments table
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    course_id INT,
    due_date DATETIME,
    total_points INT DEFAULT 100,
    file_path VARCHAR(255),
    instructions TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Student assignments/submissions table
CREATE TABLE student_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    assignment_id INT,
    status ENUM('pending', 'submitted', 'graded') DEFAULT 'pending',
    submission_text TEXT,
    submission_file VARCHAR(255),
    submission_date TIMESTAMP NULL,
    grade VARCHAR(5) NULL,
    points INT NULL,
    feedback TEXT,
    graded_by INT,
    graded_date TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_student_assignment (student_id, assignment_id)
);

-- Quizzes table
CREATE TABLE quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    course_id INT,
    time_limit INT DEFAULT 30, -- in minutes
    total_marks INT DEFAULT 0,
    instructions TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Quiz questions table
CREATE TABLE quiz_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false') NOT NULL,
    marks INT DEFAULT 1,
    question_order INT DEFAULT 1,
    image_path VARCHAR(255),
    formula_html TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Quiz options table (for multiple choice questions)
CREATE TABLE quiz_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT 0,
    option_order INT DEFAULT 1,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- Student quiz attempts table
CREATE TABLE quiz_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    quiz_id INT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    score INT DEFAULT 0,
    total_marks INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT 0,
    time_taken INT DEFAULT 0, -- in minutes
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Student quiz answers table
CREATE TABLE quiz_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    attempt_id INT,
    question_id INT,
    selected_option_id INT NULL,
    answer_text TEXT NULL,
    is_correct BOOLEAN DEFAULT 0,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id),
    FOREIGN KEY (selected_option_id) REFERENCES quiz_options(id)
);

-- Insert demo users with hashed passwords (password123 for all)
INSERT INTO users (name, email, password, role, status) VALUES
('Admin User', 'admin@lms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active'),
('John Teacher', 'teacher@lms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'active'),
('Jane Student', 'student@lms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'active'),
('Mary Teacher', 'mary.teacher@lms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'active'),
('Bob Student', 'bob.student@lms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'active'),
('Alice Student', 'alice.student@lms.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'active');

-- Insert demo classes
INSERT INTO classes (name, year, cohort, description, created_by) VALUES
('Computer Science A', '2024', 'Morning', 'Computer Science program for morning cohort', 1),
('Mathematics A', '2024', 'Evening', 'Mathematics program for evening cohort', 1),
('Physics B', '2024', 'Morning', 'Advanced Physics program', 1);

-- Insert demo courses
INSERT INTO courses (name, description, class_id, teacher_id, section, created_by) VALUES
('Introduction to Programming', 'Learn basic programming concepts', 1, 2, 'A', 1),
('Advanced Mathematics', 'Advanced mathematical concepts', 2, 4, 'A', 1),
('Physics Fundamentals', 'Basic physics principles', 3, 2, 'B', 1),
('Database Systems', 'Introduction to database design', 1, 4, 'A', 1);

-- Assign teachers to classes
INSERT INTO class_teachers (class_id, teacher_id, assigned_by) VALUES
(1, 2, 1),
(2, 4, 1),
(3, 2, 1),
(1, 4, 1);

-- Assign students to classes
INSERT INTO class_students (class_id, student_id, enrolled_by) VALUES
(1, 3, 1),
(1, 5, 1),
(2, 6, 1),
(3, 3, 1),
(3, 5, 1);

-- Create enrollments based on class assignments
INSERT INTO enrollments (student_id, course_id, progress) VALUES
(3, 1, 75),
(3, 4, 60),
(5, 1, 85),
(5, 4, 70),
(6, 2, 90),
(3, 3, 55),
(5, 3, 65);

-- Insert demo course topics
INSERT INTO course_topics (course_id, title, content, order_index, uploaded_by) VALUES
(1, 'Introduction to Variables', '<h3>Variables in Programming</h3><p>Variables are containers for storing data values...</p>', 1, 2),
(1, 'Control Structures', '<h3>If Statements and Loops</h3><p>Control structures allow you to control the flow of your program...</p>', 2, 2),
(2, 'Algebra Fundamentals', '<h3>Basic Algebraic Operations</h3><p>Algebra is a branch of mathematics...</p>', 1, 4),
(3, 'Newton\'s Laws', '<h3>The Three Laws of Motion</h3><p>Newton\'s laws of motion are three physical laws...</p>', 1, 2);

-- Insert demo assignments
INSERT INTO assignments (title, description, course_id, due_date, total_points, created_by) VALUES
('Programming Assignment 1', 'Create a simple calculator program', 1, '2024-12-30 23:59:59', 100, 2),
('Math Problem Set 1', 'Solve the given algebraic equations', 2, '2024-12-28 23:59:59', 50, 4),
('Physics Lab Report', 'Write a report on the pendulum experiment', 3, '2024-12-25 23:59:59', 75, 2);

-- Insert demo student assignments
INSERT INTO student_assignments (student_id, assignment_id, status, submission_date, grade, points) VALUES
(3, 1, 'pending', NULL, NULL, NULL),
(3, 3, 'graded', '2024-12-20 14:30:00', 'A', 70),
(5, 1, 'submitted', '2024-12-22 16:45:00', NULL, NULL),
(6, 2, 'graded', '2024-12-21 10:15:00', 'B+', 42);

-- Insert demo quizzes
INSERT INTO quizzes (title, description, course_id, time_limit, total_marks, created_by) VALUES
('Programming Basics Quiz', 'Test your knowledge of basic programming concepts', 1, 30, 20, 2),
('Algebra Quiz 1', 'Basic algebraic operations and equations', 2, 45, 25, 4);

-- Insert demo quiz questions
INSERT INTO quiz_questions (quiz_id, question_text, question_type, marks, question_order) VALUES
(1, 'What is a variable in programming?', 'multiple_choice', 5, 1),
(1, 'Python is a compiled language.', 'true_false', 5, 2),
(1, 'Which of the following is a valid variable name?', 'multiple_choice', 5, 3),
(1, 'Comments in code are executed by the computer.', 'true_false', 5, 4),
(2, 'What is the value of x in the equation: 2x + 5 = 15?', 'multiple_choice', 10, 1),
(2, 'The equation x² + 4x + 4 = (x + 2)² is always true.', 'true_false', 15, 2);

-- Insert demo quiz options
INSERT INTO quiz_options (question_id, option_text, is_correct, option_order) VALUES
-- Question 1 options
(1, 'A container for storing data values', 1, 1),
(1, 'A type of loop', 0, 2),
(1, 'A mathematical operation', 0, 3),
(1, 'A programming language', 0, 4),
-- Question 2 options (true/false)
(2, 'True', 0, 1),
(2, 'False', 1, 2),
-- Question 3 options
(3, 'my_variable', 1, 1),
(3, '2variable', 0, 2),
(3, 'my-variable', 0, 3),
(3, 'variable name', 0, 4),
-- Question 4 options (true/false)
(4, 'True', 0, 1),
(4, 'False', 1, 2),
-- Question 5 options
(5, 'x = 5', 1, 1),
(5, 'x = 10', 0, 2),
(5, 'x = 3', 0, 3),
(5, 'x = 7', 0, 4),
-- Question 6 options (true/false)
(6, 'True', 1, 1),
(6, 'False', 0, 2);

-- Insert demo quiz attempts
INSERT INTO quiz_attempts (student_id, quiz_id, start_time, end_time, score, total_marks, is_completed, time_taken) VALUES
(3, 1, '2024-12-20 10:00:00', '2024-12-20 10:25:00', 15, 20, 1, 25),
(5, 1, '2024-12-21 14:00:00', '2024-12-21 14:20:00', 18, 20, 1, 20);