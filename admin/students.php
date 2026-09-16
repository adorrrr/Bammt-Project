<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

requireLogin();
$pdo = getDBConnection();

$search = cleanInput($_GET['q'] ?? '');
$filterSubject = cleanInput($_GET['subject'] ?? '');
$filterYear = cleanInput($_GET['year'] ?? '');

$perPage = 10;
$page = max(1, (int) ($_GET['page'] ?? 1));
$offset = ($page - 1) * $perPage;

$whereClauses = [];
$params = [];

if ($search !== '') {
    $whereClauses[] = "(registration_no LIKE ? OR name LIKE ? OR father_name LIKE ?)";
    $like = '%' . $search . '%';
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
}

if ($filterSubject !== '') {
    $whereClauses[] = "subject = ?";
    $params[] = $filterSubject;
}

if ($filterYear !== '') {
    $whereClauses[] = "passing_year = ?";
    $params[] = $filterYear;
}

$whereSql = empty($whereClauses) ? '' : ' WHERE ' . implode(' AND ', $whereClauses);

// Count total matching
$countStmt = $pdo->prepare("SELECT COUNT(*) FROM students" . $whereSql);
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();

// Fetch Paginated
$sql = "SELECT * FROM students" . $whereSql . " ORDER BY id DESC LIMIT ? OFFSET ?";
$stmt = $pdo->prepare($sql);

$paramIndex = 1;
foreach ($params as $param) {
    $stmt->bindValue($paramIndex++, $param);
}
$stmt->bindValue($paramIndex++, $perPage, PDO::PARAM_INT);
$stmt->bindValue($paramIndex++, $offset, PDO::PARAM_INT);
$stmt->execute();
$students = $stmt->fetchAll();

$totalPages = max(1, (int) ceil($total / $perPage));

// Summary statistics
$totalAllStudents = (int) $pdo->query("SELECT COUNT(*) FROM students")->fetchColumn();
$subjects = $pdo->query("SELECT DISTINCT subject FROM students WHERE subject IS NOT NULL AND subject != '' ORDER BY subject ASC")->fetchAll(PDO::FETCH_COLUMN);
$years = $pdo->query("SELECT DISTINCT passing_year FROM students WHERE passing_year IS NOT NULL AND passing_year != '' ORDER BY passing_year DESC")->fetchAll(PDO::FETCH_COLUMN);

$totalCoursesCount = count($subjects);
$totalYearsCount = count($years);

$startCount = $total > 0 ? ($offset + 1) : 0;
$endCount = min($offset + $perPage, $total);
$hasActiveFilters = ($search !== '' || $filterSubject !== '' || $filterYear !== '');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Student Results Database — <?= h(SITE_NAME) ?></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="shortcut icon" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="stylesheet" href="<?= h(APP_BASE_PATH) ?>/assets/css/style.css?v=<?= filemtime(__DIR__ . '/../assets/css/style.css') ?>">
<style>
  .filter-active-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--ink-100);
    align-items: center;
  }
  .filter-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: #e0f2fe;
    color: #0369a1;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
  }
  .filter-pill a {
    color: #0369a1;
    text-decoration: none;
    font-weight: 800;
    font-size: 14px;
    line-height: 1;
  }
  .table-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .table-header-flex h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 800;
    margin: 0;
  }
  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 18px;
    margin-top: 16px;
    border-top: 1px solid var(--ink-200);
    flex-wrap: wrap;
    gap: 12px;
  }
  .pagination-info {
    font-size: 13px;
    color: var(--ink-500);
    font-weight: 600;
  }
  .pagination-links {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .pagination-links .btn {
    min-width: 34px;
    padding: 6px 10px;
    font-size: 12.5px;
    font-weight: 700;
  }
</style>
</head>
<body class="admin-body">
  <div class="admin-layout">
    <?php include __DIR__ . '/_sidebar.php'; ?>

    <div class="admin-main-wrapper">
      <?php include __DIR__ . '/_nav.php'; ?>

      <main class="admin-content">
        <!-- Top Page Header -->
        <div class="page-header">
          <div>
            <h2>Student Result Records</h2>
            <p class="page-sub">Manage, search, verify and authenticate student academic records &amp; certificates.</p>
          </div>
          <a href="<?= getAdminUrl('add_student') ?>" class="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New Student Result
          </a>
        </div>

        <?php if (isset($_GET['added'])): ?>
          <div class="alert alert-success">Student result record added successfully.</div>
        <?php elseif (isset($_GET['updated'])): ?>
          <div class="alert alert-success">Student record updated successfully.</div>
        <?php elseif (isset($_GET['deleted'])): ?>
          <div class="alert alert-success">Student record deleted successfully.</div>
        <?php endif; ?>

        <!-- Search & Filter Card -->
        <div class="card mb-4">
          <form method="GET" action="<?= getAdminUrl('students') ?>" class="filter-form">
            <div class="form-row-3">
              <div class="form-group">
                <label for="search_input">Search Registry</label>
                <div class="input-icon-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input
                    type="text"
                    id="search_input"
                    name="q"
                    placeholder="Search Reg No, Student Name, etc..."
                    value="<?= h($search) ?>"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="filter_subject">Course / Medical Department</label>
                <select id="filter_subject" name="subject">
                  <option value="">All Courses &amp; Programs</option>
                  <?php foreach ($subjects as $sub): ?>
                    <option value="<?= h($sub) ?>" <?= $filterSubject === $sub ? 'selected' : '' ?> title="<?= h($sub) ?>">
                      <?= h(strlen($sub) > 32 ? mb_substr($sub, 0, 30) . '...' : $sub) ?>
                    </option>
                  <?php endforeach; ?>
                </select>
              </div>

              <div class="form-group">
                <label for="filter_year">Graduation / Passing Year</label>
                <select id="filter_year" name="year">
                  <option value="">All Passing Years</option>
                  <?php foreach ($years as $yr): ?>
                    <option value="<?= h($yr) ?>" <?= $filterYear === $yr ? 'selected' : '' ?>><?= h($yr) ?></option>
                  <?php endforeach; ?>
                </select>
              </div>
            </div>

            <div class="filter-actions">
              <div class="filter-btn-group">
                <button type="submit" class="btn btn-primary btn-sm">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                  Filter Records
                </button>
                <?php if ($hasActiveFilters): ?>
                  <a href="<?= getAdminUrl('students') ?>" class="btn btn-secondary btn-sm">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                    Reset Filters
                  </a>
                <?php endif; ?>
              </div>

              <span class="filter-count-text">
                Showing <strong><?= $startCount ?> - <?= $endCount ?></strong> of <strong><?= $total ?></strong> total students
              </span>
            </div>

            <?php if ($hasActiveFilters): ?>
              <div class="filter-active-pills">
                <span style="font-size:12px; color:var(--ink-500); font-weight:700;">Active Filters:</span>
                <?php if ($search !== ''): ?>
                  <span class="filter-pill">Keyword: "<?= h($search) ?>" <a href="?<?= http_build_query(array_merge($_GET, ['q' => ''])) ?>" title="Remove search">&times;</a></span>
                <?php endif; ?>
                <?php if ($filterSubject !== ''): ?>
                  <span class="filter-pill">Course: <?= h($filterSubject) ?> <a href="?<?= http_build_query(array_merge($_GET, ['subject' => ''])) ?>" title="Remove course">&times;</a></span>
                <?php endif; ?>
                <?php if ($filterYear !== ''): ?>
                  <span class="filter-pill">Year: <?= h($filterYear) ?> <a href="?<?= http_build_query(array_merge($_GET, ['year' => ''])) ?>" title="Remove year">&times;</a></span>
                <?php endif; ?>
              </div>
            <?php endif; ?>
          </form>
        </div>

        <!-- Student Data Table / Cards -->
        <div class="card">
          <div class="table-header-flex">
            <h3>
              <span>All Student Entries</span>
              <span class="badge badge-info" style="font-size:12px;"><?= number_format($total) ?> Records</span>
            </h3>
            <span style="font-size:12.5px; color:var(--ink-500);">Page <strong><?= $page ?></strong> of <strong><?= $totalPages ?></strong></span>
          </div>

          <!-- Desktop Table View (PC / Laptops) -->
          <div class="table-responsive desktop-table-view">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width:60px;">Photo</th>
                  <th>Reg No</th>
                  <th>Student Name</th>
                  <th>Course / Department</th>
                  <th>Passing Year</th>
                  <th>CGPA / Grade</th>
                  <th style="text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <?php if (empty($students)): ?>
                  <tr>
                    <td colspan="7" class="empty-row" style="padding:0;">
                      <div class="empty-state">
                        <div class="empty-state-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><?= $hasActiveFilters ? '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' : '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' ?></svg>
                        </div>
                        <p class="empty-state-title">No Student Records Found</p>
                        <p class="empty-state-desc">
                          <?= $hasActiveFilters ? 'No students matched your search filters. Try adjusting your search or clearing the filters.' : 'No student entries have been registered yet. Add your first record to get started.' ?>
                        </p>
                        <?php if ($hasActiveFilters): ?>
                          <a href="<?= getAdminUrl('students') ?>" class="btn btn-secondary btn-sm">Clear Search &amp; Filters</a>
                        <?php else: ?>
                          <a href="<?= getAdminUrl('add_student') ?>" class="btn btn-primary btn-sm">+ Add First Student Result</a>
                        <?php endif; ?>
                      </div>
                    </td>
                  </tr>
                <?php else: ?>
                  <?php foreach ($students as $s): ?>
                    <tr>
                      <td style="width:60px;">
                        <?php $sPhoto = getPhotoUrl($s['photo'] ?? ''); ?>
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
                        <div class="table-student-name"><?= h($s['name']) ?></div>
                        <?php if ($s['father_name']): ?>
                          <div class="table-student-sub">
                            <span>Father:</span> <?= h($s['father_name']) ?>
                          </div>
                        <?php endif; ?>
                      </td>
                      <td>
                        <div class="table-course-badge"><?= h($s['subject']) ?></div>
                      </td>
                      <td>
                        <span class="table-year-badge"><?= h($s['passing_year'] ?: '—') ?></span>
                      </td>
                      <td>
                        <div style="display:flex; gap:6px; align-items:center;">
                          <span class="badge badge-info"><?= h($s['cgpa'] ?: 'Passed') ?></span>
                          <?php if ($s['grade']): ?>
                            <span class="badge <?= in_array(strtoupper(trim($s['grade'])), ['A+', 'A', 'DISTINCTION']) ? 'badge-success' : 'badge-secondary' ?>">
                              <?= h($s['grade']) ?>
                            </span>
                          <?php endif; ?>
                        </div>
                      </td>
                      <td>
                        <div class="table-actions">
                          <a href="<?= h(APP_BASE_PATH) ?>/verify/<?= urlencode($s['registration_no']) ?>?from=admin" class="btn btn-xs btn-primary" title="View Official Verification Card">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Verify
                          </a>
                          <a href="<?= getAdminUrl('edit_student') ?>?id=<?= (int)$s['id'] ?>" class="btn btn-xs btn-secondary" title="Edit Student &amp; Marksheet">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            Edit
                          </a>

                          <form method="POST" action="<?= getAdminUrl('delete_student') ?>" class="delete-form" data-name="<?= h($s['name']) ?>" data-reg="<?= h($s['registration_no']) ?>" style="display:inline; margin:0;">
                            <?= csrfField() ?>
                            <input type="hidden" name="id" value="<?= (int)$s['id'] ?>">
                            <button type="submit" class="btn btn-xs btn-danger" title="Delete Student Record">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                <?php endif; ?>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards View (Optimized for Phones) -->
          <div class="mobile-students-list">
            <?php if (empty($students)): ?>
              <div class="empty-state empty-state-sm">
                <div class="empty-state-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <p class="empty-state-title">No records found</p>
                <p class="empty-state-desc">Try adjusting your search or filters.</p>
              </div>
            <?php else: ?>
              <?php foreach ($students as $s): ?>
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
                      <?php if ($s['father_name']): ?>
                        <div class="m-record-father">Father: <?= h($s['father_name']) ?></div>
                      <?php endif; ?>
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
                        <?php if ($s['grade']): ?>
                          <span class="badge <?= in_array(strtoupper(trim($s['grade'])), ['A+', 'A', 'DISTINCTION']) ? 'badge-success' : 'badge-secondary' ?>"><?= h($s['grade']) ?></span>
                        <?php endif; ?>
                      </div>
                    </div>
                  </div>

                  <!-- Actions Row: Verify Card, Edit, Delete -->
                  <div class="m-record-actions-row">
                    <a href="<?= h(APP_BASE_PATH) ?>/verify/<?= urlencode($s['registration_no']) ?>?from=admin" class="btn btn-xs btn-primary">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      Verify
                    </a>
                    <a href="<?= getAdminUrl('edit_student') ?>?id=<?= (int)$s['id'] ?>" class="btn btn-xs btn-secondary">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      Edit
                    </a>

                    <form method="POST" action="<?= getAdminUrl('delete_student') ?>" class="delete-form" data-name="<?= h($s['name']) ?>" data-reg="<?= h($s['registration_no']) ?>">
                      <?= csrfField() ?>
                      <input type="hidden" name="id" value="<?= (int)$s['id'] ?>">
                      <button type="submit" class="btn btn-xs btn-danger">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>

          <!-- Pagination Bar -->
          <?php if ($totalPages > 1): ?>
            <div class="pagination-container">
              <div class="pagination-info">
                Showing <strong><?= $startCount ?></strong> to <strong><?= $endCount ?></strong> of <strong><?= number_format($total) ?></strong> student records
              </div>

              <div class="pagination-links">
                <?php if ($page > 1): ?>
                  <a href="?q=<?= urlencode($search) ?>&amp;subject=<?= urlencode($filterSubject) ?>&amp;year=<?= urlencode($filterYear) ?>&amp;page=<?= $page - 1 ?>" class="btn btn-xs btn-secondary">Previous</a>
                <?php endif; ?>

                <?php 
                $startP = max(1, $page - 2);
                $endP = min($totalPages, $page + 2);
                if ($startP > 1): ?>
                  <a href="?q=<?= urlencode($search) ?>&amp;subject=<?= urlencode($filterSubject) ?>&amp;year=<?= urlencode($filterYear) ?>&amp;page=1" class="btn btn-xs btn-secondary">1</a>
                  <?php if ($startP > 2): ?><span style="padding:0 4px; color:var(--ink-400);">&hellip;</span><?php endif; ?>
                <?php endif; ?>

                <?php for ($p = $startP; $p <= $endP; $p++): ?>
                  <a href="?q=<?= urlencode($search) ?>&amp;subject=<?= urlencode($filterSubject) ?>&amp;year=<?= urlencode($filterYear) ?>&amp;page=<?= $p ?>" class="btn btn-xs <?= $p === $page ? 'btn-primary' : 'btn-secondary' ?>"><?= $p ?></a>
                <?php endfor; ?>

                <?php if ($endP < $totalPages): ?>
                  <?php if ($endP < $totalPages - 1): ?><span style="padding:0 4px; color:var(--ink-400);">&hellip;</span><?php endif; ?>
                  <a href="?q=<?= urlencode($search) ?>&amp;subject=<?= urlencode($filterSubject) ?>&amp;year=<?= urlencode($filterYear) ?>&amp;page=<?= $totalPages ?>" class="btn btn-xs btn-secondary"><?= $totalPages ?></a>
                <?php endif; ?>

                <?php if ($page < $totalPages): ?>
                  <a href="?q=<?= urlencode($search) ?>&amp;subject=<?= urlencode($filterSubject) ?>&amp;year=<?= urlencode($filterYear) ?>&amp;page=<?= $page + 1 ?>" class="btn btn-xs btn-secondary">Next</a>
                <?php endif; ?>
              </div>
            </div>
          <?php endif; ?>
        </div>
      </main>
    </div>
  </div>

  <!-- Beautiful Custom Delete Confirmation Modal -->
  <div class="custom-modal-backdrop" id="deleteConfirmModal" style="display:none;" aria-hidden="true">
    <div class="custom-modal-card">
      <div class="delete-modal-icon-wrap">
        <div class="delete-modal-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>
      </div>

      <div class="delete-modal-body">
        <h3 class="delete-modal-title">Delete Student Record</h3>
        <p class="delete-modal-text">
          Are you sure you want to permanently delete the academic record of <strong id="deleteModalTargetName">Student Name</strong>?
        </p>
        <div class="delete-modal-reg-badge" id="deleteModalRegWrap">
          <span>Registration No:</span>
          <code id="deleteModalTargetReg">RI-408</code>
        </div>
        <p class="delete-modal-warning">
          ⚠️ This action cannot be reversed and all associated marksheet data will be deleted.
        </p>
      </div>

      <div class="delete-modal-footer">
        <button type="button" class="btn btn-secondary" id="deleteModalCancelBtn">Cancel</button>
        <button type="button" class="btn btn-danger" id="deleteModalConfirmBtn">Yes, Permanently Delete</button>
      </div>
    </div>
  </div>

  <script src="<?= h(APP_BASE_PATH) ?>/assets/js/admin.js?v=<?= filemtime(__DIR__ . '/../assets/js/admin.js') ?>"></script>
</body>
</html>
