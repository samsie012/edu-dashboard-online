
<?php
require_once 'config.php';
checkAuth();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

try {
    // Check if user is admin or assigned teacher to this class
    $user_role = $_SESSION['role'];
    if ($user_role !== 'admin') {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM class_teachers WHERE class_id = ? AND teacher_id = ?");
        $stmt->execute([$input['class_id'], $_SESSION['user_id']]);
        $is_assigned = $stmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;
        
        if (!$is_assigned) {
            echo json_encode(['success' => false, 'message' => 'Access denied']);
            exit;
        }
    }

    $stmt = $pdo->prepare("DELETE FROM class_students WHERE class_id = ? AND student_id = ?");
    $stmt->execute([$input['class_id'], $input['student_id']]);
    
    echo json_encode(['success' => true, 'message' => 'Student removed from class successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
