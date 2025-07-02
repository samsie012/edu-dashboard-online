
<?php
require_once 'config.php';
checkRole('student');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$attempt_id = $input['attempt_id'];
$answers = $input['answers'];

try {
    $pdo->beginTransaction();
    
    // Get attempt details
    $stmt = $pdo->prepare("SELECT * FROM quiz_attempts WHERE id = ? AND student_id = ?");
    $stmt->execute([$attempt_id, $_SESSION['user_id']]);
    $attempt = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$attempt) {
        echo json_encode(['success' => false, 'message' => 'Invalid attempt']);
        exit;
    }
    
    $score = 0;
    $total_marks = 0;
    
    // Process each answer
    foreach ($answers as $question_id => $answer) {
        $stmt = $pdo->prepare("SELECT marks FROM quiz_questions WHERE id = ?");
        $stmt->execute([$question_id]);
        $question = $stmt->fetch(PDO::FETCH_ASSOC);
        $total_marks += $question['marks'];
        
        // Check if answer is correct
        $is_correct = 0;
        if (isset($answer['option_id'])) {
            $stmt = $pdo->prepare("SELECT is_correct FROM quiz_options WHERE id = ?");
            $stmt->execute([$answer['option_id']]);
            $option = $stmt->fetch(PDO::FETCH_ASSOC);
            $is_correct = $option['is_correct'];
            
            if ($is_correct) {
                $score += $question['marks'];
            }
        }
        
        // Save answer
        $stmt = $pdo->prepare("INSERT INTO quiz_answers (attempt_id, question_id, selected_option_id, is_correct) VALUES (?, ?, ?, ?)");
        $stmt->execute([$attempt_id, $question_id, $answer['option_id'] ?? null, $is_correct]);
    }
    
    // Calculate time taken
    $start_time = new DateTime($attempt['start_time']);
    $end_time = new DateTime();
    $time_taken = $end_time->getTimestamp() - $start_time->getTimestamp();
    $time_taken_minutes = round($time_taken / 60);
    
    // Update attempt
    $stmt = $pdo->prepare("UPDATE quiz_attempts SET end_time = NOW(), score = ?, total_marks = ?, is_completed = 1, time_taken = ? WHERE id = ?");
    $stmt->execute([$score, $total_marks, $time_taken_minutes, $attempt_id]);
    
    $pdo->commit();
    echo json_encode(['success' => true, 'score' => $score, 'total_marks' => $total_marks]);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
