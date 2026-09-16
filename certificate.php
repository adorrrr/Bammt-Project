<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

$reg = cleanInput($_GET['reg'] ?? '');

// If accessed via custom pretty link e.g. /verify/RI-408 or /result/RI-408
if ($reg === '') {
    $reqUri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    $path = trim(str_replace('\\', '/', $reqUri), '/');
    $parts = explode('/', $path);
    if (!empty($parts)) {
        $last = cleanInput(end($parts));
        $prev = count($parts) >= 2 ? $parts[count($parts) - 2] : '';
        if (in_array($prev, ['verify', 'result', 'v']) && isValidRegistrationNo($last)) {
            $reg = $last;
        }
    }
}

if ($reg === '' || !isValidRegistrationNo($reg)) {
    redirect(APP_BASE_PATH . '/');
}

$pdo = getDBConnection();

// Fetch student record
$stmt = $pdo->prepare("SELECT * FROM students WHERE registration_no = ? LIMIT 1");
$stmt->execute([$reg]);
$student = $stmt->fetch();

if (!$student) {
    redirect(APP_BASE_PATH . '/?reg=' . urlencode($reg));
}

// Fetch Marksheet Result record
$resStmt = $pdo->prepare("SELECT * FROM results WHERE student_id = ? LIMIT 1");
$resStmt->execute([$student['id']]);
$resultData = $resStmt->fetch();

// Status logic
$isRevoked = ($student['status'] === 'revoked');

// Navigation back link logic
$from = ($_GET['from'] ?? '') === 'admin' ? 'admin' : 'public';
$backUrl = $from === 'admin' ? getAdminUrl('students') : (APP_BASE_PATH . '/');
$backLabel = $from === 'admin' ? 'Back to Admin' : 'New Search';

$dob = $student['date_of_birth'] ? date('d F Y', strtotime($student['date_of_birth'])) : 'Not Provided';
$issueDate = date('d F Y');
$certNo = 'BAMMT-' . date('Y') . '-' . str_pad($student['id'], 4, '0', STR_PAD_LEFT);
$photoUrl = getPhotoUrl($student['photo'] ?? '');

// Institution details
$instName = getSystemSetting($pdo, 'institute_name', 'Bangladesh Academy of Medical Management Technology');
$instCode = getSystemSetting($pdo, 'institute_code', 'BAMMT-BD-88');
$principalName = getSystemSetting($pdo, 'principal_name', 'Prof. Dr. M. A. Rahman');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= h($student['name']) ?> — Result Verification — <?= h(SITE_NAME) ?></title>
<meta name="description" content="Official student transcript and result verification for <?= h($student['name']) ?> (<?= h($student['registration_no']) ?>)">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="shortcut icon" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="stylesheet" href="<?= h(APP_BASE_PATH) ?>/assets/css/style.css">
</head>
<body class="verify-page-backdrop">

  <!-- Top Clean Navigation Bar -->
  <div class="verify-header-nav no-print">
    <div class="verify-nav-brand">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
      <span>BAMMT Official Portal</span>
    </div>
  </div>

  <!-- Modern Floating Profile Card (Cleaned Result Verify Card) -->
  <main class="verify-profile-card">
    
    <!-- Top Scenic / Gradient Banner -->
    <div class="verify-card-banner">
      <div class="verify-banner-overlay"></div>
    </div>

    <div class="verify-profile-body">
      
      <!-- Overlapping Avatar & Top Action Button -->
      <div class="verify-avatar-floating-wrapper">
        <?php if ($photoUrl): ?>
          <img src="<?= h($photoUrl) ?>" alt="<?= h($student['name']) ?>" class="verify-avatar-img" id="resultAvatarImg" onerror="this.style.display='none'; var fb=document.getElementById('resultAvatarFallback'); if(fb) fb.style.display='flex';">
          <div class="verify-avatar-fallback" id="resultAvatarFallback" style="display:none;"><?= h(initials($student['name'])) ?></div>
        <?php else: ?>
          <div class="verify-avatar-fallback"><?= h(initials($student['name'])) ?></div>
        <?php endif; ?>

        <button type="button" class="verify-top-btn no-print" onclick="window.print();">Print Result</button>
      </div>

      <!-- Revocation Notice if Revoked -->
      <?php if ($isRevoked): ?>
        <div class="alert alert-error mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>ATTENTION: REVOKED RECORD</strong>
            <p style="font-size:12.5px; margin-top:2px;">This student result record is currently marked as inactive or revoked.</p>
          </div>
        </div>
      <?php endif; ?>

      <!-- Name & Blue Verified Badge -->
      <h1 class="verify-name-title">
        <span><?= h($student['name']) ?></span>
        <?php if (!$isRevoked): ?>
          <span class="verified-blue-badge" title="Official Verified BAMMT Record">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.6 2.25A2.25 2.25 0 0 0 6.63 3.6L5.8 5.4a2.25 2.25 0 0 1-1.2 1.2l-1.8.83a2.25 2.25 0 0 0-1.35 1.97v2a2.25 2.25 0 0 0 .58 1.5l1.37 1.48a2.25 2.25 0 0 1 .55 1.63l-.22 2a2.25 2.25 0 0 0 1.13 2.12l1.74.99a2.25 2.25 0 0 1 1.09 1.34l.6 1.92a2.25 2.25 0 0 0 2.15 1.58h2a2.25 2.25 0 0 0 2.15-1.58l.6-1.92a2.25 2.25 0 0 1 1.09-1.34l1.74-.99a2.25 2.25 0 0 0 1.13-2.12l-.22-2a2.25 2.25 0 0 1 .55-1.63l1.37-1.48a2.25 2.25 0 0 0 .58-1.5v-2a2.25 2.25 0 0 0-1.35-1.97l-1.8-.83a2.25 2.25 0 0 1-1.2-1.2l-.83-1.8A2.25 2.25 0 0 0 15.4 2.25h-6.8Zm6.47 7.28a.75.75 0 0 0-1.06-1.06l-4.5 4.5-1.97-1.97a.75.75 0 1 0-1.06 1.06l2.5 2.5c.3.3.77.3 1.06 0l5.03-5.03Z"/>
            </svg>
          </span>
        <?php endif; ?>
      </h1>

      <!-- Clean 3-Stat Metric Row (Registration No, Passing Year, CGPA / Grade) -->
      <div class="verify-stats-grid verify-stats-grid-3">
        <div class="verify-stat-col">
          <span class="verify-stat-label">Registration No</span>
          <span class="verify-stat-value"><?= h($student['registration_no']) ?></span>
        </div>
        <div class="verify-stat-col">
          <span class="verify-stat-label">Passing Year</span>
          <span class="verify-stat-value"><?= h($student['passing_year'] ?: '—') ?></span>
        </div>
        <div class="verify-stat-col">
          <span class="verify-stat-label">CGPA / Grade</span>
          <span class="verify-stat-value <?= $isRevoked ? 'text-danger' : '' ?>">
            <?= h($student['cgpa'] ?: 'Passed') ?> <?= $student['grade'] ? '(' . h($student['grade']) . ')' : '' ?>
          </span>
        </div>
      </div>

      <!-- Section 1: Public Profile / Student Details -->
      <div class="verify-form-section">
        <div class="verify-section-label-group">
          <div class="verify-section-heading">Public profile</div>
          <div class="verify-section-caption">Verified academic details recorded in BAMMT central registry.</div>
        </div>

        <div class="verify-input-box">
          <span><?= h($student['name']) ?></span>
          <span style="font-size:12px; color:var(--ink-400);">Full Legal Name</span>
        </div>

        <div class="verify-input-box split-box" id="shareableLinkBox" data-copy="<?= h(getShareableVerifyUrl($student['registration_no'], true)) ?>" title="Click to copy student result verification link" style="cursor:pointer;">
          <div class="split-prefix">bammt.com/verify/</div>
          <div class="split-main" style="display:flex; justify-content:space-between; align-items:center;">
            <span><?= h($student['registration_no']) ?></span>
            <span class="copy-hint-badge" id="copyBadge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy Link</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Section 2: Guardian & Course Details -->
      <div class="verify-form-section">
        <div class="verify-section-label-group">
          <div class="verify-section-heading">Student &amp; Course Details</div>
          <div class="verify-section-caption">Parental lineage and course of study verification.</div>
        </div>

        <div class="verify-input-box">
          <span><?= h($student['father_name'] ?: 'Not Stated') ?></span>
          <span style="font-size:12px; color:var(--ink-400);">Father's Name</span>
        </div>

        <div class="verify-input-box">
          <span><?= h($student['mother_name'] ?: 'Not Stated') ?></span>
          <span style="font-size:12px; color:var(--ink-400);">Mother's Name</span>
        </div>

        <div class="verify-input-box">
          <span><?= h($student['subject'] ?: 'Medical Technology') ?></span>
          <span style="font-size:12px; color:var(--ink-400);">Subject / Department</span>
        </div>

        <div class="verify-input-box">
          <span><?= h($dob) ?></span>
          <span style="font-size:12px; color:var(--ink-400);">Date of Birth</span>
        </div>
      </div>

      <!-- Action Buttons Footer -->
      <div class="verify-action-footer no-print">
        <a href="<?= h($backUrl) ?>" class="btn-verify-cancel"><?= h($backLabel) ?></a>
        <button type="button" class="btn-verify-save" id="btnPrintResult">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span>Print Result Copy</span>
        </button>
      </div>

    </div>
  </main>

  <!-- ============================================================
       PRINT-ONLY OFFICIAL ACADEMIC RESULT & TRANSCRIPT (EXACT 1-PAGE A4)
       ============================================================ -->
  <div class="print-only-sheet">
    <div class="print-main-content">
      <div class="print-official-header">
        <h1 class="print-inst-title">BANGLADESH ACADEMY OF MEDICAL MANAGEMENT TECHNOLOGY (BAMMT)</h1>
        <p class="print-inst-sub">Government Approved Medical Technology Institute &bull; Institute Code: <?= h($instCode) ?></p>
        <h2 class="print-doc-title">OFFICIAL ACADEMIC RESULT &amp; TRANSCRIPT RECORD</h2>
      </div>

      <div class="print-student-section">
        <div class="print-student-info">
          <h2><?= h($student['name']) ?></h2>
          <p class="print-meta-p"><strong>Registration Number:</strong> <?= h($student['registration_no']) ?></p>
          <p class="print-meta-p"><strong>Course / Department:</strong> <?= h($student['subject']) ?></p>
          <p class="print-meta-p"><strong>Father's Name:</strong> <?= h($student['father_name'] ?: 'N/A') ?> &nbsp;|&nbsp; <strong>Mother's Name:</strong> <?= h($student['mother_name'] ?: 'N/A') ?></p>
          <p class="print-meta-p"><strong>Date of Birth:</strong> <?= h($dob) ?></p>
          <p class="print-meta-p"><strong>Verification Serial:</strong> <?= h($certNo) ?> &nbsp;|&nbsp; <strong>Date:</strong> <?= h($issueDate) ?></p>
        </div>

        <div>
          <?php if ($photoUrl): ?>
            <img src="<?= h($photoUrl) ?>" alt="Photo" class="print-photo">
          <?php endif; ?>
        </div>
      </div>

      <table class="print-table">
        <thead>
          <tr>
            <th style="width: 40%;">Academic Item / Parameter</th>
            <th style="width: 60%;">Official Record Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Subject / Program</strong></td>
            <td><?= h($student['subject']) ?></td>
          </tr>
          <tr>
            <td><strong>Passing Year / Session</strong></td>
            <td><?= h($student['passing_year'] ?: '—') ?></td>
          </tr>
          <tr>
            <td><strong>Examination Title</strong></td>
            <td><?= h($resultData['exam_name'] ?? 'Final Diploma Examination') ?></td>
          </tr>
          <tr>
            <td><strong>Cumulative GPA (CGPA)</strong></td>
            <td><strong><?= h($student['cgpa'] ?: '—') ?></strong></td>
          </tr>
          <tr>
            <td><strong>Letter Grade</strong></td>
            <td><strong><?= h($student['grade'] ?: 'Passed') ?></strong></td>
          </tr>
        </tbody>
      </table>

      <div class="print-signatures-row" style="justify-content:flex-end;">
        <div class="print-sig-col">
          <div class="print-sig-line"><?= h($principalName) ?></div>
          <div class="print-sig-title">Principal &amp; Director / Authorized Authority</div>
        </div>
      </div>
    </div>

    <div class="print-footer-audit">
      <span>Verified Online via BAMMT Central Verification Portal (bammt.com)</span>
      <span>Date Printed: <?= date('d F Y, h:i A') ?></span>
    </div>
  </div>

  <script src="<?= h(APP_BASE_PATH) ?>/assets/js/certificate.js"></script>
</body>
</html>
