
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
    $stmt = $pdo->prepare("UPDATE courses SET name = ?, description = ?, section = ? WHERE id = ?");
    $stmt->execute([$input['name'], $input['description'], $input['section'], $input['course_id']]);
    
    echo json_encode(['success' => true, 'message' => 'Course updated successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
