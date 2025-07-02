
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
    $stmt = $pdo->prepare("INSERT INTO assignments (title, description, course_id, due_date, total_points) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$input['title'], $input['description'], $input['course_id'], $input['due_date'], $input['total_points']]);
    
    echo json_encode(['success' => true, 'message' => 'Assignment created successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
