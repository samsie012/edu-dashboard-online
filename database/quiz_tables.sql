
-- Add quiz tables to the existing LMS database
USE lms_database;

-- Quizzes table
CREATE TABLE quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    course_id INT,
    time_limit INT DEFAULT 30, -- in minutes
    total_marks INT DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Quiz questions table
CREATE TABLE quiz_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false') NOT NULL,
    marks INT DEFAULT 1,
    question_order INT DEFAULT 1,
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
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

-- Student answers table
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

-- Insert demo quiz data
INSERT INTO quizzes (title, description, course_id, time_limit, total_marks) VALUES
('Mathematics Quiz 1', 'Basic algebra and equations', 1, 30, 10),
('Physics Fundamentals', 'Introduction to physics concepts', 2, 45, 15);

-- Insert demo questions
INSERT INTO quiz_questions (quiz_id, question_text, question_type, marks, question_order) VALUES
(1, 'What is the value of x in the equation: 2x + 5 = 15?', 'multiple_choice', 2, 1),
(1, 'Is the equation x² + 4x + 4 = (x + 2)² always true?', 'true_false', 2, 2),
(2, 'What is the formula for calculating velocity?', 'multiple_choice', 3, 1);

-- Insert demo options
INSERT INTO quiz_options (question_id, option_text, is_correct, option_order) VALUES
(1, 'x = 5', 1, 1),
(1, 'x = 10', 0, 2),
(1, 'x = 3', 0, 3),
(1, 'x = 7', 0, 4),
(2, 'True', 1, 1),
(2, 'False', 0, 2),
(3, 'v = d/t', 1, 1),
(3, 'v = a/t', 0, 2),
(3, 'v = m*a', 0, 3),
(3, 'v = f*λ', 0, 4);
