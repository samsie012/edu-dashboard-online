
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
    $stmt = $pdo->prepare("UPDATE student_assignments SET grade = ?, points = ?, status = 'graded', graded_date = NOW() WHERE id = ?");
    $stmt->execute([$input['grade'], $input['points'], $input['assignment_id']]);
    
    echo json_encode(['success' => true, 'message' => 'Assignment graded successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
