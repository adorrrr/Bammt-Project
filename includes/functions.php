<?php
/**
 * Shared helper functions used across the BAMMT platform.
 */

/** Escape a string for safe HTML output (XSS Prevention). */
function h(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/** Trim and sanitize plain-text input. */
function cleanInput(?string $value): string
{
    return trim($value ?? '');
}

/** Generate or return session CSRF token. */
function generateCSRFToken(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/** Timing-safe CSRF token verification. */
function verifyCSRFToken(?string $token): bool
{
    return isset($_SESSION['csrf_token'], $token) && hash_equals($_SESSION['csrf_token'], $token);
}

/** Output hidden CSRF input field for forms. */
function csrfField(): string
{
    return '<input type="hidden" name="csrf_token" value="' . h(generateCSRFToken()) . '">';
}

function isLoggedIn(): bool
{
    return !empty($_SESSION['admin_id']);
}

/** Call at top of protected admin routes. */
function requireLogin(): void
{
    if (!isLoggedIn()) {
        header('Location: ' . getAdminUrl('login.php'));
        exit;
    }
}

function redirect(string $url): void
{
    header('Location: ' . $url);
    exit;
}

/** Generate proper clean extensionless URL under the admin namespace. */
function getAdminUrl(string $path = ''): string
{
    $path = ltrim($path, '/');
    if ($path === '') {
        return APP_BASE_PATH . '/admin';
    }
    // Automatically strip .php extension from URL
    $cleanPath = preg_replace('/\.php(\?|$)/', '$1', $path);
    return APP_BASE_PATH . '/admin/' . $cleanPath;
}

/** Per-IP brute-force protection for logins. */
function isRateLimited(PDO $pdo, string $ip): bool
{
    $stmt = $pdo->prepare(
        "SELECT COUNT(*) FROM login_attempts
         WHERE ip_address = ? AND success = 0
         AND attempt_time > (NOW() - INTERVAL ? MINUTE)"
    );
    $stmt->execute([$ip, LOGIN_LOCKOUT_MINUTES]);
    return (int) $stmt->fetchColumn() >= MAX_LOGIN_ATTEMPTS;
}

function recordLoginAttempt(PDO $pdo, string $ip, string $username, bool $success): void
{
    $stmt = $pdo->prepare(
        "INSERT INTO login_attempts (ip_address, username, success) VALUES (?, ?, ?)"
    );
    $stmt->execute([$ip, $username, $success ? 1 : 0]);
}

function clearOldAttempts(PDO $pdo, string $ip): void
{
    $stmt = $pdo->prepare("DELETE FROM login_attempts WHERE ip_address = ? AND attempt_time < (NOW() - INTERVAL 1 DAY)");
    $stmt->execute([$ip]);
}

/** Audit Logging for Admin actions */
function logAudit(PDO $pdo, string $action, string $details = ''): void
{
    try {
        $adminId = $_SESSION['admin_id'] ?? null;
        $adminUsername = $_SESSION['admin_username'] ?? 'System';
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

        $stmt = $pdo->prepare("INSERT INTO audit_logs (admin_id, admin_username, action, details, ip_address) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$adminId, $adminUsername, $action, $details, $ip]);
    } catch (Throwable $e) {
        // Silently skip if table is deleted or not present
    }
}

/** Log Public Verification Attempts */
function logVerificationAttempt(PDO $pdo, string $regNo, string $status): void
{
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 255);

        $stmt = $pdo->prepare("INSERT INTO verification_logs (registration_no_searched, status, ip_address, user_agent) VALUES (?, ?, ?, ?)");
        $stmt->execute([$regNo, $status, $ip, $ua]);
    } catch (Throwable $e) {
        // Silently skip if table is deleted or not present
    }
}

/** Get system setting by key */
function getSystemSetting(PDO $pdo, string $key, string $default = '', bool $reload = false): string
{
    static $settingsCache = null;
    if ($settingsCache === null || $reload) {
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
        $settingsCache = $stmt->fetchAll(PDO::FETCH_KEY_PAIR) ?: [];
    }
    return $settingsCache[$key] ?? $default;
}

/** Set system setting by key */
function setSystemSetting(PDO $pdo, string $key, string $value): void
{
    $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
    $stmt->execute([$key, $value]);
    getSystemSetting($pdo, '', '', true);
}

/** Get complete web URL for student photo */
function getPhotoUrl(?string $photo): string
{
    if (!$photo || trim($photo) === '') {
        return '';
    }
    $photo = trim($photo);
    if (str_starts_with($photo, 'http://') || str_starts_with($photo, 'https://') || str_starts_with($photo, 'data:')) {
        return $photo;
    }
    $filename = basename($photo);
    return UPLOAD_URL . $filename;
}

/** Check if photo file actually exists on server disk */
function photoExists(?string $photo): bool
{
    if (!$photo || trim($photo) === '') {
        return false;
    }
    $filename = basename($photo);
    return is_file(UPLOAD_DIR . $filename);
}

/** Validate and save photo uploads safely */
function handlePhotoUpload(array $file, ?string $oldFilename = null): ?string
{
    if (!isset($file['error']) || $file['error'] === UPLOAD_ERR_NO_FILE) {
        return $oldFilename;
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Photo upload failed. Error code: ' . $file['error']);
    }
    if ($file['size'] > MAX_UPLOAD_SIZE) {
        throw new Exception('Photo is too large. Maximum allowed size is 2MB.');
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime, ALLOWED_IMAGE_MIME, true)) {
        throw new Exception('Only JPG and PNG images are allowed.');
    }

    $ext = $mime === 'image/png' ? 'png' : 'jpg';

    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }

    $newFilename = bin2hex(random_bytes(16)) . '.' . $ext;
    $destination = UPLOAD_DIR . $newFilename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception('Could not save uploaded photo to storage.');
    }

    if ($oldFilename && is_file(UPLOAD_DIR . basename($oldFilename))) {
        @unlink(UPLOAD_DIR . basename($oldFilename));
    }

    return $newFilename;
}

/** Get initials for avatar fallback. */
function initials(string $name): string
{
    $hasMb = function_exists('mb_substr');
    $sub = fn(string $s, int $len) => $hasMb ? mb_substr($s, 0, $len, 'UTF-8') : substr($s, 0, $len);
    $upper = fn(string $s) => $hasMb ? mb_strtoupper($s, 'UTF-8') : strtoupper($s);

    $parts = array_filter(preg_split('/\s+/', trim($name)));
    if (empty($parts)) {
        return 'ST';
    }
    if (count($parts) === 1) {
        return $upper($sub(reset($parts), 2));
    }
    return $upper($sub(reset($parts), 1) . $sub(end($parts), 1));
}

/** Validate registration number format. */
function isValidRegistrationNo(string $value): bool
{
    return (bool) preg_match('/^[A-Za-z0-9\-\/]{2,50}$/', $value);
}

/** Generate custom shareable verification URL for student (e.g. bammt.com/verify/RI-408) */
function getShareableVerifyUrl(string $regNo, bool $absolute = false): string
{
    $cleanReg = rawurlencode($regNo);
    if ($absolute) {
        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
            || (!empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
        $protocol = $isHttps ? 'https://' : 'http://';
        $host = $_SERVER['HTTP_HOST'] ?? 'bammt.com';
        return $protocol . $host . APP_BASE_PATH . '/verify/' . $cleanReg;
    }
    return APP_BASE_PATH . '/verify/' . $cleanReg;
}
