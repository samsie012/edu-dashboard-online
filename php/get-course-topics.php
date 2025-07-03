
<?php
require_once 'config.php';
checkAuth();

header('Content-Type: application/json');

if (!isset($_GET['course_id'])) {
    echo json_encode(['success' => false, 'message' => 'Course ID required']);
    exit;
}

$course_id = $_GET['course_id'];

try {
    // Check if user has access to this course
    if ($_SESSION['role'] !== 'admin') {
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as count 
            FROM courses c 
            JOIN class_teachers ct ON c.class_id = ct.class_id 
            WHERE c.id = ? AND ct.teacher_id = ?
        ");
        $stmt->execute([$course_id, $_SESSION['user_id']]);
        $has_access = $stmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;
        
        if (!$has_access) {
            echo json_encode(['success' => false, 'message' => 'Access denied']);
            exit;
        }
    }

    $stmt = $pdo->prepare("
        SELECT id, title, description, order_index, status 
        FROM course_topics 
        WHERE course_id = ? 
        ORDER BY order_index, id
    ");
    $stmt->execute([$course_id]);
    $topics = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'topics' => $topics]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
