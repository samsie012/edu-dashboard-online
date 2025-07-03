
<?php
require_once 'config.php';
checkRole('admin');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $pdo->prepare("UPDATE classes SET name = ?, year = ?, cohort = ?, description = ?, status = ? WHERE id = ?");
    $stmt->execute([
        $input['name'], 
        $input['year'], 
        $input['cohort'], 
        $input['description'], 
        $input['status'], 
        $input['class_id']
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Class updated successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
