
<?php
require_once 'config.php';
checkAuth();

header('Content-Type: application/json');

if (!isset($_GET['class_id'])) {
    echo json_encode(['success' => false, 'message' => 'Class ID required']);
    exit;
}

$class_id = $_GET['class_id'];

try {
    // Check if user has access to this class
    if ($_SESSION['role'] !== 'admin') {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM class_teachers WHERE class_id = ? AND teacher_id = ?");
        $stmt->execute([$class_id, $_SESSION['user_id']]);
        $has_access = $stmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;
        
        if (!$has_access) {
            echo json_encode(['success' => false, 'message' => 'Access denied']);
            exit;
        }
    }

    $stmt = $pdo->prepare("
        SELECT c.id, c.name, c.section, c.description,
               u.name as teacher_name,
               COUNT(ct.id) as topic_count
        FROM courses c
        LEFT JOIN users u ON c.teacher_id = u.id
        LEFT JOIN course_topics ct ON c.id = ct.course_id
        WHERE c.class_id = ?
        GROUP BY c.id
        ORDER BY c.name
    ");
    $stmt->execute([$class_id]);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'courses' => $courses]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
