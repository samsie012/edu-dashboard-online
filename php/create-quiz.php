
<?php
require_once 'config.php';
checkRole('teacher');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

try {
    $pdo->beginTransaction();
    
    // Create quiz
    $stmt = $pdo->prepare("INSERT INTO quizzes (title, description, course_id, time_limit) VALUES (?, ?, ?, ?)");
    $stmt->execute([$input['title'], $input['description'], $input['course_id'], $input['time_limit']]);
    $quiz_id = $pdo->lastInsertId();
    
    // Add questions
    $total_marks = 0;
    foreach ($input['questions'] as $index => $question) {
        $stmt = $pdo->prepare("INSERT INTO quiz_questions (quiz_id, question_text, question_type, marks, question_order) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$quiz_id, $question['text'], $question['type'], $question['marks'], $index + 1]);
        $question_id = $pdo->lastInsertId();
        
        $total_marks += $question['marks'];
        
        // Add options for the question
        if ($question['type'] === 'multiple_choice') {
            foreach ($question['options'] as $opt_index => $option) {
                $stmt = $pdo->prepare("INSERT INTO quiz_options (question_id, option_text, is_correct, option_order) VALUES (?, ?, ?, ?)");
                $stmt->execute([$question_id, $option['text'], $option['is_correct'] ? 1 : 0, $opt_index + 1]);
            }
        } else if ($question['type'] === 'true_false') {
            $stmt = $pdo->prepare("INSERT INTO quiz_options (question_id, option_text, is_correct, option_order) VALUES (?, ?, ?, ?)");
            $stmt->execute([$question_id, 'True', $question['correct_answer'] === 'true' ? 1 : 0, 1]);
            $stmt->execute([$question_id, 'False', $question['correct_answer'] === 'false' ? 1 : 0, 2]);
        }
    }
    
    // Update total marks
    $stmt = $pdo->prepare("UPDATE quizzes SET total_marks = ? WHERE id = ?");
    $stmt->execute([$total_marks, $quiz_id]);
    
    $pdo->commit();
    echo json_encode(['success' => true, 'quiz_id' => $quiz_id]);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
