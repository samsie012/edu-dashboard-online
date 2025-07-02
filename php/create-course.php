
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
    $stmt = $pdo->prepare("INSERT INTO courses (name, section, teacher_id) VALUES (?, ?, ?)");
    $stmt->execute([$input['name'], $input['section'], $_SESSION['user_id']]);
    
    echo json_encode(['success' => true, 'message' => 'Course created successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
