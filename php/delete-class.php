
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
    // Delete related data first
    $stmt = $pdo->prepare("DELETE FROM class_teachers WHERE class_id = ?");
    $stmt->execute([$input['class_id']]);
    
    $stmt = $pdo->prepare("DELETE FROM class_students WHERE class_id = ?");
    $stmt->execute([$input['class_id']]);
    
    // Courses and their related data will be deleted via CASCADE
    $stmt = $pdo->prepare("DELETE FROM classes WHERE id = ?");
    $stmt->execute([$input['class_id']]);
    
    echo json_encode(['success' => true, 'message' => 'Class deleted successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
