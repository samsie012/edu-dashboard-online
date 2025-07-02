
<?php
require_once 'config.php';
checkAuth();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $pdo->prepare("INSERT INTO enrollments (student_id, course_id, enrollment_date) VALUES (?, ?, NOW())");
    $stmt->execute([$input['student_id'], $input['course_id']]);
    
    echo json_encode(['success' => true, 'message' => 'Student enrolled successfully']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'Student already enrolled']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}
?>
