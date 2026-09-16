<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

requireLogin();
$pdo = getDBConnection();

$msg = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid security token. Please try again.';
    } else {
        $current = $_POST['current_password'] ?? '';
        $new = $_POST['new_password'] ?? '';
        $confirm = $_POST['confirm_password'] ?? '';

        if ($current === '' || $new === '' || $confirm === '') {
            $error = 'All fields are required.';
        } elseif ($new !== $confirm) {
            $error = 'New password and confirmation do not match.';
        } elseif (strlen($new) < 8) {
            $error = 'New password must be at least 8 characters long.';
        } else {
            $stmt = $pdo->prepare("SELECT password_hash FROM admins WHERE id = ?");
            $stmt->execute([$_SESSION['admin_id']]);
            $hash = $stmt->fetchColumn();

            if (!$hash || !password_verify($current, $hash)) {
                $error = 'Current password is incorrect.';
            } else {
                $newHash = password_hash($new, PASSWORD_BCRYPT);
                $update = $pdo->prepare("UPDATE admins SET password_hash = ? WHERE id = ?");
                $update->execute([$newHash, $_SESSION['admin_id']]);

                logAudit($pdo, 'CHANGE_PASSWORD', 'Admin updated login password');
                $msg = 'Password changed successfully.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Change Password — <?= h(SITE_NAME) ?></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="shortcut icon" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="stylesheet" href="<?= h(APP_BASE_PATH) ?>/assets/css/style.css?v=<?= filemtime(__DIR__ . '/../assets/css/style.css') ?>">
</head>
<body class="admin-body">
  <div class="admin-layout">
    <?php include __DIR__ . '/_sidebar.php'; ?>

    <div class="admin-main-wrapper">
      <?php include __DIR__ . '/_nav.php'; ?>

      <main class="admin-content">
        <div class="page-header">
          <div>
            <h2>Change Admin Password</h2>
            <p class="page-sub">Ensure your administrator account uses a strong, secure passphrase.</p>
          </div>
        </div>

        <?php if ($msg): ?>
          <div class="alert alert-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <?= $msg ?>
          </div>
        <?php endif; ?>
        <?php if ($error): ?>
          <div class="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <?= h($error) ?>
          </div>
        <?php endif; ?>

        <div class="card" style="max-width:540px;">
          <form method="POST" action="<?= getAdminUrl('change_password') ?>" class="form-grid">
            <?= csrfField() ?>

            <div class="form-group">
              <label for="current_password">Current Password *</label>
              <input type="password" id="current_password" name="current_password" required autocomplete="current-password">
            </div>

            <div class="form-group">
              <label for="new_password">New Password * (Min 8 characters)</label>
              <input type="password" id="new_password" name="new_password" required minlength="8" autocomplete="new-password">
            </div>

            <div class="form-group">
              <label for="confirm_password">Confirm New Password *</label>
              <input type="password" id="confirm_password" name="confirm_password" required minlength="8" autocomplete="new-password">
            </div>

            <div class="form-actions mt-4">
              <button type="submit" class="btn btn-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Update Password
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
  <script src="<?= h(APP_BASE_PATH) ?>/assets/js/admin.js?v=<?= filemtime(__DIR__ . '/../assets/js/admin.js') ?>"></script>
</body>
</html>
