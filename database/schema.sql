-- ============================================================
-- BAMMT Result & Certificate Verification System
-- Comprehensive Database Schema & Seed Data
-- ============================================================
-- Note: If importing into an existing database (such as rizvi_bammt on cPanel),
-- simply select your database in phpMyAdmin and import this file.
-- CREATE DATABASE IF NOT EXISTS rizvi_bammt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE rizvi_bammt;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) DEFAULT NULL,
    full_name VARCHAR(150) DEFAULT 'System Administrator',
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'Super Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Students & Academic Records Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_no VARCHAR(50) NOT NULL UNIQUE,
    roll_no VARCHAR(50) DEFAULT NULL,
    name VARCHAR(150) NOT NULL,
    father_name VARCHAR(150) DEFAULT NULL,
    mother_name VARCHAR(150) DEFAULT NULL,
    date_of_birth DATE DEFAULT NULL,
    gender VARCHAR(20) DEFAULT 'Male',
    phone VARCHAR(30) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    passing_year VARCHAR(50) DEFAULT NULL,
    cgpa VARCHAR(50) DEFAULT NULL,
    grade VARCHAR(20) DEFAULT NULL,
    photo VARCHAR(255) DEFAULT NULL,
    status ENUM('active', 'revoked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_registration (registration_no),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 3. Detailed Results & Marksheets Table
CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    registration_no VARCHAR(50) NOT NULL,
    exam_name VARCHAR(150) NOT NULL DEFAULT 'Final Diploma Examination',
    passing_year VARCHAR(50) DEFAULT NULL,
    total_marks VARCHAR(50) DEFAULT '1000',
    obtained_marks VARCHAR(50) DEFAULT NULL,
    cgpa VARCHAR(50) DEFAULT NULL,
    grade VARCHAR(20) DEFAULT NULL,
    remarks VARCHAR(255) DEFAULT 'Passed',
    published_at DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_res_reg (registration_no)
) ENGINE=InnoDB;

-- 4. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    certificate_no VARCHAR(50) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    certificate_type VARCHAR(100) DEFAULT 'Diploma Certificate',
    status ENUM('active', 'revoked') DEFAULT 'active',
    qr_code_data TEXT DEFAULT NULL,
    revocation_reason TEXT DEFAULT NULL,
    revoked_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_cert_no (certificate_no),
    INDEX idx_cert_status (status)
) ENGINE=InnoDB;

-- 5. Verification Attempt Logs Table
CREATE TABLE IF NOT EXISTS verification_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_no_searched VARCHAR(50) NOT NULL,
    status ENUM('found', 'not_found', 'revoked') NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT DEFAULT NULL,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ver_ip (ip_address),
    INDEX idx_ver_reg (registration_no_searched)
) ENGINE=InnoDB;

-- 6. Security Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT DEFAULT NULL,
    admin_username VARCHAR(50) DEFAULT 'System',
    action VARCHAR(100) NOT NULL,
    details TEXT DEFAULT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_admin (admin_username)
) ENGINE=InnoDB;

-- 7. Notices & Announcements Table
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. Institution Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT DEFAULT NULL,
    setting_group VARCHAR(50) DEFAULT 'general',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. Login Attempts Table (Brute Force Protection)
CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    username VARCHAR(50) DEFAULT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success TINYINT(1) DEFAULT 0,
    INDEX idx_ip_time (ip_address, attempt_time)
) ENGINE=InnoDB;

-- Default Institutional Settings Seed Data
INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
('institute_name', 'Bangladesh Academy of Medical Management Technology', 'general'),
('institute_code', 'BAMMT-BD-88', 'general'),
('institute_email', 'info@bammt.com', 'contact'),
('institute_phone', '+880 2-9883456', 'contact'),
('institute_address', 'House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh', 'contact'),
('principal_name', 'Prof. Dr. M. A. Rahman', 'certificate')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Sample Notices Seed Data
INSERT INTO notices (title, content, category, is_active) VALUES
('Diploma Final Examination Schedule 2026', 'All medical technology diploma final assessments and laboratory practicals will commence from October 10, 2026. Students must collect their admit cards.', 'Examinations', 1),
('Online Certificate Verification Portal Launch', 'BAMMT official real-time credential authentication and cryptographic certificate verification system is now live for employers and students worldwide.', 'General', 1),
('Submission of Clinical Internship Reports', 'Students from the Radiology and Pathology departments must submit clinical logbooks to the department head by the 15th of next month.', 'Academic', 1);

-- Sample Student Record (RI-408)
INSERT INTO students (registration_no, name, father_name, mother_name, date_of_birth, gender, subject, passing_year, cgpa, grade, status)
VALUES ('RI-408', 'Henry Sullivan', 'Arthur Sullivan', 'Eleanor Sullivan', '1998-05-14', 'Male', 'Diploma in Radiology & Imaging Technology', '2024', '3.85', 'A+', 'active')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Sample Result for RI-408
INSERT INTO results (student_id, registration_no, exam_name, passing_year, total_marks, obtained_marks, cgpa, grade, remarks, published_at)
SELECT id, 'RI-408', 'Final Diploma Examination', '2024', '1000', '885', '3.85', 'A+', 'Passed with Distinction', CURDATE()
FROM students WHERE registration_no = 'RI-408' LIMIT 1
ON DUPLICATE KEY UPDATE obtained_marks = VALUES(obtained_marks);

-- Sample Certificate for RI-408
INSERT INTO certificates (student_id, certificate_no, issue_date, certificate_type, status, qr_code_data)
SELECT id, 'CERT-2024-8842', CURDATE(), 'Diploma Certificate', 'active', 'BAMMT|REG:RI-408|CERT:CERT-2024-8842'
FROM students WHERE registration_no = 'RI-408' LIMIT 1
ON DUPLICATE KEY UPDATE certificate_no = VALUES(certificate_no);

-- Default Super Admin (Username: admin / Password: adminPassword123)
-- In production, immediately change password via Admin -> Change Password
INSERT INTO admins (username, email, full_name, password_hash, role)
VALUES ('admin', 'admin@bammt.com', 'BAMMT System Administrator', '$2y$10$PHP1XNfIgly23Ct7gFlVuOW9RmZ2VvFILwdBHmdgvUPAOzDdUmxE.', 'Super Admin')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), email = VALUES(email);

-- Requested Admin Account (Username: ariful@ / Password: ariful@112233)
INSERT INTO admins (username, email, full_name, password_hash, role)
VALUES ('ariful@', 'ariful@bammt.com', 'Ariful Islam (Admin)', '$2y$10$eVhm/.RqbsSYpcHgQwrvB.Xs6E8bvKt4KUokcQPGWT2EvnK87n1uW', 'Super Admin')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), email = VALUES(email);
