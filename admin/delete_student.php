<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !verifyCSRFToken($_POST['csrf_token'] ?? '')) {
    redirect(getAdminUrl('students.php'));
}

$id = (int) ($_POST['id'] ?? 0);
if ($id > 0) {
    $pdo = getDBConnection();

    $stmt = $pdo->prepare("SELECT name, registration_no, photo FROM students WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();

    if ($row) {
        $del = $pdo->prepare("DELETE FROM students WHERE id = ?");
        $del->execute([$id]);

        if ($row['photo'] && is_file(UPLOAD_DIR . $row['photo'])) {
            @unlink(UPLOAD_DIR . $row['photo']);
        }

        logAudit($pdo, 'DELETE_STUDENT', 'Deleted student record for ' . $row['name'] . ' (' . $row['registration_no'] . ')');
    }
}

redirect(getAdminUrl('students.php') . '?deleted=1');
