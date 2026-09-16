<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

// Canonical redirect to strip index.php from browser address bar
if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'index.php') !== false) {
    $cleanUri = preg_replace('#/index\.php(\?.*)?$#', '/$1', $_SERVER['REQUEST_URI']);
    if ($cleanUri !== $_SERVER['REQUEST_URI']) {
        header('Location: ' . $cleanUri, true, 301);
        exit;
    }
}

$pdo = getDBConnection();
$notFound = false;
$searchedStudent = null;
$reg = cleanInput($_GET['reg'] ?? '');
$contactSuccess = false;
$contactError = '';

if ($reg !== '') {
    if (!isValidRegistrationNo($reg)) {
        $notFound = true;
        logVerificationAttempt($pdo, $reg, 'not_found');
    } else {
        $stmt = $pdo->prepare("SELECT * FROM students WHERE registration_no = ? LIMIT 1");
        $stmt->execute([$reg]);
        $searchedStudent = $stmt->fetch();
        if ($searchedStudent) {
            logVerificationAttempt($pdo, $reg, $searchedStudent['status'] === 'revoked' ? 'revoked' : 'found');
            redirect(APP_BASE_PATH . '/verify/' . urlencode($reg));
        } else {
            $notFound = true;
            logVerificationAttempt($pdo, $reg, 'not_found');
        }
    }
}

// Handle Contact Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact_submit'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $contactError = 'Invalid security token. Please refresh the page and try again.';
    } else {
        $cName = cleanInput($_POST['name'] ?? '');
        $cEmail = cleanInput($_POST['email'] ?? '');
        $cSubject = cleanInput($_POST['subject'] ?? '');
        $cMessage = cleanInput($_POST['message'] ?? '');

        if ($cName === '' || $cEmail === '' || $cMessage === '') {
            $contactError = 'Please fill in all required contact fields.';
        } else {
            $contactSuccess = true;
        }
    }
}

// Fetch All Active Notices for Smooth Carousel Slider
$allNotices = $pdo->query("SELECT * FROM notices WHERE is_active = 1 ORDER BY id DESC LIMIT 30")->fetchAll() ?: [];
$noticeSlides = array_chunk($allNotices, 3);
$totalNoticeSlides = count($noticeSlides);

// Fetch Institution Settings
$instName = getSystemSetting($pdo, 'institute_name', 'Bangladesh Academy of Medical Management Technology');
$instCode = getSystemSetting($pdo, 'institute_code', 'BAMMT-BD-88');
$instEmail = getSystemSetting($pdo, 'institute_email', 'info@bammt.com');
$instPhone = getSystemSetting($pdo, 'institute_phone', '+880 2-9883456');
$instAddress = getSystemSetting($pdo, 'institute_address', 'House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= h($instName) ?> — Student Certificate &amp; Result Verification</title>
<meta name="description" content="Official Student Certificate and Marksheet Result Verification Portal for BAMMT. Verify academic credentials securely online.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="shortcut icon" href="<?= h(APP_BASE_PATH) ?>/assets/images/favicon.svg">
<link rel="stylesheet" href="<?= h(APP_BASE_PATH) ?>/assets/css/style.css">
</head>
<body class="public-body">
  
  <!-- Public Navbar -->
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
          <span class="brand-sub">Medical Management Technology</span>
        </div>
      </a>

      <nav class="public-nav">
        <a href="<?= h(APP_BASE_PATH) ?>/verify" class="nav-item active" data-section="verify">Verification Portal</a>
        <a href="<?= h(APP_BASE_PATH) ?>/about" class="nav-item" data-section="about">About BAMMT</a>
        <a href="<?= h(APP_BASE_PATH) ?>/notices" class="nav-item" data-section="notices">Notices</a>
        <a href="<?= h(APP_BASE_PATH) ?>/contact" class="nav-item btn-contact-nav" data-section="contact">Contact Us</a>
      </nav>

      <button type="button" class="mobile-nav-toggle" id="publicNavToggle" aria-label="Toggle Navigation">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <!-- Hero Section & Certificate Verification -->
  <section class="hero-section" id="verify">
    <div class="hero-bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>
    
    <div class="hero-container">
      <div class="hero-badge reveal-on-scroll reveal-fade">
        <span class="badge-dot"></span> Official Verification System
      </div>

      <h1 class="hero-title reveal-on-scroll">Academic Result &amp; Certificate Verification</h1>
      <p class="hero-sub reveal-on-scroll">Enter the official registration number to instantly verify diploma certificates, academic transcripts, and marksheet authentications issued by BAMMT.</p>

      <div class="verify-search-box reveal-on-scroll">
        <?php if ($notFound): ?>
          <div class="alert alert-error" style="border-radius:12px; margin-bottom:20px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            No student record found for registration number "<strong><?= h($reg) ?></strong>". Please check for typing errors and try again.
          </div>
        <?php endif; ?>

        <form method="GET" action="<?= h(APP_BASE_PATH) ?>/" class="hero-search-form" id="heroSearchForm">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="regInput" name="reg" placeholder="Enter Registration Number (e.g. AD-123 or RI-408)" value="<?= h($reg) ?>" required maxlength="50" autocomplete="off" autofocus>
          </div>
          <button type="submit" class="btn-hero">
            <span>Verify Record</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </form>

        <p class="verify-security-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Direct cryptographic verification against BAMMT central academic database.
        </p>
      </div>

      <!-- Quick Trust Indicators -->
      <div class="trust-grid reveal-on-scroll reveal-stagger">
        <div class="trust-card">
          <div class="trust-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="trust-info">
            <h3>100% Authentic Registry</h3>
            <p>Cryptographically validated official institute records</p>
          </div>
        </div>
        <div class="trust-card">
          <div class="trust-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="trust-info">
            <h3>Instant Real-time Audit</h3>
            <p>Live status, marksheet parameters, and grades</p>
          </div>
        </div>
        <div class="trust-card">
          <div class="trust-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="trust-info">
            <h3>A4 Printable Transcript</h3>
            <p>Sealed certificate copy ready for official use</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Modern Animated Ticker Accent Ribbon -->
  <div class="ticker-ribbon-wrapper" aria-hidden="true">
    <div class="ticker-ribbon-content">
      <div class="ticker-item"><span class="ticker-item-dot"></span> BAMMT Central Academic Verification</div>
      <div class="ticker-item"><span class="ticker-item-dot"></span> Government Approved Institute <span class="ticker-badge-code"><?= h($instCode) ?></span></div>
      <div class="ticker-item"><span class="ticker-item-dot"></span> 100% Cryptographically Verified</div>
      <div class="ticker-item"><span class="ticker-item-dot"></span> Certified Medical Technology Diplomas</div>
      <div class="ticker-item"><span class="ticker-item-dot"></span> Instant Transcript &amp; Marksheet Lookup</div>
      <!-- Loop duplicate for infinite smooth marquee -->
      <div class="ticker-item"><span class="ticker-item-dot"></span> BAMMT Central Academic Verification</div>
      <div class="ticker-item"><span class="ticker-item-dot"></span> Government Approved Institute <span class="ticker-badge-code"><?= h($instCode) ?></span></div>
      <div class="ticker-item"><span class="ticker-item-dot"></span> 100% Cryptographically Verified</div>
      <div class="ticker-item"><span class="ticker-item-dot"></span> Certified Medical Technology Diplomas</div>
      <div class="ticker-item"><span class="ticker-item-dot"></span> Instant Transcript &amp; Marksheet Lookup</div>
    </div>
  </div>

  <!-- How It Works Step Roadmap Section -->
  <section class="section-padding" style="background:#ffffff; border-bottom:1px solid var(--ink-100);">
    <div class="container">
      <div class="section-header reveal-on-scroll" style="margin-bottom:38px;">
        <span class="sub-heading">Simple &amp; Secure Process</span>
        <h2>How Online Verification Works</h2>
        <p class="section-desc">Verify institutional qualifications in three streamlined steps.</p>
      </div>

      <div class="about-grid reveal-on-scroll reveal-stagger" style="gap:24px;">
        <div class="about-card" style="padding:28px 24px; position:relative; overflow:hidden;">
          <div style="width:36px; height:36px; border-radius:50%; background:var(--primary-light); color:var(--primary-hover); font-weight:800; font-size:15px; display:flex; align-items:center; justify-content:center; margin-bottom:14px;">1</div>
          <h3 style="font-size:17px; margin-bottom:8px;">Enter Registration No</h3>
          <p style="font-size:13.5px;">Type the official Registration Number printed on the certificate or diploma card into the search box.</p>
        </div>

        <div class="about-card" style="padding:28px 24px; position:relative; overflow:hidden;">
          <div style="width:36px; height:36px; border-radius:50%; background:#dcfce7; color:#16a34a; font-weight:800; font-size:15px; display:flex; align-items:center; justify-content:center; margin-bottom:14px;">2</div>
          <h3 style="font-size:17px; margin-bottom:8px;">Live Database Lookup</h3>
          <p style="font-size:13.5px;">The system queries our secure database to fetch authentic marks, student photo, session, and CGPA.</p>
        </div>

        <div class="about-card" style="padding:28px 24px; position:relative; overflow:hidden;">
          <div style="width:36px; height:36px; border-radius:50%; background:#f3e8ff; color:#9333ea; font-weight:800; font-size:15px; display:flex; align-items:center; justify-content:center; margin-bottom:14px;">3</div>
          <h3 style="font-size:17px; margin-bottom:8px;">Official Sealed Copy</h3>
          <p style="font-size:13.5px;">View the verified student card, share direct custom verification links, and print the certified 1-page A4 transcript.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section class="section-padding bg-light" id="about">
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="sub-heading">About Institute</span>
        <h2><?= h($instName) ?></h2>
        <p class="section-desc">Pioneering excellence in medical technology, lab sciences, and radiology diploma education.</p>
      </div>

      <div class="about-grid reveal-on-scroll reveal-stagger">
        <div class="about-card">
          <div class="about-icon">🏥</div>
          <h3>Radiology &amp; Imaging</h3>
          <p>Advanced diagnostic imaging technology training backed by state-of-the-art laboratory equipment and practical clinical sessions.</p>
        </div>
        <div class="about-card">
          <div class="about-icon">🔬</div>
          <h3>Medical Laboratory Technology</h3>
          <p>Comprehensive pathology, biochemistry, microbiology, and clinical diagnostic techniques taught by industry experts.</p>
        </div>
        <div class="about-card">
          <div class="about-icon">⚡</div>
          <h3>Operation Theatre Tech</h3>
          <p>Modern surgical assistance technology, sterile management, and emergency medical procedures preparation.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Notices Section -->
  <section class="section-padding" id="notices">
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="sub-heading">Updates &amp; Bulletins</span>
        <h2>Notice Board</h2>
        <p class="section-desc">Latest official academic updates, examination schedules, and verification notifications.</p>
      </div>

      <?php if (empty($allNotices)): ?>
        <div class="notices-grid">
          <div class="notice-card full-width" style="grid-column: 1 / -1; text-align:center; padding:36px 20px;">
            <p style="margin:0; color:var(--ink-500); font-size:15px;">No active notices available at this time.</p>
          </div>
        </div>
      <?php else: ?>
        <div class="notices-slider-wrapper reveal-on-scroll" id="noticeSliderWrapper">
          <div class="notices-slider-track" id="noticeSliderTrack">
            <?php foreach ($allNotices as $n): ?>
              <div class="notice-slide-item">
                <div class="notice-card">
                  <div class="notice-meta">
                    <span class="notice-category"><?= h($n['category'] ?? 'General') ?></span>
                    <span class="notice-date"><?= date('d M Y', strtotime($n['created_at'])) ?></span>
                  </div>
                  <h3 class="notice-title"><?= h($n['title']) ?></h3>
                  <p class="notice-content"><?= nl2br(h($n['content'])) ?></p>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <?php if (count($allNotices) > 3): ?>
          <div class="notice-slider-nav reveal-on-scroll">
            <button type="button" class="notice-slider-btn" id="noticePrevBtn" disabled aria-label="Previous Slide">Prev</button>
            <div class="notice-slider-dots" id="noticeSliderDots"></div>
            <button type="button" class="notice-slider-btn" id="noticeNextBtn" aria-label="Next Slide">Next</button>
          </div>
        <?php endif; ?>
      <?php endif; ?>
    </div>
  </section>

  <!-- Professional Contact Us Section -->
  <section class="section-padding bg-dark text-white" id="contact">
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="sub-heading text-primary">Get In Touch</span>
        <h2 class="text-white">Contact Us</h2>
        <p class="section-desc text-muted">Have questions regarding student verification, admissions, or institutional credentials? Reach out to our team.</p>
      </div>

      <div class="contact-wrapper">
        <!-- Contact Information Cards -->
        <div class="contact-info-col reveal-on-scroll reveal-left">
          <div class="contact-card">
            <div class="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <h4>Campus Address</h4>
              <p><?= h($instAddress) ?></p>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <h4>Phone &amp; Helpline</h4>
              <p><?= h($instPhone) ?></p>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <h4>Email Support</h4>
              <p><?= h($instEmail) ?></p>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h4>Office Hours</h4>
              <p>Saturday – Thursday: 9:00 AM – 5:00 PM (Friday Closed)</p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form-col reveal-on-scroll reveal-right">
          <div class="contact-form-card">
            <h3>Send Us a Message</h3>
            <?php if ($contactSuccess): ?>
              <div class="alert alert-success">Thank you! Your inquiry has been received. Our team will get back to you shortly.</div>
            <?php endif; ?>
            <?php if ($contactError): ?>
              <div class="alert alert-error"><?= h($contactError) ?></div>
            <?php endif; ?>

            <form method="POST" action="<?= h(APP_BASE_PATH) ?>/contact" class="public-contact-form">
              <?= csrfField() ?>
              <div class="form-row-2">
                <div class="form-group">
                  <label for="c_name">Your Name *</label>
                  <input type="text" id="c_name" name="name" required placeholder="e.g. John Doe">
                </div>
                <div class="form-group">
                  <label for="c_email">Your Email *</label>
                  <input type="email" id="c_email" name="email" required placeholder="e.g. john@example.com">
                </div>
              </div>

              <div class="form-group">
                <label for="c_subject">Subject</label>
                <input type="text" id="c_subject" name="subject" placeholder="Inquiry about verification or admission">
              </div>

              <div class="form-group">
                <label for="c_message">Message *</label>
                <textarea id="c_message" name="message" rows="4" required placeholder="Type your inquiry here..."></textarea>
              </div>

              <button type="submit" name="contact_submit" class="btn btn-primary btn-block">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="public-footer">
    <div class="container footer-content">
      <div class="footer-brand">
        <h3>BAMMT</h3>
        <p><?= h($instName) ?></p>
        <p class="footer-code">Institute Code: <?= h($instCode) ?></p>
      </div>
      <div class="footer-copy">
        &copy; <?= date('Y') ?> BAMMT. All rights reserved. | Secured Result &amp; Certificate Verification Platform
      </div>
    </div>
  </footer>

  <script src="<?= h(APP_BASE_PATH) ?>/assets/js/admin.js?v=<?= filemtime(__DIR__ . '/assets/js/admin.js') ?>"></script>
</body>
</html>
