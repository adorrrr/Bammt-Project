<?php
// admin/_sidebar.php - Clean and Focused Sidebar
$currentScript = str_replace('.php', '', basename($_SERVER['SCRIPT_NAME'] ?? ''));
?>
<aside class="admin-sidebar" id="adminSidebar">
  <div class="sidebar-header">
    <a href="<?= getAdminUrl('dashboard') ?>" class="sidebar-brand">
      <div class="sidebar-brand-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      </div>
      <div class="sidebar-brand-text">
        <span class="brand-title">BAMMT</span>
        <span class="brand-sub">Admin Portal</span>
      </div>
    </a>
    <button type="button" class="sidebar-close-btn" id="sidebarCloseBtn" aria-label="Close menu">&times;</button>
  </div>

  <div class="sidebar-user-badge">
    <div class="user-avatar-sm"><?= h(initials($_SESSION['admin_username'] ?? 'Admin')) ?></div>
    <div class="user-info-sm">
      <span class="user-name"><?= h($_SESSION['admin_username'] ?? 'Admin') ?></span>
      <span class="user-role">Administrator</span>
    </div>
  </div>

  <nav class="sidebar-menu">
    <div class="menu-label">Main Menu</div>
    
    <a href="<?= getAdminUrl('dashboard') ?>" class="menu-item <?= $currentScript === 'dashboard' ? 'active' : '' ?>">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      <span>Dashboard</span>
    </a>

    <a href="<?= getAdminUrl('students') ?>" class="menu-item <?= in_array($currentScript, ['students', 'add_student', 'edit_student', 'view_student']) ? 'active' : '' ?>">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <span>Student Results</span>
    </a>

    <a href="<?= getAdminUrl('notices') ?>" class="menu-item <?= $currentScript === 'notices' ? 'active' : '' ?>">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <span>Notice Board</span>
    </a>

    <div class="menu-label">Settings &amp; Account</div>

    <a href="<?= getAdminUrl('settings') ?>" class="menu-item <?= $currentScript === 'settings' ? 'active' : '' ?>">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      <span>Institution Info</span>
    </a>

    <a href="<?= getAdminUrl('profile') ?>" class="menu-item <?= $currentScript === 'profile' ? 'active' : '' ?>">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span>My Profile</span>
    </a>

    <a href="<?= getAdminUrl('change_password') ?>" class="menu-item <?= $currentScript === 'change_password' ? 'active' : '' ?>">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      <span>Change Password</span>
    </a>

    <div class="menu-divider"></div>
    <a href="<?= getAdminUrl('logout') ?>" class="menu-item menu-logout">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      <span>Logout</span>
    </a>
  </nav>
</aside>
<div class="sidebar-backdrop" id="sidebarBackdrop"></div>
