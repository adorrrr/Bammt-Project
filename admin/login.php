<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

if (isLoggedIn()) {
    redirect(getAdminUrl('dashboard'));
}

$error = '';
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = getDBConnection();

    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid security token. Please refresh the page.';
    } elseif (isRateLimited($pdo, $ip)) {
        $error = 'Too many failed login attempts. Please try again in ' . LOGIN_LOCKOUT_MINUTES . ' minutes.';
    } else {
        $username = cleanInput($_POST['username'] ?? '');
        $password = (string) ($_POST['password'] ?? '');

        $stmt = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password_hash'])) {
            recordLoginAttempt($pdo, $ip, $username, true);
            clearOldAttempts($pdo, $ip);

            // Establish secure admin session
            session_regenerate_id(true);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = (int) $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            $_SESSION['LAST_ACTIVITY'] = time();

            logAudit($pdo, 'ADMIN_LOGIN_SUCCESS', 'Admin ' . $admin['username'] . ' successfully logged in');
            redirect(getAdminUrl('dashboard'));
        } else {
            recordLoginAttempt($pdo, $ip, $username, false);
            $error = 'Invalid administrative username or password.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
<title>Admin Portal Authentication — <?= h(SITE_NAME) ?></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="shortcut icon" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="stylesheet" href="<?= h(APP_BASE_PATH) ?>/assets/css/style.css?v=<?= filemtime(__DIR__ . '/../assets/css/style.css') ?>">
<style>
  * {
    box-sizing: border-box;
  }
  body {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 50% 10%, #1e293b 0%, #0b0f19 80%);
    padding: 20px 16px;
    margin: 0;
    font-family: var(--font-sans);
    overflow-x: hidden;
  }
  .login-card {
    width: 100%;
    max-width: 420px;
    background: rgba(30, 41, 59, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--radius-xl);
    padding: 36px 32px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);
    color: #fff;
    text-align: left;
    margin: auto;
  }
  .login-header {
    text-align: center;
    margin-bottom: 26px;
  }
  .login-icon {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, #0284c7, #38bdf8);
    color: #0b0f19;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
    box-shadow: 0 8px 16px rgba(2, 132, 199, 0.4);
  }
  .login-header h1 {
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 4px;
    color: #ffffff;
  }
  .login-header p {
    font-size: 13px;
    color: #94a3b8;
    margin: 0;
  }
  .login-form .form-group {
    margin-bottom: 18px;
  }
  .login-form label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #cbd5e1;
    margin-bottom: 6px;
  }
  .login-form input {
    width: 100%;
    padding: 13px 15px;
    background: #0b0f19;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: #fff;
    font-size: 16px; /* Prevents auto-zoom on iOS */
    font-family: var(--font-sans);
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .login-form input:focus {
    border-color: #38bdf8;
    outline: none;
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
  }
  .login-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #0284c7, #0369a1);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all .15s ease;
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
    margin-top: 6px;
  }
  .login-btn:hover {
    background: linear-gradient(135deg, #0369a1, #075985);
    transform: translateY(-1px);
  }
  .login-btn.is-loading { opacity: .8; pointer-events: none; }
  .login-footer {
    text-align: center;
    margin-top: 22px;
    font-size: 13px;
    color: #64748b;
  }
  .login-footer a {
    color: #38bdf8;
    font-weight: 600;
    text-decoration: none;
  }
  .login-footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    body {
      padding: 16px 12px;
    }
    .login-card {
      padding: 28px 20px;
      border-radius: 16px;
    }
    .login-header h1 {
      font-size: 20px;
    }
    .login-header p {
      font-size: 12.5px;
    }
    .login-icon {
      width: 46px;
      height: 46px;
      margin-bottom: 12px;
    }
    .login-icon svg {
      width: 22px;
      height: 22px;
    }
    .login-form .form-group {
      margin-bottom: 16px;
    }
    .login-btn {
      padding: 13px;
      font-size: 14.5px;
    }
  }
</style>
</head>
<body>
  <div class="login-card">
    <div class="login-header">
      <div class="login-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <h1>Admin Portal</h1>
      <p>Secure authentication for BAMMT officials</p>
    </div>

    <?php if ($error): ?>
      <div class="alert alert-error mb-4" style="font-size: 13px; padding: 10px 14px;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <?= h($error) ?>
      </div>
    <?php endif; ?>

    <form method="POST" action="<?= getAdminUrl('login') ?>" class="login-form" autocomplete="off">
      <?= csrfField() ?>

      <div class="form-group">
        <label for="username">Administrator Username</label>
        <input type="text" id="username" name="username" required autofocus placeholder="Enter admin username">
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required placeholder="Enter password">
      </div>

      <button type="submit" class="login-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Sign In to Dashboard
      </button>
    </form>

    <div class="login-footer">
      <a href="<?= h(APP_BASE_PATH) ?>/">← Back to Public Verification Portal</a>
    </div>
  </div>
</body>
</html>
