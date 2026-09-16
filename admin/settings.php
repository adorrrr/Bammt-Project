<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

requireLogin();
$pdo = getDBConnection();

$msg = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_settings'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid security token.';
    } else {
        $fields = [
            'institute_name',
            'institute_code',
            'institute_email',
            'institute_phone',
            'institute_address',
            'principal_name'
        ];

        foreach ($fields as $f) {
            $val = cleanInput($_POST[$f] ?? '');
            setSystemSetting($pdo, $f, $val);
        }

        logAudit($pdo, 'UPDATE_SETTINGS', 'Updated institutional configuration and signature profiles');
        $msg = 'Institution settings and certificate configurations updated successfully.';
    }
}

$instName = getSystemSetting($pdo, 'institute_name', 'Bangladesh Academy of Medical Management Technology');
$instCode = getSystemSetting($pdo, 'institute_code', 'BAMMT-BD-88');
$instEmail = getSystemSetting($pdo, 'institute_email', 'info@bammt.com');
$instPhone = getSystemSetting($pdo, 'institute_phone', '+880 2-9883456');
$instAddress = getSystemSetting($pdo, 'institute_address', 'House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh');
$principalName = getSystemSetting($pdo, 'principal_name', 'Prof. Dr. M. A. Rahman');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Institution Settings — <?= h(SITE_NAME) ?></title>
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
            <h2>Institution &amp; Certificate Settings</h2>
            <p class="page-sub">Configure official institution name, affiliation code, contact coordinates, and certificate signatories.</p>
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

        <div class="card">
          <div class="card-header" style="margin-bottom:20px;">
            <div class="card-header-title-group">
              <div class="card-header-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
              </div>
              <h3>Institution Profile</h3>
            </div>
          </div>
          <form method="POST" action="<?= getAdminUrl('settings') ?>" class="form-grid">
            <?= csrfField() ?>
            <input type="hidden" name="save_settings" value="1">

            <div class="form-section-title"><span class="form-section-num">1</span> Institution Credentials</div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="institute_name">Institute Full Name *</label>
                <input type="text" id="institute_name" name="institute_name" value="<?= h($instName) ?>" required>
              </div>

              <div class="form-group">
                <label for="institute_code">Institution Code / Registration ID *</label>
                <input type="text" id="institute_code" name="institute_code" value="<?= h($instCode) ?>" required>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="institute_email">Official Email Address</label>
                <input type="email" id="institute_email" name="institute_email" value="<?= h($instEmail) ?>">
              </div>

              <div class="form-group">
                <label for="institute_phone">Helpline / Phone Number</label>
                <input type="text" id="institute_phone" name="institute_phone" value="<?= h($instPhone) ?>">
              </div>
            </div>

            <div class="form-group">
              <label for="institute_address">Physical Campus Address</label>
              <textarea id="institute_address" name="institute_address" rows="2"><?= h($instAddress) ?></textarea>
            </div>

            <div class="form-section-title"><span class="form-section-num">2</span> Certificate Authority &amp; Signatory</div>

            <div class="form-group">
              <label for="principal_name">Principal &amp; Director / Authorized Authority Name</label>
              <input type="text" id="principal_name" name="principal_name" value="<?= h($principalName) ?>">
            </div>

            <div class="form-actions mt-4">
              <button type="submit" class="btn btn-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Save All Settings
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
