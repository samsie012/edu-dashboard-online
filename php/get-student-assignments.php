
<?php
require_once 'config.php';
checkRole('student');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT a.id, a.title, c.name as course, a.due_date, COALESCE(sa.status, 'pending') as status 
        FROM assignments a 
        JOIN courses c ON a.course_id = c.id 
        JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN student_assignments sa ON a.id = sa.assignment_id AND sa.student_id = ?
        WHERE e.student_id = ?
        ORDER BY a.due_date ASC
    ");
    $stmt->execute([$_SESSION['user_id'], $_SESSION['user_id']]);
    $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'assignments' => $assignments]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
