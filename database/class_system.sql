
-- Class system updates for LMS
USE lms_database;

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    year VARCHAR(10) NOT NULL,
    cohort VARCHAR(50) NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add class_id to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS class_id INT;
ALTER TABLE courses ADD FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE;

-- Create class_teachers table for teacher assignments
CREATE TABLE IF NOT EXISTS class_teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT,
    teacher_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_class_teacher (class_id, teacher_id)
);

-- Create class_students table for student assignments
CREATE TABLE IF NOT EXISTS class_students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT,
    student_id INT,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_class_student (class_id, student_id)
);

-- Insert sample classes
INSERT IGNORE INTO classes (name, year, cohort, description) VALUES
('Computer Science A', '2024', 'Morning', 'Computer Science program for morning cohort'),
('Mathematics A', '2024', 'Evening', 'Mathematics program for evening cohort'),
('Physics B', '2024', 'Morning', 'Advanced Physics program');

-- Update existing courses to belong to classes (optional)
UPDATE courses SET class_id = 1 WHERE id IN (1, 2);
UPDATE courses SET class_id = 2 WHERE id = 3;
