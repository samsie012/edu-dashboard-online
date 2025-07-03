
<?php
require_once 'config.php';
checkRole('admin'); // Allow both admin and teacher to create courses

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $pdo->prepare("INSERT INTO courses (name, description, section, teacher_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $input['name'], 
        $input['description'] ?? '', 
        $input['section'] ?? 'A', 
        $input['teacher_id']
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Course created successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
