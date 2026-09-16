<?php
/**
 * Database connection settings (Sample Template).
 * Copy this file to database.php and fill in your real credentials.
 */

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'YOUR_DATABASE_NAME');
define('DB_USER', getenv('DB_USER') ?: 'YOUR_DATABASE_USER');
define('DB_PASS', getenv('DB_PASS') ?: 'YOUR_DATABASE_PASSWORD');
define('DB_CHARSET', 'utf8mb4');

/**
 * Returns a shared PDO connection. Always uses prepared statements
 * (emulation disabled) to prevent SQL injection.
 */
function getDBConnection(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log('DB Connection failed: ' . $e->getMessage());
            http_response_code(500);
            die('Service temporarily unavailable. Please try again later.');
        }
    }

    return $pdo;
}
