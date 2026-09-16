/**
 * Student Result & Certificate Verification JavaScript
 */
document.addEventListener('DOMContentLoaded', function () {
  // Direct Reliable Single Print Handler
  var printBtn = document.getElementById('btnPrintResult') || document.querySelector('.btn-verify-save');
  if (printBtn) {
    printBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.print();
    });
  }

  // Avatar Image Error Fallback
  var avatarImg = document.getElementById('resultAvatarImg');
  var avatarFallback = document.getElementById('resultAvatarFallback');
  if (avatarImg && avatarFallback) {
    avatarImg.addEventListener('error', function () {
      avatarImg.style.display = 'none';
      avatarFallback.style.display = 'flex';
    });
  }

  // Copy Shareable Verification Link
  var shareBox = document.getElementById('shareableLinkBox');
  var copyBadge = document.getElementById('copyBadge');
  if (shareBox && copyBadge) {
    shareBox.addEventListener('click', function () {
      var copyText = this.getAttribute('data-copy') || window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText).then(showCopied, fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        var tempInput = document.createElement('input');
        tempInput.value = copyText;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand('copy');
          showCopied();
        } catch (err) {}
        document.body.removeChild(tempInput);
      }

      function showCopied() {
        var originalHtml = copyBadge.innerHTML;
        copyBadge.innerHTML = '✓ Copied!';
        copyBadge.style.background = '#16a34a';
        copyBadge.style.color = '#ffffff';
        setTimeout(function () {
          copyBadge.innerHTML = originalHtml;
          copyBadge.style.background = '';
          copyBadge.style.color = '';
        }, 2000);
      }
    });
  }

  // --- Scroll-Driven Reveal Animation Engine ---
  var scrollElements = document.querySelectorAll('.reveal-on-scroll');
  if (scrollElements.length > 0) {
    if ('IntersectionObserver' in window) {
      var scrollObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
      });

      scrollElements.forEach(function (el) {
        scrollObserver.observe(el);
      });
    } else {
      scrollElements.forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  }
});
