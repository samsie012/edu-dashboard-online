
<?php
require_once 'config.php';
checkRole('admin');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['course_id']) || !isset($input['class_id'])) {
    echo json_encode(['success' => false, 'message' => 'Course ID and Class ID are required']);
    exit;
}

try {
    // Update the course to belong to the specified class
    $stmt = $pdo->prepare("UPDATE courses SET class_id = ? WHERE id = ?");
    $stmt->execute([$input['class_id'], $input['course_id']]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Course assigned to class successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Course not found or no changes made']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
