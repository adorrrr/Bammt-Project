<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

requireLogin();
$pdo = getDBConnection();

$msg = '';
$error = '';

// Handle Add Notice
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_notice'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid security token. Please refresh.';
    } else {
        $title = cleanInput($_POST['title'] ?? '');
        $content = cleanInput($_POST['content'] ?? '');
        $category = cleanInput($_POST['category'] ?? 'General');
        $isActive = isset($_POST['is_active']) ? 1 : 0;

        if ($title === '' || $content === '') {
            $error = 'Please provide both notice title and announcement content.';
        } else {
            $stmt = $pdo->prepare("INSERT INTO notices (title, content, category, is_active) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $content, $category, $isActive]);
            logAudit($pdo, 'ADD_NOTICE', 'Created notice: ' . $title);
            $msg = 'Notice announcement published successfully.';
        }
    }
}

// Handle Delete Notice
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_notice'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid security token.';
    } else {
        $id = (int) ($_POST['id'] ?? 0);
        if ($id > 0) {
            $pdo->prepare("DELETE FROM notices WHERE id = ?")->execute([$id]);
            logAudit($pdo, 'DELETE_NOTICE', 'Deleted notice #' . $id);
            $msg = 'Notice removed successfully from the board.';
        }
    }
}

// Handle Toggle Notice Status (Live / Hidden)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['toggle_status'])) {
    if (verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $id = (int) ($_POST['id'] ?? 0);
        $newStatus = (int) ($_POST['new_status'] ?? 0);
        if ($id > 0) {
            $pdo->prepare("UPDATE notices SET is_active = ? WHERE id = ?")->execute([$newStatus, $id]);
            logAudit($pdo, 'TOGGLE_NOTICE', "Toggled notice #{$id} status to {$newStatus}");
            $msg = $newStatus === 1 ? 'Notice is now live on the public board.' : 'Notice has been hidden from the public board.';
        }
    }
}

// Fetch all notices and chunk 2 per slide for smooth client-side slider
$allNotices = $pdo->query("SELECT * FROM notices ORDER BY id DESC")->fetchAll() ?: [];
$totalNotices = count($allNotices);
$activeCount = 0;
foreach ($allNotices as $n) {
    if (!empty($n['is_active'])) $activeCount++;
}
$adminNoticeSlides = array_chunk($allNotices, 2);
$totalAdminSlides = count($adminNoticeSlides);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Notices &amp; Announcements — <?= h(SITE_NAME) ?></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="shortcut icon" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="stylesheet" href="<?= h(APP_BASE_PATH) ?>/assets/css/style.css?v=<?= filemtime(__DIR__ . '/../assets/css/style.css') ?>">
<style>
  .notice-manage-grid {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 20px;
    align-items: start;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  .notice-manage-grid > div {
    min-width: 0;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  @media (max-width: 992px) {
    .notice-manage-grid {
      grid-template-columns: 1fr;
      gap: 18px;
    }
  }
  .form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 768px) {
    .form-row-2 {
      grid-template-columns: 1fr;
      gap: 10px;
    }
  }
  .admin-notice-slider-wrapper {
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  .admin-notice-slider-track {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
    will-change: transform;
  }
  .admin-notice-slide {
    min-width: 100%;
    width: 100%;
    max-width: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
  }
  .notice-item-card {
    background: #ffffff;
    border: 1px solid var(--ink-200);
    border-radius: 10px;
    padding: 13px 15px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    box-sizing: border-box;
    max-width: 100%;
    word-break: break-word;
    overflow-wrap: anywhere;
    transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
  }
  .notice-item-card:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }
  .notice-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    gap: 6px;
    flex-wrap: wrap;
    max-width: 100%;
  }
  .notice-badge-group {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .notice-item-title {
    font-size: 14px;
    font-weight: 800;
    color: var(--ink-900);
    margin: 0 0 6px;
    line-height: 1.3;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .notice-item-content {
    font-size: 12.5px;
    color: var(--ink-600);
    line-height: 1.45;
    margin: 0 0 10px;
    background: var(--surface-alt);
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid var(--ink-100);
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: normal;
    max-height: 70px;
    overflow-y: auto;
  }
  .notice-item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 8px;
    border-top: 1px solid var(--ink-100);
    gap: 6px;
    flex-wrap: wrap;
    max-width: 100%;
  }
  .notice-date-text {
    font-size: 11.5px;
    color: var(--ink-400);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .notice-actions-group {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .custom-checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: var(--surface-alt);
    border: 1px solid var(--ink-200);
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    max-width: 100%;
    box-sizing: border-box;
  }
  .custom-checkbox-wrapper input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--primary);
    cursor: pointer;
    margin: 0;
    flex-shrink: 0;
  }
</style>
</head>
<body class="admin-body">
  <div class="admin-layout">
    <?php include __DIR__ . '/_sidebar.php'; ?>

    <div class="admin-main-wrapper">
      <?php include __DIR__ . '/_nav.php'; ?>

      <main class="admin-content">
        <?php if ($msg): ?>
          <div class="alert alert-success" style="margin-bottom:12px; padding:10px 14px;"><?= $msg ?></div>
        <?php endif; ?>
        <?php if ($error): ?>
          <div class="alert alert-error" style="margin-bottom:12px; padding:10px 14px;"><?= h($error) ?></div>
        <?php endif; ?>

        <div class="notice-manage-grid">
          <!-- Left Column: Title & Publish Notice Form -->
          <div>
            <div style="margin-bottom: 12px;">
              <h2 style="font-size:20px; font-weight:800; color:var(--ink-900); margin:0 0 2px; letter-spacing:-0.01em;">Notices &amp; Announcements</h2>
              <p class="page-sub" style="margin:0; font-size:12.5px; color:var(--ink-500);">Publish official academic bulletins, exam schedules, and circulars.</p>
            </div>

            <div class="card" style="padding:18px 20px;">
              <div class="card-header" style="margin-bottom:12px;">
                <div class="card-header-title-group">
                  <div class="card-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </div>
                  <h3 style="font-size:15px;">Publish New Announcement</h3>
                </div>
                <span class="badge badge-info" style="font-size:11px;">Official Bulletin</span>
              </div>

              <form method="POST" action="<?= getAdminUrl('notices') ?>" class="form-grid">
                <?= csrfField() ?>
                <input type="hidden" name="add_notice" value="1">

                <div class="form-group" style="margin-bottom:12px;">
                  <label for="title" style="font-size:12.5px;">Notice Headline / Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    maxlength="200"
                    placeholder="e.g. Schedule for Final Diploma Practical Examinations 2026"
                    style="font-weight:700; padding:9px 12px; font-size:13.5px;"
                  >
                </div>

                <div class="form-row-2" style="margin-bottom:12px;">
                  <div class="form-group" style="margin-bottom:0;">
                    <label for="category" style="font-size:12.5px;">Notice Category *</label>
                    <select id="category" name="category" required style="padding:9px 12px; font-size:13px;">
                      <option value="Examinations">Examinations &amp; Schedules</option>
                      <option value="Results">Results &amp; Marksheets</option>
                      <option value="General">General Notice</option>
                      <option value="Academic">Academic &amp; Clinical</option>
                      <option value="Verification">Verification Portal</option>
                      <option value="Admissions">Admissions</option>
                    </select>
                  </div>

                  <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:12.5px;">Public Visibility</label>
                    <label class="form-toggle" style="padding:10px 12px; background:var(--surface-alt); border:1px solid var(--ink-200); border-radius:8px; width:100%; box-sizing:border-box;">
                      <input type="checkbox" name="is_active" value="1" checked id="is_active_cb">
                      <span class="toggle-track"></span>
                      <span class="form-toggle-label">Publish Immediately</span>
                    </label>
                  </div>
                </div>

                <div class="form-group" style="margin-bottom:14px;">
                  <label for="content" style="font-size:12.5px;">Announcement Details *</label>
                  <textarea
                    id="content"
                    name="content"
                    rows="4"
                    required
                    placeholder="Enter complete instructions, venue details, submission deadlines, or important announcements for students..."
                    style="padding:9px 12px; font-size:13px;"
                  ></textarea>
                </div>

                <div class="form-actions" style="margin:0;">
                  <button type="submit" class="btn btn-primary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Publish Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Right Column: Current Published Notices with Smooth Carousel Slider -->
          <div class="published-notices-col">
            <div class="card" style="margin-top: 0; padding:18px 20px;">
              <div class="card-header" style="margin-bottom:12px;">
                <div class="card-header-title-group">
                  <div class="card-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  </div>
                  <h3 style="font-size:15px;">Published Notices (<?= number_format($totalNotices) ?>)</h3>
                </div>
                <span class="badge badge-success" style="font-size:11px;"><span class="status-dot dot-live" style="background:#166534;"></span><?= $activeCount ?> Live on Web</span>
              </div>

              <?php if (empty($allNotices)): ?>
                <div class="empty-state empty-state-sm">
                  <div class="empty-state-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  </div>
                  <p class="empty-state-title">No Announcements Posted Yet</p>
                  <p class="empty-state-desc">Use the form on the left to publish your first official notice.</p>
                </div>
              <?php else: ?>
                <div class="notice-list">
                  <?php foreach ($allNotices as $n):
                    $cat = $n['category'] ?? 'General';
                    $catBadgeClass = 'badge-secondary';
                    if ($cat === 'Examinations') $catBadgeClass = 'badge-info';
                    elseif ($cat === 'Results') $catBadgeClass = 'badge-success';
                    elseif ($cat === 'Academic') $catBadgeClass = 'badge-warning';
                    elseif ($cat === 'Verification') $catBadgeClass = 'badge-primary';
                    $isLive = !empty($n['is_active']);
                  ?>
                    <div class="notice-item-card">
                      <div class="notice-item-header">
                        <div class="notice-badge-group">
                          <span class="badge <?= $catBadgeClass ?>"><?= h($cat) ?></span>
                          <?php if ($isLive): ?>
                            <span class="badge badge-success" style="font-size:10px; padding:2px 8px;"><span class="status-dot dot-live"></span>Live</span>
                          <?php else: ?>
                            <span class="badge badge-secondary" style="font-size:10px; padding:2px 8px;"><span class="status-dot dot-hidden"></span>Hidden</span>
                          <?php endif; ?>
                        </div>

                        <div class="notice-date-text">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          <?= date('d M Y', strtotime($n['created_at'])) ?>
                        </div>
                      </div>

                      <h4 class="notice-item-title"><?= h($n['title']) ?></h4>
                      <p class="notice-item-content"><?= nl2br(h($n['content'])) ?></p>

                      <div class="notice-item-footer">
                        <!-- Toggle Live/Hidden Form -->
                        <form method="POST" action="<?= getAdminUrl('notices') ?>" style="margin:0;">
                          <?= csrfField() ?>
                          <input type="hidden" name="toggle_status" value="1">
                          <input type="hidden" name="id" value="<?= (int)$n['id'] ?>">
                          <input type="hidden" name="new_status" value="<?= $isLive ? 0 : 1 ?>">
                          <button type="submit" class="btn btn-xs <?= $isLive ? 'btn-secondary' : 'btn-primary' ?>">
                            <?php if ($isLive): ?>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.06M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.77 21.77 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                              Hide
                            <?php else: ?>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              Make Live
                            <?php endif; ?>
                          </button>
                        </form>

                        <div class="notice-actions-group">
                          <!-- Delete Form with Custom Modal Trigger -->
                          <form method="POST" action="<?= getAdminUrl('notices') ?>" class="delete-form" data-name="notice '<?= h($n['title']) ?>'" style="margin:0;">
                            <?= csrfField() ?>
                            <input type="hidden" name="delete_notice" value="1">
                            <input type="hidden" name="id" value="<?= (int)$n['id'] ?>">
                            <button type="submit" class="btn btn-xs btn-danger">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  <?php endforeach; ?>
                </div>
              <?php endif; ?>
            </div>
          </div>
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
        <h3 class="delete-modal-title">Delete Notice</h3>
        <p class="delete-modal-text">
          Are you sure you want to permanently delete <strong id="deleteModalTargetName">this notice</strong>?
        </p>
        <div class="delete-modal-reg-badge" id="deleteModalRegWrap" style="display:none;">
          <code id="deleteModalTargetReg"></code>
        </div>
        <p class="delete-modal-warning">
          ⚠️ This notice will be immediately removed from the official public board.
        </p>
      </div>

      <div class="delete-modal-footer">
        <button type="button" class="btn btn-secondary" id="deleteModalCancelBtn">Cancel</button>
        <button type="button" class="btn btn-danger" id="deleteModalConfirmBtn">Yes, Delete Notice</button>
      </div>
    </div>
  </div>

  <script src="<?= h(APP_BASE_PATH) ?>/assets/js/admin.js?v=<?= filemtime(__DIR__ . '/../assets/js/admin.js') ?>"></script>
</body>
</html>
