<?php
/**
 * One-time helper to create the first admin account.
 *
 * Run this ONCE from the command line on your server:
 *     php database/create_admin.php
 *
 * Do NOT leave this file reachable from a browser on a live server.
 * After creating your admin, delete this file or move it outside the web root.
 */

if (php_sapi_name() !== 'cli') {
    die('For security, this script can only be run from the command line (php database/create_admin.php).');
}

require_once __DIR__ . '/../config/database.php';

echo "=== BAMMT Admin Account Creator ===\n";
echo "Username: ";
$username = trim(fgets(STDIN));

echo "Password (min 8 characters): ";
$password = trim(fgets(STDIN));

if (strlen($username) < 3) {
    die("Username must be at least 3 characters.\n");
}
if (strlen($password) < 8) {
    die("Password must be at least 8 characters.\n");
}

$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)");
    $stmt->execute([$username, $hash]);
    echo "Admin account '{$username}' created successfully.\n";
    echo "You can now log in at admin/login.php\n";
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        die("Error: username already exists.\n");
    }
    die("Error creating admin: " . $e->getMessage() . "\n");
}
