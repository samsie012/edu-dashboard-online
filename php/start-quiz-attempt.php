
<?php
require_once 'config.php';
checkRole('student');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$quiz_id = $input['quiz_id'];

try {
    // Check if student already has an active attempt
    $stmt = $pdo->prepare("SELECT id FROM quiz_attempts WHERE student_id = ? AND quiz_id = ? AND is_completed = 0");
    $stmt->execute([$_SESSION['user_id'], $quiz_id]);
    $existing_attempt = $stmt->fetch();
    
    if ($existing_attempt) {
        echo json_encode(['success' => true, 'attempt_id' => $existing_attempt['id']]);
        exit;
    }
    
    // Create new attempt
    $stmt = $pdo->prepare("INSERT INTO quiz_attempts (student_id, quiz_id) VALUES (?, ?)");
    $stmt->execute([$_SESSION['user_id'], $quiz_id]);
    $attempt_id = $pdo->lastInsertId();
    
    echo json_encode(['success' => true, 'attempt_id' => $attempt_id]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
