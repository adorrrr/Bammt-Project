<?php
/**
 * Database connection settings.
 *
 * SECURITY NOTE: In production, prefer loading these values from environment
 * variables (e.g. via a .env file that is NOT web-accessible) instead of
 * hardcoding credentials in a versioned file. Kept simple here for clarity.
 */

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'rizvi_bammt');
define('DB_USER', getenv('DB_USER') ?: 'rizvi_bammt');
define('DB_PASS', getenv('DB_PASS') ?: 'Rizvi2026Secure!');
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
            PDO::ATTR_EMULATE_PREPARES   => false, // real prepared statements
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Never leak raw DB error details to the browser
            error_log('DB Connection failed: ' . $e->getMessage());
            http_response_code(500);
            die('Service temporarily unavailable. Please try again later.');
        }
    }

    return $pdo;
}
