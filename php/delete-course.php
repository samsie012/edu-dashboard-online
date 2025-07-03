
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
    // First delete related enrollments
    $stmt = $pdo->prepare("DELETE FROM enrollments WHERE course_id = ?");
    $stmt->execute([$input['course_id']]);
    
    // Delete related assignments
    $stmt = $pdo->prepare("DELETE FROM assignments WHERE course_id = ?");
    $stmt->execute([$input['course_id']]);
    
    // Finally delete the course
    $stmt = $pdo->prepare("DELETE FROM courses WHERE id = ?");
    $stmt->execute([$input['course_id']]);
    
    echo json_encode(['success' => true, 'message' => 'Course deleted successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
