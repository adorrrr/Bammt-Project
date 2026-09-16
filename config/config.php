<?php
/**
 * Site-wide configuration + secure session bootstrap.
 * This file MUST be included at the very top of every page, before any output.
 */

define('SITE_NAME', 'BAMMT - Bangladesh Academy of Medical Management Technology');

if (!isset($_SERVER['REQUEST_METHOD'])) {
    $_SERVER['REQUEST_METHOD'] = 'GET';
}

// Dynamically resolve the base URL path of the application
$__scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
if (basename($__scriptDir) === 'admin') {
    $__scriptDir = dirname($__scriptDir);
}
$__scriptDir = rtrim($__scriptDir, '/');
if ($__scriptDir === '.' || $__scriptDir === '/' || $__scriptDir === '\\') {
    $__scriptDir = '';
}
define('APP_BASE_PATH', $__scriptDir);

define('UPLOAD_DIR', __DIR__ . '/../uploads/photos/');
define('UPLOAD_URL', APP_BASE_PATH . '/uploads/photos/');
define('MAX_UPLOAD_SIZE', 2 * 1024 * 1024); // 2MB
define('ALLOWED_IMAGE_MIME', ['image/jpeg', 'image/png']);
define('ALLOWED_IMAGE_EXT', ['jpg', 'jpeg', 'png']);
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_LOCKOUT_MINUTES', 15);
define('SESSION_TIMEOUT_SECONDS', 3600); // 1 hour session

// Production Error Handling: Never expose errors or stack traces to browsers
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);
ini_set('log_errors', '1');

// Secure session cookie settings
ini_set('session.cookie_httponly', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.cookie_samesite', 'Strict');

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (!empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
if ($isHttps) {
    ini_set('session.cookie_secure', '1');
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'");
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// Idle session timeout
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > SESSION_TIMEOUT_SECONDS)) {
    $_SESSION = [];
    session_unset();
    session_destroy();
    session_start();
}
$_SESSION['LAST_ACTIVITY'] = time();
