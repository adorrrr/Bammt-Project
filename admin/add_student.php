<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

requireLogin();
$pdo = getDBConnection();

$errors = [];
$old = [
    'registration_no' => '',
    'name' => '',
    'father_name' => '',
    'mother_name' => '',
    'date_of_birth' => '',
    'gender' => 'Male',
    'phone' => '',
    'email' => '',
    'address' => '',
    'subject' => '',
    'passing_year' => date('Y'),
    'cgpa' => '',
    'grade' => '',
    'exam_name' => 'Final Diploma Examination',
    'remarks' => 'Passed',
    'issue_certificate' => '1',
    'certificate_no' => 'CERT-' . date('Y') . '-' . rand(1000, 9999),
    'issue_date' => date('Y-m-d'),
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $errors[] = 'Invalid security token. Please try again.';
    } else {
        foreach ($old as $key => $_) {
            $old[$key] = cleanInput($_POST[$key] ?? '');
        }

        if ($old['registration_no'] === '' || !isValidRegistrationNo($old['registration_no'])) {
            $errors[] = 'A valid Registration Number is required (alphanumeric, -, / only).';
        }
        if ($old['name'] === '') {
            $errors[] = 'Student legal name is required.';
        }
        if ($old['subject'] === '') {
            $errors[] = 'Course / Subject is required.';
        }
        if ($old['date_of_birth'] !== '' && !DateTime::createFromFormat('Y-m-d', $old['date_of_birth'])) {
            $errors[] = 'Invalid date of birth format.';
        }

        // Handle Photo Upload
        $photoFilename = null;
        if (empty($errors)) {
            try {
                $photoFilename = handlePhotoUpload($_FILES['photo'] ?? []);
            } catch (Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        if (empty($errors)) {
            try {
                $pdo->beginTransaction();

                // 1. Insert Student Record
                $stmt = $pdo->prepare(
                    "INSERT INTO students
                    (registration_no, name, father_name, mother_name, date_of_birth, gender, phone, email, address, subject, passing_year, cgpa, grade, photo, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')"
                );
                $stmt->execute([
                    $old['registration_no'], $old['name'], $old['father_name'], $old['mother_name'],
                    $old['date_of_birth'] ?: null, $old['gender'], $old['phone'], $old['email'], $old['address'],
                    $old['subject'], $old['passing_year'], $old['cgpa'], $old['grade'], $photoFilename
                ]);
                $studentId = (int) $pdo->lastInsertId();

                // 2. Insert Marksheet Result Record
                $resStmt = $pdo->prepare(
                    "INSERT INTO results
                    (student_id, registration_no, exam_name, passing_year, cgpa, grade, remarks, published_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())"
                );
                $resStmt->execute([
                    $studentId, $old['registration_no'], $old['exam_name'], $old['passing_year'],
                    $old['cgpa'], $old['grade'], $old['remarks'] ?: 'Passed'
                ]);

                // 3. Insert Certificate if selected
                if (!empty($_POST['issue_certificate'])) {
                    $certNo = $old['certificate_no'] !== '' ? $old['certificate_no'] : ('CERT-' . date('Y') . '-' . rand(1000, 9999));
                    $issueDate = $old['issue_date'] !== '' ? $old['issue_date'] : date('Y-m-d');
                    $qrData = "BAMMT|REG:" . $old['registration_no'] . "|CERT:" . $certNo;

                    $certStmt = $pdo->prepare(
                        "INSERT INTO certificates (student_id, certificate_no, issue_date, certificate_type, status, qr_code_data)
                         VALUES (?, ?, ?, 'Diploma Certificate', 'active', ?)"
                    );
                    $certStmt->execute([$studentId, $certNo, $issueDate, $qrData]);
                }

                $pdo->commit();
                logAudit($pdo, 'ADD_STUDENT', 'Created student ' . $old['name'] . ' (' . $old['registration_no'] . ')');
                redirect(getAdminUrl('students') . '?added=1');
            } catch (PDOException $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                if ($e->getCode() == 23000) {
                    $errors[] = 'This Registration Number already exists in the system.';
                } else {
                    error_log('Insert student failed: ' . $e->getMessage());
                    $errors[] = 'Database error occurred. Please check your data and try again.';
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Add Student Record — <?= h(SITE_NAME) ?></title>
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
            <h2>Add New Student &amp; Result</h2>
            <p class="page-sub">Enter academic records, marksheet scores, and generate official certificate serials.</p>
          </div>
          <a href="<?= getAdminUrl('students') ?>" class="btn btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Students
          </a>
        </div>

        <?php foreach ($errors as $err): ?>
          <div class="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <?= h($err) ?>
          </div>
        <?php endforeach; ?>

        <div class="card">
          <form method="POST" action="<?= getAdminUrl('add_student') ?>" enctype="multipart/form-data" class="form-grid">
            <?= csrfField() ?>

            <!-- Section 1: Basic Student Information -->
            <div class="form-section-title"><span class="form-section-num">1</span> Student Identification &amp; Personal Info</div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="registration_no">Registration Number *</label>
                <input type="text" id="registration_no" name="registration_no" value="<?= h($old['registration_no']) ?>" required maxlength="50" placeholder="e.g. RI-408" autofocus>
              </div>

              <div class="form-group">
                <label for="name">Student Legal Name *</label>
                <input type="text" id="name" name="name" value="<?= h($old['name']) ?>" required maxlength="150" placeholder="e.g. Mohammad Rahim">
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="father_name">Father's Name</label>
                <input type="text" id="father_name" name="father_name" value="<?= h($old['father_name']) ?>" maxlength="150">
              </div>

              <div class="form-group">
                <label for="mother_name">Mother's Name</label>
                <input type="text" id="mother_name" name="mother_name" value="<?= h($old['mother_name']) ?>" maxlength="150">
              </div>
            </div>

            <div class="form-row-3">
              <div class="form-group">
                <label for="date_of_birth">Date of Birth</label>
                <input type="date" id="date_of_birth" name="date_of_birth" value="<?= h($old['date_of_birth']) ?>">
              </div>

              <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" name="gender">
                  <option value="Male" <?= $old['gender'] === 'Male' ? 'selected' : '' ?>>Male</option>
                  <option value="Female" <?= $old['gender'] === 'Female' ? 'selected' : '' ?>>Female</option>
                  <option value="Other" <?= $old['gender'] === 'Other' ? 'selected' : '' ?>>Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="text" id="phone" name="phone" value="<?= h($old['phone']) ?>" placeholder="e.g. 017xxxxxxxx">
              </div>
            </div>

            <div class="form-group">
              <label for="photo">Student Passport Photo (JPG/PNG, Max 2MB)</label>
              <div style="display:flex; align-items:center; gap:14px;">
                <div style="width:56px; height:56px; border-radius:50%; overflow:hidden; flex-shrink:0; border:2px solid var(--ink-200); background:var(--surface-alt); display:flex; align-items:center; justify-content:center;">
                  <img id="photoPreviewImg" src="" alt="Preview" style="width:100%; height:100%; object-fit:cover; display:none;">
                  <svg id="photoPreviewFallback" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ink-400);"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <input type="file" id="photoInput" name="photo" accept="image/jpeg,image/png" style="flex:1;">
              </div>
            </div>

            <!-- Section 2: Academic & Course Information -->
            <div class="form-section-title"><span class="form-section-num">2</span> Academic Program &amp; Marksheet Results</div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="subject">Course / Subject Program *</label>
                <input type="text" id="subject" name="subject" value="<?= h($old['subject']) ?>" required placeholder="e.g. Diploma in Radiology &amp; Imaging Technology">
              </div>

              <div class="form-group">
                <label for="passing_year">Passing Year / Session</label>
                <input type="text" id="passing_year" name="passing_year" value="<?= h($old['passing_year']) ?>" placeholder="e.g. 2024">
              </div>
            </div>

            <div class="form-row-3">
              <div class="form-group">
                <label for="exam_name">Examination Title</label>
                <input type="text" id="exam_name" name="exam_name" value="<?= h($old['exam_name']) ?>">
              </div>

              <div class="form-group">
                <label for="cgpa">CGPA Score</label>
                <input type="text" id="cgpa" name="cgpa" value="<?= h($old['cgpa']) ?>" placeholder="e.g. 3.85">
              </div>

              <div class="form-group">
                <label for="grade">Letter Grade</label>
                <input type="text" id="grade" name="grade" value="<?= h($old['grade']) ?>" placeholder="e.g. A+">
              </div>
            </div>

            <!-- Section 3: Certificate Details -->
            <div class="form-section-title"><span class="form-section-num">3</span> Official Certificate Generation</div>

            <div class="form-group">
              <label class="form-toggle" style="padding:10px 12px; background:var(--surface-alt); border:1px solid var(--ink-200); border-radius:8px;">
                <input type="checkbox" name="issue_certificate" value="1" <?= $old['issue_certificate'] ? 'checked' : '' ?>>
                <span class="toggle-track"></span>
                <span class="form-toggle-label">Automatically generate and issue official Certificate record</span>
              </label>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="certificate_no">Certificate Serial No</label>
                <input type="text" id="certificate_no" name="certificate_no" value="<?= h($old['certificate_no']) ?>">
              </div>

              <div class="form-group">
                <label for="issue_date">Certificate Issue Date</label>
                <input type="date" id="issue_date" name="issue_date" value="<?= h($old['issue_date']) ?>">
              </div>
            </div>

            <div class="form-actions mt-4">
              <a href="<?= getAdminUrl('students.php') ?>" class="btn btn-secondary">Cancel</a>
              <button type="submit" class="btn btn-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Save Student &amp; Result Record
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
