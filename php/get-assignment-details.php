
<?php
require_once 'config.php';
checkRole('teacher');

header('Content-Type: application/json');

$assignment_id = $_GET['assignment_id'] ?? 0;

try {
    $stmt = $pdo->prepare("
        SELECT sa.*, a.title, a.description, u.name as student_name, c.name as course_name
        FROM student_assignments sa
        JOIN assignments a ON sa.assignment_id = a.id
        JOIN users u ON sa.student_id = u.id
        JOIN courses c ON a.course_id = c.id
        WHERE sa.id = ?
    ");
    $stmt->execute([$assignment_id]);
    $assignment = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($assignment) {
        echo json_encode(['success' => true, 'assignment' => $assignment]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Assignment not found']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
