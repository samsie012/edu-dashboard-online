
<?php
require_once 'config.php';
checkRole('admin');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $pdo->prepare("DELETE FROM class_teachers WHERE class_id = ? AND teacher_id = ?");
    $stmt->execute([$input['class_id'], $input['teacher_id']]);
    
    echo json_encode(['success' => true, 'message' => 'Teacher removed from class successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
