
-- Course topics and class-course management
USE lms_database;

-- Create course_topics table for teachers to manage topics within courses
CREATE TABLE IF NOT EXISTS course_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Update courses table to ensure class_id is properly set
ALTER TABLE courses MODIFY COLUMN class_id INT NULL;

-- Insert sample topics for existing courses
INSERT IGNORE INTO course_topics (course_id, title, description, order_index) VALUES
(1, 'Introduction to Programming', 'Basic programming concepts and syntax', 1),
(1, 'Variables and Data Types', 'Understanding different data types', 2),
(2, 'Algebra Fundamentals', 'Basic algebraic operations', 1),
(2, 'Linear Equations', 'Solving linear equations', 2);
