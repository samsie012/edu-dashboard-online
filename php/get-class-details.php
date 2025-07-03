
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
    // Get class info
    $stmt = $pdo->prepare("SELECT * FROM classes WHERE id = ?");
    $stmt->execute([$class_id]);
    $class = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$class) {
        echo json_encode(['success' => false, 'message' => 'Class not found']);
        exit;
    }

    // Get assigned teachers
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email 
        FROM users u 
        JOIN class_teachers ct ON u.id = ct.teacher_id 
        WHERE ct.class_id = ?
    ");
    $stmt->execute([$class_id]);
    $teachers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get assigned students
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email 
        FROM users u 
        JOIN class_students cs ON u.id = cs.student_id 
        WHERE cs.class_id = ?
    ");
    $stmt->execute([$class_id]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get courses in this class
    $stmt = $pdo->prepare("SELECT * FROM courses WHERE class_id = ?");
    $stmt->execute([$class_id]);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'class' => $class,
        'teachers' => $teachers,
        'students' => $students,
        'courses' => $courses
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
