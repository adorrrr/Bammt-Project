<?php
http_response_code(404);
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/includes/functions.php';

// Safe retrieval of institutional settings with graceful offline fallback
$instName = 'Bangladesh Academy of Medical Management Technology';
$instCode = 'BAMMT-BD-88';

try {
    require_once __DIR__ . '/config/database.php';
    $pdo = getDBConnection();
    $instName = getSystemSetting($pdo, 'institute_name', $instName);
    $instCode = getSystemSetting($pdo, 'institute_code', $instCode);
} catch (\Throwable $e) {
    // Suppress any technical database error details on 404
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 — Page Not Found | <?= h($instName) ?></title>
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="The requested page or verification record could not be found.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
  <link rel="stylesheet" href="<?= h(APP_BASE_PATH) ?>/assets/css/style.css">
  <style>
    .error-wrapper {
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      background: radial-gradient(circle at 50% 20%, #172033 0%, #070a12 85%);
      position: relative;
      overflow: hidden;
    }
    .error-card {
      max-width: 580px;
      width: 100%;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: var(--radius-2xl, 24px);
      padding: 48px 36px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      position: relative;
      z-index: 2;
      animation: cardEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .error-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.28);
      color: #f87171;
      font-size: 13px;
      font-weight: 700;
      border-radius: var(--radius-pill, 9999px);
      margin-bottom: 20px;
    }
    .error-tag-dot {
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
    }
    .error-code-num {
      font-family: var(--font-mono, monospace);
      font-size: 82px;
      font-weight: 800;
      line-height: 1;
      background: linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #6366f1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 14px;
      letter-spacing: -0.04em;
    }
    .error-title {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .error-message {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .error-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .error-buttons .btn {
      padding: 12px 22px;
      font-size: 14px;
      border-radius: var(--radius-md, 10px);
    }
    @media (max-width: 640px) {
      .error-card {
        padding: 36px 20px;
      }
      .error-code-num {
        font-size: 64px;
      }
      .error-title {
        font-size: 22px;
      }
      .error-buttons {
        flex-direction: column;
      }
      .error-buttons .btn {
        width: 100%;
      }
    }
  </style>
</head>
<body class="public-body">

  <!-- Header -->
  <header class="public-header">
    <div class="header-container">
      <a href="<?= h(APP_BASE_PATH) ?>/" class="brand-logo">
        <div class="brand-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-title">BAMMT</span>
          <span class="brand-sub">Official Portal</span>
        </div>
      </a>

      <nav class="public-nav">
        <a href="<?= h(APP_BASE_PATH) ?>/" class="nav-item">Verification Portal</a>
        <a href="<?= h(APP_BASE_PATH) ?>/#about" class="nav-item">About BAMMT</a>
        <a href="<?= h(APP_BASE_PATH) ?>/#notices" class="nav-item">Notices</a>
        <a href="<?= h(APP_BASE_PATH) ?>/#contact" class="nav-item btn-contact-nav">Contact Us</a>
      </nav>
    </div>
  </header>

  <!-- Error Presentation -->
  <main class="error-wrapper">
    <div class="error-card">
      <div class="error-tag">
        <span class="error-tag-dot"></span> Error 404
      </div>
      <div class="error-code-num">404</div>
      <h1 class="error-title">Page Not Found</h1>
      <p class="error-message">
        The requested URL, verification record, or resource does not exist or may have been moved.
      </p>

      <div class="error-buttons">
        <a href="<?= h(APP_BASE_PATH) ?>/" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Return to Verification Portal
        </a>
        <a href="<?= h(APP_BASE_PATH) ?>/admin/login" class="btn btn-secondary">
          Admin Login
        </a>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="public-footer">
    <div class="container footer-content">
      <div class="footer-brand">
        <h3>BAMMT</h3>
        <p><?= h($instName) ?></p>
        <p class="footer-code">Institute Code: <?= h($instCode) ?></p>
      </div>
      <div class="footer-copy">
        &copy; <?= date('Y') ?> BAMMT. All rights reserved. | Official Verification Portal
      </div>
    </div>
  </footer>

</body>
</html>
