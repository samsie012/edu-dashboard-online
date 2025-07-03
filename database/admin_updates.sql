
-- Additional updates for admin functionality
USE lms_database;

-- Add section field to courses if not exists
ALTER TABLE courses ADD COLUMN IF NOT EXISTS section VARCHAR(10) DEFAULT 'A';

-- Add status field to users for better management
ALTER TABLE users ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') DEFAULT 'active';

-- Create course_assignments table if not exists
CREATE TABLE IF NOT EXISTS course_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT,
    assignment_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
);

-- Add more sample data for testing
INSERT IGNORE INTO users (name, email, password, role, status) VALUES
('Test Student 1', 'student1@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'active'),
('Test Student 2', 'student2@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'active'),
('Test Teacher 2', 'teacher2@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'active');
