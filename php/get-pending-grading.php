
<?php
require_once 'config.php';
checkRole('teacher');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT a.title, u.name as student, c.name as course, sa.submission_date as submitted 
        FROM assignments a 
        JOIN courses c ON a.course_id = c.id 
        JOIN student_assignments sa ON a.id = sa.assignment_id 
        JOIN users u ON sa.student_id = u.id 
        WHERE c.teacher_id = ? AND sa.status = 'submitted'
        ORDER BY sa.submission_date ASC
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'assignments' => $assignments]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
