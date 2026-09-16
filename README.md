# BAMMT Result Verification System

A PHP + MySQL web application for BAMMT:
- **Public side**: students enter their Registration Number to view/print their result (`index.php`).
- **Admin side**: staff log in to add, edit, and delete student result records (`admin/`).

## Requirements
- PHP 8.0+ with PDO MySQL extension
- MySQL / MariaDB
- Apache with `mod_rewrite` / `mod_headers` enabled (for `.htaccess` support)

## Setup

1. **Upload files** to your web server (e.g. `public_html/`).

2. **Create the database**:
   ```
   mysql -u root -p < database/schema.sql
   ```
   Then create a dedicated MySQL user (do not use `root`) and grant it access only to `bammt_db`.

3. **Set your database credentials.** Preferably as environment variables (`DB_HOST`, `DB_NAME`,
   `DB_USER`, `DB_PASS`) in your hosting panel, or edit the fallback values in `config/database.php`
   directly (then make sure that file stays outside version control / is not web-readable — the
   included `.htaccess` already blocks browser access to `/config/`).

4. **Create your first admin account.** Two options:

   - **If you have SSH/terminal access**, run this from the command line:
     ```
     php database/create_admin.php
     ```
     After running it once, delete `database/create_admin.php` or move it outside the web root.

   - **If you're on shared hosting with no SSH access**, visit `setup_admin.php` in your browser
     (e.g. `https://yourdomain.com/setup_admin.php`) and fill in a username/password there instead.
     This script automatically locks itself the moment an admin account is created — it will
     refuse to run a second time even if the URL is found later — but you should still **delete
     `setup_admin.php` from your server immediately** after successfully creating your admin.

5. **Make the uploads folder writable**:
   ```
   chmod 755 uploads/photos
   ```

6. Visit `https://yourdomain.com/` for the public verify page, and
   `https://yourdomain.com/admin/login.php` for the admin panel.

## Security measures already built in

- **SQL Injection** – every database query uses PDO prepared statements with bound parameters
  (`PDO::ATTR_EMULATE_PREPARES` disabled).
- **XSS** – all dynamic output is passed through `h()` (`htmlspecialchars`) before being echoed.
- **CSRF** – every state-changing form (login, add/edit/delete result, change password) includes
  and verifies a per-session CSRF token.
- **Password storage** – admin passwords are hashed with `password_hash()` (bcrypt) and checked
  with `password_verify()`. Plaintext passwords are never stored.
- **Session security** – `HttpOnly`, `SameSite=Strict` cookies, session ID regeneration on login
  (prevents session fixation), and automatic logout after 30 minutes idle.
- **Brute-force protection** – failed admin login attempts are logged per IP; after 5 failures the
  IP is locked out for 15 minutes.
- **File upload validation** – uploaded photos are checked by real file content (not just the
  extension), limited to JPG/PNG, capped at 2MB, and renamed to a random filename on save. The
  `uploads/` folder has its own `.htaccess` that blocks script execution outright, so even a file
  that somehow slipped through validation cannot run as PHP.
- **Directory protection** – `.htaccess` files block direct browser access to `/config/`,
  `/includes/`, and `/database/` (which holds `schema.sql` and the one-time admin-creation script).
- **Security headers** – `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`,
  and `Referrer-Policy` are set on every page.
- **Input validation** – registration numbers are restricted to a safe character set both on the
  public search and in the admin form.

## Before going live

- [ ] Enable HTTPS and uncomment the force-HTTPS block in `config/config.php`.
- [ ] Set real, strong database credentials (not the placeholder value).
- [ ] Delete or relocate `database/create_admin.php` after creating your admin account.
- [ ] Use a dedicated low-privilege MySQL user, not `root`.
- [ ] Take regular database backups (`mysqldump`).
- [ ] Consider adding a CAPTCHA to the admin login form if you expect targeted attacks.
