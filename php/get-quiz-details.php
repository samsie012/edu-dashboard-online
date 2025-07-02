
<?php
require_once 'config.php';
checkAuth();

header('Content-Type: application/json');

$quiz_id = $_GET['quiz_id'] ?? 0;

try {
    // Get quiz details
    $stmt = $pdo->prepare("
        SELECT q.*, c.name as course_name 
        FROM quizzes q 
        JOIN courses c ON q.course_id = c.id 
        WHERE q.id = ?
    ");
    $stmt->execute([$quiz_id]);
    $quiz = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$quiz) {
        echo json_encode(['success' => false, 'message' => 'Quiz not found']);
        exit;
    }
    
    // Get questions
    $stmt = $pdo->prepare("
        SELECT * FROM quiz_questions 
        WHERE quiz_id = ? 
        ORDER BY question_order
    ");
    $stmt->execute([$quiz_id]);
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get options for each question
    foreach ($questions as &$question) {
        $stmt = $pdo->prepare("
            SELECT * FROM quiz_options 
            WHERE question_id = ? 
            ORDER BY option_order
        ");
        $stmt->execute([$question['id']]);
        $question['options'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    $quiz['questions'] = $questions;
    
    echo json_encode(['success' => true, 'quiz' => $quiz]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
