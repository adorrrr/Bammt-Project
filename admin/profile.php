<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

requireLogin();
$pdo = getDBConnection();

// Ensure optional columns exist in admins table without crashing
try {
    $pdo->exec("ALTER TABLE admins ADD COLUMN email VARCHAR(100) DEFAULT NULL");
} catch (Throwable $e) {}
try {
    $pdo->exec("ALTER TABLE admins ADD COLUMN full_name VARCHAR(150) DEFAULT 'System Administrator'");
} catch (Throwable $e) {}
try {
    $pdo->exec("ALTER TABLE admins ADD COLUMN role VARCHAR(30) DEFAULT 'Super Admin'");
} catch (Throwable $e) {}

$msg = '';
$error = '';

$adminId = (int) ($_SESSION['admin_id'] ?? 0);
if ($adminId <= 0) {
    redirect(getAdminUrl('login'));
}

$stmt = $pdo->prepare("SELECT * FROM admins WHERE id = ? LIMIT 1");
$stmt->execute([$adminId]);
$admin = $stmt->fetch() ?: [];

if (empty($admin)) {
    redirect(getAdminUrl('logout'));
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

// Current logged-in admin credentials & role check
$adminUsername = $admin['username'] ?? 'admin';
$adminFullName = !empty($admin['full_name']) ? $admin['full_name'] : ($adminUsername ?: 'System Administrator');
$adminEmail = $admin['email'] ?? 'admin@bammt.com';
$adminRole = !empty($admin['role']) ? $admin['role'] : 'Super Admin';
$isSuperAdmin = (strtolower(trim($adminRole)) === 'super admin');

// Handle Profile Update (Accessible to all admins for their own profile)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_profile'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid security token. Please try again.';
    } else {
        $username = cleanInput($_POST['username'] ?? '');
        $fullName = cleanInput($_POST['full_name'] ?? '');
        $email = cleanInput($_POST['email'] ?? '');

        if ($fullName === '') {
            $error = 'Full name cannot be empty.';
        } elseif ($username === '' || !preg_match('/^[a-zA-Z0-9_.-]{3,30}$/', $username)) {
            $error = 'Username must be 3-30 characters (letters, numbers, _, -, . only).';
        } else {
            // Check if username is taken by another admin
            $checkStmt = $pdo->prepare("SELECT id FROM admins WHERE username = ? AND id != ? LIMIT 1");
            $checkStmt->execute([$username, $adminId]);
            if ($checkStmt->fetch()) {
                $error = 'This username is already taken by another administrator.';
            } else {
                try {
                    $up = $pdo->prepare("UPDATE admins SET username = ?, full_name = ?, email = ? WHERE id = ?");
                    $up->execute([$username, $fullName, $email, $adminId]);

                    $_SESSION['admin_username'] = $username;
                    logAudit($pdo, 'UPDATE_PROFILE', "Updated profile details for admin ID: $adminId");
                    $msg = 'Administrator profile updated successfully.';

                    // Refresh updated admin record
                    $stmt->execute([$adminId]);
                    $admin = $stmt->fetch() ?: [];
                    $adminUsername = $admin['username'] ?? $username;
                    $adminFullName = !empty($admin['full_name']) ? $admin['full_name'] : $fullName;
                    $adminEmail = $admin['email'] ?? $email;
                    $adminRole = !empty($admin['role']) ? $admin['role'] : 'Super Admin';
                    $isSuperAdmin = (strtolower(trim($adminRole)) === 'super admin');
                } catch (Throwable $e) {
                    $error = 'Failed to update profile. Please check database permissions.';
                }
            }
        }
    }
}

// Handle Create New Admin (Super Admin Only)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['create_new_admin'])) {
    if (!$isSuperAdmin) {
        $error = 'Access denied. Only Super Administrators can create new administrative accounts.';
    } elseif (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid security token. Please try again.';
    } else {
        $newUsername = cleanInput($_POST['new_username'] ?? '');
        $newFullName = cleanInput($_POST['new_full_name'] ?? '');
        $newEmail = cleanInput($_POST['new_email'] ?? '');
        $newRole = cleanInput($_POST['new_role'] ?? 'Super Admin');
        $newPassword = (string) ($_POST['new_password'] ?? '');
        $confirmPassword = (string) ($_POST['confirm_password'] ?? '');

        if ($newFullName === '') {
            $error = 'Display name cannot be empty.';
        } elseif ($newUsername === '' || !preg_match('/^[a-zA-Z0-9_.-]{3,30}$/', $newUsername)) {
            $error = 'New admin username must be 3-30 characters (letters, numbers, _, -, . only).';
        } elseif (strlen($newPassword) < 6) {
            $error = 'Password must be at least 6 characters long.';
        } elseif ($newPassword !== $confirmPassword) {
            $error = 'Password and Confirm Password do not match.';
        } else {
            $checkStmt = $pdo->prepare("SELECT id FROM admins WHERE username = ? LIMIT 1");
            $checkStmt->execute([$newUsername]);
            if ($checkStmt->fetch()) {
                $error = "The username \"{$newUsername}\" is already in use by another admin.";
            } else {
                try {
                    $pwHash = password_hash($newPassword, PASSWORD_DEFAULT);
                    $ins = $pdo->prepare("INSERT INTO admins (username, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)");
                    $ins->execute([$newUsername, $newFullName, $newEmail, $pwHash, $newRole]);
                    logAudit($pdo, 'CREATE_ADMIN', "Created new admin user: {$newUsername} ({$newRole})");
                    $msg = "New administrator \"<strong>" . h($newUsername) . "</strong>\" created successfully.";
                } catch (Throwable $e) {
                    $error = 'Failed to create administrator account. Please verify database constraints.';
                }
            }
        }
    }
}

// Handle Delete Admin (Super Admin Only, cannot delete self)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_admin'])) {
    if (!$isSuperAdmin) {
        $error = 'Access denied. Only Super Administrators can remove administrative accounts.';
    } elseif (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid security token. Please try again.';
    } else {
        $delId = (int) ($_POST['delete_admin_id'] ?? 0);
        if ($delId === $adminId) {
            $error = 'You cannot delete your own active administrator account.';
        } elseif ($delId > 0) {
            $delStmt = $pdo->prepare("DELETE FROM admins WHERE id = ?");
            $delStmt->execute([$delId]);
            logAudit($pdo, 'DELETE_ADMIN', "Deleted administrator ID: {$delId}");
            $msg = "Administrator account #{$delId} removed successfully.";
        }
    }
}

// Fetch all admins safely (Super Admin only)
$adminsList = [];
if ($isSuperAdmin) {
    try {
        $adminsList = $pdo->query("SELECT * FROM admins ORDER BY id ASC")->fetchAll() ?: [];
    } catch (Throwable $e) {
        $adminsList = [];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Profile<?= $isSuperAdmin ? ' &amp; User Management' : '' ?> — <?= h(SITE_NAME) ?></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="shortcut icon" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="stylesheet" href="<?= h(APP_BASE_PATH) ?>/assets/css/style.css?v=<?= filemtime(__DIR__ . '/../assets/css/style.css') ?>">
<style>
  .profile-grid-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .profile-grid-layout {
      grid-template-columns: 1fr;
    }
  }
  .profile-header-card {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 20px;
    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: #fff;
    border-radius: var(--radius-md);
    margin-bottom: 24px;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .profile-avatar-large {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #0284c7, #38bdf8);
    color: #0b0f19;
    font-size: 22px;
    font-weight: 800;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
    flex-shrink: 0;
  }
  .profile-meta-title {
    font-size: 18px;
    font-weight: 800;
    color: #f8fafc;
    margin-bottom: 4px;
  }
  .profile-meta-sub {
    font-size: 13px;
    color: #94a3b8;
  }
  .admin-table-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background: var(--surface-alt);
    border: 1px solid var(--ink-200);
    border-radius: var(--radius-sm);
    margin-bottom: 8px;
    gap: 12px;
    transition: border-color .15s ease, background .15s ease;
  }
  .admin-table-item:hover {
    border-color: var(--primary);
    background: #fff;
  }
  .admin-info-box {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .admin-avatar-small {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--primary-light);
    color: var(--primary-hover);
    font-weight: 800;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
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
        <div class="page-header">
          <div>
            <h2>My Administrator Profile<?= $isSuperAdmin ? ' &amp; Users' : '' ?></h2>
            <p class="page-sub">
              <?= $isSuperAdmin 
                ? 'Manage your personal profile information, administrative credentials, and manage team accounts.' 
                : 'Manage your personal profile information, username credentials, and password.' 
              ?>
            </p>
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
            <?= $error ?>
          </div>
        <?php endif; ?>

        <div class="<?= $isSuperAdmin ? 'profile-grid-layout' : '' ?>">
          <!-- Column 1: Personal Profile -->
          <div style="<?= !$isSuperAdmin ? 'max-width:680px;' : '' ?>">
            <!-- Card 1: My Profile Info (Available to ALL Admins) -->
            <div class="card mb-4">
              <div class="card-header">
                <div class="card-header-title-group">
                  <div class="card-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <h3>My Administrator Profile</h3>
                </div>
              </div>

              <div class="profile-header-card">
                <div class="profile-avatar-large"><?= h(initials($adminFullName)) ?></div>
                <div>
                  <div class="profile-meta-title"><?= h($adminFullName) ?></div>
                  <div class="profile-meta-sub">Role: <?= h($adminRole) ?> &bull; User ID: #<?= h($adminId) ?></div>
                </div>
              </div>

              <form method="POST" action="<?= getAdminUrl('profile') ?>" class="form-grid">
                <?= csrfField() ?>
                <input type="hidden" name="update_profile" value="1">

                <div class="form-row-2">
                  <div class="form-group">
                    <label for="username">Admin Username (Login ID) *</label>
                    <input type="text" id="username" name="username" value="<?= h($adminUsername) ?>" required maxlength="30" style="font-weight:700;">
                    <small style="color:var(--ink-400); font-size:12px;">Used to log in to administrative portal.</small>
                  </div>

                  <div class="form-group">
                    <label>System Role</label>
                    <input type="text" value="<?= h($adminRole) ?>" readonly style="background:var(--ink-100); color:var(--ink-700);">
                    <small style="color:var(--ink-400); font-size:12px;">Assigned authorization level.</small>
                  </div>
                </div>

                <div class="form-group">
                  <label for="full_name">Legal / Display Name *</label>
                  <input type="text" id="full_name" name="full_name" value="<?= h($adminFullName) ?>" required maxlength="150" placeholder="e.g. Dr. Shaheen Akhter">
                </div>

                <div class="form-group">
                  <label for="email">Admin Email Address</label>
                  <input type="email" id="email" name="email" value="<?= h($adminEmail) ?>" placeholder="e.g. admin@bammt.com">
                </div>

                <div class="form-actions mt-4">
                  <button type="submit" class="btn btn-primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save Profile Changes
                  </button>
                  <a href="<?= getAdminUrl('change_password') ?>" class="btn btn-secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Change Password
                  </a>
                </div>
              </form>
            </div>
          </div>

          <?php if ($isSuperAdmin): ?>
            <!-- Right Column: Create New Admin & Active Admin List (Super Admin Only) -->
            <div>
              <!-- Card 2: Create New Admin (Super Admin Only) -->
              <div class="card mb-4">
                <div class="card-header">
                  <h3>Create New Administrator</h3>
                </div>

                <form method="POST" action="<?= getAdminUrl('profile') ?>" class="form-grid">
                  <?= csrfField() ?>
                  <input type="hidden" name="create_new_admin" value="1">

                  <div class="form-row-2">
                    <div class="form-group">
                      <label for="new_username">New Username (Login ID) *</label>
                      <input type="text" id="new_username" name="new_username" required maxlength="30" placeholder="e.g. subadmin">
                    </div>
                    <div class="form-group">
                      <label for="new_role">System Role *</label>
                      <select id="new_role" name="new_role" required>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Moderator">Moderator / Staff</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="new_full_name">Legal / Display Name *</label>
                    <input type="text" id="new_full_name" name="new_full_name" required maxlength="150" placeholder="e.g. Monir Hossain">
                  </div>

                  <div class="form-group">
                    <label for="new_email">Admin Email Address</label>
                    <input type="email" id="new_email" name="new_email" placeholder="e.g. monir@bammt.com">
                  </div>

                  <div class="form-row-2">
                    <div class="form-group">
                      <label for="new_password">Password (min 6 chars) *</label>
                      <input type="password" id="new_password" name="new_password" required minlength="6" placeholder="Enter password">
                    </div>
                    <div class="form-group">
                      <label for="confirm_password">Confirm Password *</label>
                      <input type="password" id="confirm_password" name="confirm_password" required minlength="6" placeholder="Re-enter password">
                    </div>
                  </div>

                  <div class="form-actions mt-3">
                    <button type="submit" class="btn btn-primary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
                      Create Administrator
                    </button>
                  </div>
                </form>
              </div>

              <!-- Card 3: All Registered Administrators List (Super Admin Only) -->
              <div class="card">
                <div class="card-header">
                  <h3>Registered Administrators (<?= count($adminsList) ?>)</h3>
                </div>

                <div class="admins-list">
                  <?php foreach ($adminsList as $u): 
                    $uDisplayName = !empty($u['full_name']) ? $u['full_name'] : ($u['username'] ?? 'Administrator');
                    $uRole = !empty($u['role']) ? $u['role'] : 'Admin';
                    $uUsername = $u['username'] ?? 'admin';
                  ?>
                    <div class="admin-table-item">
                      <div class="admin-info-box">
                        <div class="admin-avatar-small"><?= h(initials($uDisplayName)) ?></div>
                        <div style="min-width:0;">
                          <strong style="font-size:13.5px; color:var(--ink-900); display:block;"><?= h($uDisplayName) ?></strong>
                          <span style="font-size:12px; color:var(--ink-500);">
                            <code><?= h($uUsername) ?></code> &bull; <?= h($uRole) ?>
                          </span>
                        </div>
                      </div>

                      <div>
                        <?php if ($u['id'] == $adminId): ?>
                          <span class="badge badge-info" style="font-size:11px;"><span class="status-dot dot-live" style="background:#0284c7;"></span>You (Active)</span>
                        <?php else: ?>
                          <form method="POST" action="<?= getAdminUrl('profile') ?>" class="delete-form" data-name="administrator account '<?= h($u['username']) ?>'" style="margin:0;">
                            <?= csrfField() ?>
                            <input type="hidden" name="delete_admin" value="1">
                            <input type="hidden" name="delete_admin_id" value="<?= (int) $u['id'] ?>">
                            <button type="submit" class="btn btn-xs btn-danger">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                              Delete
                            </button>
                          </form>
                        <?php endif; ?>
                      </div>
                    </div>
                  <?php endforeach; ?>
                </div>
              </div>
            </div>
          <?php endif; ?>
        </div>
      </main>
    </div>
  </div>

  <!-- Custom Delete Confirmation Modal -->
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
        <h3 class="delete-modal-title">Delete Administrator</h3>
        <p class="delete-modal-text">
          Are you sure you want to permanently delete <strong id="deleteModalTargetName">this account</strong>?
        </p>
        <div class="delete-modal-reg-badge" id="deleteModalRegWrap" style="display:none;">
          <code id="deleteModalTargetReg"></code>
        </div>
        <p class="delete-modal-warning">
          ⚠️ This administrator will lose all access to the administrative management console.
        </p>
      </div>

      <div class="delete-modal-footer">
        <button type="button" class="btn btn-secondary" id="deleteModalCancelBtn">Cancel</button>
        <button type="button" class="btn btn-danger" id="deleteModalConfirmBtn">Yes, Delete Account</button>
      </div>
    </div>
  </div>

  <script src="<?= h(APP_BASE_PATH) ?>/assets/js/admin.js?v=<?= filemtime(__DIR__ . '/../assets/js/admin.js') ?>"></script>
</body>
</html>
