<?php
// admin/_nav.php - Modern unified topbar
?>
<header class="admin-topbar">
  <div class="topbar-left">
    <button type="button" class="sidebar-toggle-btn" id="sidebarToggle" aria-label="Toggle Sidebar Navigation">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    <span class="system-tag">BAMMT Registry Console</span>
  </div>

  <div class="topbar-right">
    <a href="<?= getAdminUrl('profile') ?>" class="profile-pill">
      <div class="avatar-circle"><?= h(initials($_SESSION['admin_username'] ?? 'Admin')) ?></div>
      <span><?= h($_SESSION['admin_username'] ?? 'Admin') ?></span>
    </a>
    <div class="topbar-divider"></div>
    <a href="<?= getAdminUrl('logout') ?>" class="logout-icon-btn" title="Logout">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    </a>
  </div>
</header>
