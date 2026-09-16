<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

requireLogin();
$pdo = getDBConnection();

// Metrics counters
$totalStudents = (int) $pdo->query("SELECT COUNT(*) FROM students")->fetchColumn();
$totalNotices = (int) $pdo->query("SELECT COUNT(*) FROM notices WHERE is_active = 1")->fetchColumn();
$totalCourses = (int) $pdo->query("SELECT COUNT(DISTINCT subject) FROM students WHERE subject IS NOT NULL AND subject != ''")->fetchColumn();
$totalBatches = (int) $pdo->query("SELECT COUNT(DISTINCT passing_year) FROM students WHERE passing_year IS NOT NULL AND passing_year != ''")->fetchColumn();

// 10 Recent Students with Results
$recentStudentsStmt = $pdo->query("SELECT id, registration_no, name, father_name, subject, passing_year, cgpa, grade, photo FROM students ORDER BY id DESC LIMIT 10");
$recentStudents = $recentStudentsStmt->fetchAll() ?: [];

// Recent Notices
$recentNoticesStmt = $pdo->query("SELECT * FROM notices ORDER BY id DESC LIMIT 3");
$recentNotices = $recentNoticesStmt->fetchAll() ?: [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Dashboard — <?= h(SITE_NAME) ?></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="shortcut icon" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="stylesheet" href="<?= h(APP_BASE_PATH) ?>/assets/css/style.css?v=<?= filemtime(__DIR__ . '/../assets/css/style.css') ?>">
<style>
  /* Premium Dashboard Styles */
  .dashboard-top-section {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  @media (max-width: 992px) {
    .dashboard-top-section {
      grid-template-columns: 1fr;
    }
  }
  .quick-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  @media (max-width: 540px) {
    .quick-grid {
      grid-template-columns: 1fr;
    }
  }
  .quick-tile {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--surface-alt);
    border: 1px solid var(--ink-200);
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .quick-tile:hover {
    background: #ffffff;
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
  }
  .quick-tile-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  }
  .tile-blue { background: #e0f2fe; color: #0284c7; }
  .tile-emerald { background: #dcfce7; color: #16a34a; }
  .tile-purple { background: #f3e8ff; color: #9333ea; }
  .tile-amber { background: #fef3c7; color: #d97706; }
  
  .quick-tile-info {
    min-width: 0;
    flex: 1;
  }
  .quick-tile-title {
    display: block;
    font-size: 13.5px;
    font-weight: 700;
    color: var(--ink-900);
    line-height: 1.3;
  }
  .quick-tile-desc {
    display: block;
    font-size: 11.5px;
    color: var(--ink-500);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dash-notice-item {
    padding: 12px 14px;
    background: var(--surface-alt);
    border: 1px solid var(--ink-200);
    border-radius: 10px;
    margin-bottom: 10px;
    transition: all 0.15s ease;
  }
  .dash-notice-item:last-child {
    margin-bottom: 0;
  }
  .dash-notice-item:hover {
    background: #ffffff;
    border-color: var(--primary);
  }
  .dash-notice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    gap: 8px;
  }
  .dash-notice-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink-900);
    line-height: 1.35;
    margin: 0;
  }
  .dash-notice-date {
    font-size: 11.5px;
    color: var(--ink-400);
    font-weight: 600;
  }
</style>
</head>
<body class="admin-body">
  <div class="admin-layout">
    <?php include __DIR__ . '/_sidebar.php'; ?>

    <div class="admin-main-wrapper">
      <?php include __DIR__ . '/_nav.php'; ?>

      <main class="admin-content">
        <!-- Page Greeting Header -->
        <div class="page-header">
          <div>
            <h2>Admin Dashboard</h2>
            <p class="page-sub">Comprehensive overview of BAMMT student marksheet records, notice bulletins, and verification activities.</p>
          </div>
          <div class="page-header-actions">
            <a href="<?= getAdminUrl('add_student') ?>" class="btn btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add New Result
            </a>
            <a href="<?= getAdminUrl('notices') ?>" class="btn btn-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Post Notice
            </a>
          </div>
        </div>

        <?php if (isset($_GET['added'])): ?>
          <div class="alert alert-success">New student result record added successfully.</div>
        <?php elseif (isset($_GET['updated'])): ?>
          <div class="alert alert-success">Student result updated successfully.</div>
        <?php elseif (isset($_GET['deleted'])): ?>
          <div class="alert alert-success">Student record removed.</div>
        <?php endif; ?>

        <!-- 4 Metric Counter Cards Strip -->
        <div class="stats-grid mb-4">
          <div class="stat-card">
            <div class="stat-card-icon icon-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="stat-card-data">
              <span class="stat-number"><?= number_format($totalStudents) ?></span>
              <span class="stat-label">Total Student Results</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-icon icon-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div class="stat-card-data">
              <span class="stat-number"><?= number_format($totalNotices) ?></span>
              <span class="stat-label">Active Notices</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-icon icon-purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <div class="stat-card-data">
              <span class="stat-number"><?= number_format($totalCourses) ?></span>
              <span class="stat-label">Academic Departments</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-icon icon-amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="stat-card-data">
              <span class="stat-number"><?= number_format($totalBatches) ?></span>
              <span class="stat-label">Graduation Batches</span>
            </div>
          </div>
        </div>

        <!-- Upper Section: Quick Management & Live Notices -->
        <div class="dashboard-top-section">
          <!-- Left: Quick Management Shortcuts -->
          <div class="card">
            <div class="card-header">
              <h3>Quick Management</h3>
              <span class="badge badge-info" style="font-size:11.5px;">Control Hub</span>
            </div>

            <div class="quick-grid">
              <a href="<?= getAdminUrl('add_student') ?>" class="quick-tile">
                <div class="quick-tile-icon tile-blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
                <div class="quick-tile-info">
                  <strong class="quick-tile-title">Add Student Result</strong>
                  <span class="quick-tile-desc">Register scores &amp; marksheet</span>
                </div>
              </a>

              <a href="<?= getAdminUrl('students') ?>" class="quick-tile">
                <div class="quick-tile-icon tile-purple">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
                </div>
                <div class="quick-tile-info">
                  <strong class="quick-tile-title">Student Records</strong>
                  <span class="quick-tile-desc">Manage all (<?= $totalStudents ?>) entries</span>
                </div>
              </a>

              <a href="<?= getAdminUrl('notices') ?>" class="quick-tile">
                <div class="quick-tile-icon tile-emerald">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
                <div class="quick-tile-info">
                  <strong class="quick-tile-title">Notice Bulletins</strong>
                  <span class="quick-tile-desc">Publish announcements</span>
                </div>
              </a>

              <a href="<?= getAdminUrl('settings') ?>" class="quick-tile">
                <div class="quick-tile-icon tile-amber">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <div class="quick-tile-info">
                  <strong class="quick-tile-title">Portal Settings</strong>
                  <span class="quick-tile-desc">Institute info &amp; seals</span>
                </div>
              </a>
            </div>
          </div>

          <!-- Right: Live Notices Bulletins Feed -->
          <div class="card">
            <div class="card-header">
              <h3>Live Notice Board</h3>
              <a href="<?= getAdminUrl('notices') ?>" class="btn btn-xs btn-secondary">Manage All</a>
            </div>

            <?php if (empty($recentNotices)): ?>
              <div class="empty-state empty-state-sm">
                <div class="empty-state-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
                <p class="empty-state-title">No notices yet</p>
                <p class="empty-state-desc">Published bulletins will appear here.</p>
              </div>
            <?php else: ?>
              <div>
                <?php foreach ($recentNotices as $n): 
                  $cat = $n['category'] ?? 'General';
                  $catBadgeClass = 'badge-secondary';
                  if ($cat === 'Examinations') $catBadgeClass = 'badge-info';
                  elseif ($cat === 'Results') $catBadgeClass = 'badge-success';
                  elseif ($cat === 'Academic') $catBadgeClass = 'badge-warning';
                ?>
                  <div class="dash-notice-item">
                    <div class="dash-notice-header">
                      <span class="badge <?= $catBadgeClass ?>" style="font-size:10.5px;"><?= h($cat) ?></span>
                      <span class="dash-notice-date"><?= date('d M Y', strtotime($n['created_at'])) ?></span>
                    </div>
                    <h4 class="dash-notice-title"><?= h($n['title']) ?></h4>
                  </div>
                <?php endforeach; ?>
              </div>
            <?php endif; ?>
          </div>
        </div>

        <!-- Main Section: 10 Recent Student Result Entries -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 style="display:inline-flex; align-items:center; gap:8px;">
                <span>Recent Student Result Entries</span>
                <span class="badge badge-info" style="font-size:12px;">Last 10 Records</span>
              </h3>
            </div>
            <a href="<?= getAdminUrl('students') ?>" class="btn btn-sm btn-secondary">
              View All Registry (<?= number_format($totalStudents) ?>)
            </a>
          </div>

          <!-- Desktop Table View (PC / Laptops) -->
          <div class="table-responsive desktop-table-view">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 60px;">Photo</th>
                  <th style="width: 130px;">Reg No</th>
                  <th>Student Name</th>
                  <th>Course / Subject</th>
                  <th style="width: 110px;">Passing Year</th>
                  <th style="width: 130px;">CGPA / Grade</th>
                  <th style="width: 160px; text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <?php if (empty($recentStudents)): ?>
                  <tr>
                    <td colspan="7" class="empty-row" style="padding:0;">
                      <div class="empty-state">
                        <div class="empty-state-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <p class="empty-state-title">No student records yet</p>
                        <p class="empty-state-desc">Add your first student result to see it listed here.</p>
                        <a href="<?= getAdminUrl('add_student') ?>" class="btn btn-primary btn-sm">+ Add Student Result</a>
                      </div>
                    </td>
                  </tr>
                <?php else: ?>
                  <?php foreach ($recentStudents as $s): ?>
                    <?php $sPhoto = getPhotoUrl($s['photo'] ?? ''); ?>
                    <tr>
                      <td style="width:60px;">
                        <?php if ($sPhoto): ?>
                          <img src="<?= h($sPhoto) ?>" alt="<?= h($s['name']) ?>" class="table-avatar" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
                          <div class="table-avatar-fallback" style="display:none;"><?= h(initials($s['name'])) ?></div>
                        <?php else: ?>
                          <div class="table-avatar-fallback"><?= h(initials($s['name'])) ?></div>
                        <?php endif; ?>
                      </td>
                      <td>
                        <span class="table-reg-code"><?= h($s['registration_no']) ?></span>
                      </td>
                      <td>
                        <span class="table-student-name"><?= h($s['name']) ?></span>
                      </td>
                      <td>
                        <span class="table-course-badge"><?= h($s['subject']) ?></span>
                      </td>
                      <td>
                        <span class="table-year-badge"><?= h($s['passing_year'] ?: '—') ?></span>
                      </td>
                      <td>
                        <span class="badge badge-info" style="font-weight:700;"><?= h($s['cgpa'] ?: 'Passed') ?></span>
                        <?php if (!empty($s['grade'])): ?>
                          <span class="badge <?= in_array(strtoupper(trim($s['grade'])), ['A+', 'A', 'DISTINCTION']) ? 'badge-success' : 'badge-secondary' ?>" style="font-weight:700;"><?= h($s['grade']) ?></span>
                        <?php endif; ?>
                      </td>
                      <td style="text-align: right;">
                        <div class="table-actions" style="justify-content: flex-end;">
                          <a href="<?= h(APP_BASE_PATH) ?>/verify/<?= urlencode($s['registration_no']) ?>?from=admin" class="btn btn-xs btn-primary" title="View Public Verification Card">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Verify
                          </a>
                          <a href="<?= getAdminUrl('edit_student') ?>?id=<?= (int)$s['id'] ?>" class="btn btn-xs btn-secondary" title="Edit Student Record">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            Edit
                          </a>
                        </div>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                <?php endif; ?>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards View (Phones / Tablets) -->
          <div class="mobile-recent-list">
            <?php if (empty($recentStudents)): ?>
              <div class="empty-state empty-state-sm">
                <div class="empty-state-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <p class="empty-state-title">No student records yet</p>
              </div>
            <?php else: ?>
              <?php foreach ($recentStudents as $s): ?>
                <?php $sPhoto = getPhotoUrl($s['photo'] ?? ''); ?>
                <div class="mobile-student-record-card">
                  <!-- Header: Photo, Name, Reg -->
                  <div class="m-record-header">
                    <?php if ($sPhoto): ?>
                      <img src="<?= h($sPhoto) ?>" alt="<?= h($s['name']) ?>" class="m-record-avatar" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
                      <div class="m-record-avatar-fallback" style="display:none;"><?= h(initials($s['name'])) ?></div>
                    <?php else: ?>
                      <div class="m-record-avatar-fallback"><?= h(initials($s['name'])) ?></div>
                    <?php endif; ?>

                    <div class="m-record-title-box">
                      <div class="m-record-name"><?= h($s['name']) ?></div>
                    </div>

                    <div class="m-record-reg"><?= h($s['registration_no']) ?></div>
                  </div>

                  <!-- Details: Course, Year, CGPA, Grade -->
                  <div class="m-record-details">
                    <div class="m-record-course"><?= h($s['subject']) ?></div>
                    <div class="m-record-stats">
                      <span style="color:var(--ink-500); font-size:12px;">Passing Year: <strong><?= h($s['passing_year'] ?: '—') ?></strong></span>
                      <div style="display:flex; gap:4px; align-items:center;">
                        <span class="badge badge-info"><?= h($s['cgpa'] ?: 'Passed') ?></span>
                        <?php if (!empty($s['grade'])): ?>
                          <span class="badge <?= in_array(strtoupper(trim($s['grade'])), ['A+', 'A', 'DISTINCTION']) ? 'badge-success' : 'badge-secondary' ?>">
                            <?= h($s['grade']) ?>
                          </span>
                        <?php endif; ?>
                      </div>
                    </div>
                  </div>

                  <!-- Actions: View Card & Edit -->
                  <div class="m-record-actions-row" style="grid-template-columns: 1fr 1fr;">
                    <a href="<?= h(APP_BASE_PATH) ?>/verify/<?= urlencode($s['registration_no']) ?>?from=admin" class="btn btn-xs btn-primary">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      Verify Card
                    </a>
                    <a href="<?= getAdminUrl('edit_student') ?>?id=<?= (int)$s['id'] ?>" class="btn btn-xs btn-secondary">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      Edit
                    </a>
                  </div>
                </div>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </main>
    </div>
  </div>

  <script src="<?= h(APP_BASE_PATH) ?>/assets/js/admin.js?v=<?= filemtime(__DIR__ . '/../assets/js/admin.js') ?>"></script>
</body>
</html>
