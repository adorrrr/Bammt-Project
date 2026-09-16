<?php
/**
 * Admin Entrypoint Router.
 * Automatically routes /admin/ or /admin to dashboard or login,
 * ensuring directory listing is never exposed even without mod_rewrite.
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/functions.php';

if (isLoggedIn()) {
    redirect(getAdminUrl('dashboard.php'));
} else {
    redirect(getAdminUrl('login.php'));
}
