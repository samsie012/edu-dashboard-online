
<?php
require_once 'config.php';
checkRole('student');

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT q.*, c.name as course_name, 
               qa.score, qa.is_completed, qa.start_time as attempt_date
        FROM quizzes q 
        JOIN courses c ON q.course_id = c.id 
        JOIN enrollments e ON c.id = e.course_id 
        LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = ?
        WHERE e.student_id = ? AND q.is_active = 1
        ORDER BY q.created_at DESC
    ");
    $stmt->execute([$_SESSION['user_id'], $_SESSION['user_id']]);
    $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'quizzes' => $quizzes]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
