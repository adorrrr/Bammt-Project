<?php
/**
 * ONE-TIME browser-based admin account creator.
 *
 * For shared hosting where SSH/terminal access is not available.
 *
 * SECURITY:
 * - This script REFUSES to run if an admin account already exists in the
 *   database, so it can only ever be used once - even if someone finds
 *   the URL later, it will do nothing after your first admin is created.
 * - Even so, DELETE THIS FILE from your server immediately after you
 *   successfully create your admin account. Do not leave it sitting there.
 */

require_once __DIR__ . '/config/database.php';

$pdo = getDBConnection();

// Hard stop if an admin already exists - makes this script single-use.
$existingCount = (int) $pdo->query("SELECT COUNT(*) FROM admins")->fetchColumn();
if ($existingCount > 0) {
    http_response_code(403);
    die('<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:60px auto;text-align:center;">
        <h2>Setup already completed</h2>
        <p>An admin account already exists, so this script will not run again.</p>
        <p><strong>Please delete this file (setup_admin.php) from your server now.</strong></p>
        <p><a href="admin/login.php">Go to Admin Login</a></p>
        </body></html>');
}

$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = (string) ($_POST['password'] ?? '');
    $confirm  = (string) ($_POST['confirm_password'] ?? '');

    if (strlen($username) < 3) {
        $errors[] = 'Username must be at least 3 characters.';
    }
    if (strlen($password) < 8) {
        $errors[] = 'Password must be at least 8 characters.';
    }
    if ($password !== $confirm) {
        $errors[] = 'Password and confirmation do not match.';
    }

    if (empty($errors)) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)");
        $stmt->execute([$username, $hash]);
        $success = true;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BAMMT - One-Time Admin Setup</title>
<link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">
<link rel="shortcut icon" href="assets/images/favicon.svg">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;
    margin:0;
    color: #0f172a;
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background:
      radial-gradient(1200px 500px at 50% -10%, #d8ece7 0%, transparent 60%),
      linear-gradient(180deg, #eaf2f0 0%, #f3f5f3 45%, #f6f2ea 100%);
    padding: 24px;
  }
  .box { width:100%; max-width: 400px; background:#fff; padding:36px 32px; border-radius:26px; box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 24px 48px -24px rgba(15,23,42,0.22); }
  h1 { font-size:20px; font-weight:800; margin: 0 0 6px; letter-spacing: -0.01em; }
  p { color: #64748b; font-size: 13.5px; line-height:1.5; }
  label { display:block; font-size:12.5px; font-weight:600; color:#334155; margin:14px 0 6px; }
  label:first-of-type { margin-top: 18px; }
  input { width:100%; padding:11px 13px; border:1px solid #e6ebf0; border-radius:10px; box-sizing:border-box; font-size:14.5px; background:#f8fafb; }
  input:focus { outline: none; border-color:#2563eb; background:#fff; }
  button { margin-top:22px; width:100%; padding:12px; background:#0f172a; color:#fff; border:none; border-radius:999px; font-weight:600; font-size:14.5px; cursor:pointer; }
  button:hover { background:#1e293b; }
  .alert { padding:13px 16px; border-radius:10px; margin-bottom:14px; font-size:13.5px; line-height:1.5; }
  .alert-error { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }
  .alert-success { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }
  .warn { background:#fffbeb; color:#92400e; border:1px solid #fde68a; padding:13px 16px; border-radius:10px; font-size:12.5px; margin-top:20px; line-height:1.5; }
  a { color:#2563eb; text-decoration:none; font-weight:600; font-size:13.5px; }
</style>
</head>
<body>
  <div class="box">
    <h1>BAMMT - Create Admin Account</h1>

    <?php if ($success): ?>
      <div class="alert alert-success">
        Admin account "<?= htmlspecialchars($_POST['username'], ENT_QUOTES) ?>" created successfully.
      </div>
      <p><a href="admin/login">Go to Admin Login</a></p>
      <div class="warn">
        <strong>Important:</strong> Delete this file (<code>setup_admin.php</code>) from your
        server now. It will refuse to run again, but leaving it on the server is unnecessary risk.
      </div>
    <?php else: ?>
      <?php foreach ($errors as $err): ?>
        <div class="alert alert-error"><?= htmlspecialchars($err, ENT_QUOTES) ?></div>
      <?php endforeach; ?>

      <form method="POST" autocomplete="off">
        <label>Username</label>
        <input type="text" name="username" required maxlength="50" value="<?= htmlspecialchars($_POST['username'] ?? '', ENT_QUOTES) ?>">

        <label>Password (min 8 characters)</label>
        <input type="password" name="password" required minlength="8">

        <label>Confirm Password</label>
        <input type="password" name="confirm_password" required minlength="8">

        <button type="submit">Create Admin Account</button>
      </form>
      <div class="warn">
        This form only works once. As soon as an admin account is created, it locks itself.
        Delete this file right after you're done.
      </div>
    <?php endif; ?>
  </div>
</body>
</html>
