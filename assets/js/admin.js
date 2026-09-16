/**
 * BAMMT Admin Portal JavaScript interactions
 */
document.addEventListener('DOMContentLoaded', function () {
  // Modern Toast Notification Utility
  window.showToast = function (message) {
    var toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast-notification';
      toast.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span id="globalToastText"></span>';
      document.body.appendChild(toast);
    }
    var textEl = document.getElementById('globalToastText');
    if (textEl) textEl.textContent = message || 'Copied to clipboard!';
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2400);
  };

  // Instant Photo Upload Preview
  var photoInput = document.getElementById('photoInput') || document.querySelector('input[type="file"][name="photo"]');
  var photoPreview = document.getElementById('photoPreviewImg');
  if (photoInput && photoPreview) {
    photoInput.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          photoPreview.src = e.target.result;
          photoPreview.style.display = 'block';
          var fallback = document.getElementById('photoPreviewFallback');
          if (fallback) fallback.style.display = 'none';
        };
        reader.readAsDataURL(this.files[0]);
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
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      });

      scrollElements.forEach(function (el) {
        scrollObserver.observe(el);
      });
    } else {
      // Fallback
      scrollElements.forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  }

  // Mobile Sidebar Toggle
  var sidebar = document.getElementById('adminSidebar');
  var sidebarToggle = document.getElementById('sidebarToggle');
  var sidebarClose = document.getElementById('sidebarCloseBtn');
  var backdrop = document.getElementById('sidebarBackdrop');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.add('open');
      if (backdrop) backdrop.style.display = 'block';
    });
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.style.display = 'none';
  }

  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  // Auto Select on Input Focus for Copy Fields
  document.querySelectorAll('.select-all').forEach(function (el) {
    el.addEventListener('focus', function () {
      this.select();
    });
  });

  // Copyable link box helper with Toast
  var copyLinkBox = document.getElementById('shareableLinkBox');
  if (copyLinkBox) {
    copyLinkBox.addEventListener('click', function () {
      var copyText = this.getAttribute('data-copy') || window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText).then(function () {
          window.showToast('Verification link copied to clipboard!');
        });
      } else {
        var tempInput = document.createElement('input');
        tempInput.value = copyText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        window.showToast('Verification link copied to clipboard!');
      }
    });
  }

  // Public Nav Toggle
  var publicToggle = document.getElementById('publicNavToggle');
  var publicNav = document.querySelector('.public-nav');
  if (publicToggle && publicNav) {
    publicToggle.addEventListener('click', function () {
      publicNav.classList.toggle('open');
    });
  }

  // Scroll to section helper with modern scrollIntoView & fallback
  function jumpToSection(sectionId, updateUrl, newUrl) {
    if (!sectionId) return;
    var target = document.getElementById(sectionId);
    if (!target) return;

    if (updateUrl && newUrl && window.history && window.history.pushState) {
      window.history.pushState(null, '', newUrl);
    }

    try {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      var navHeight = document.querySelector('.public-header') ? document.querySelector('.public-header').offsetHeight : 70;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }

    // Update active nav link state
    document.querySelectorAll('.public-nav a').forEach(function (l) {
      var lSection = l.getAttribute('data-section');
      var lHref = l.getAttribute('href') || '';
      if (lSection === sectionId || lHref.endsWith('/' + sectionId)) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });

    // Close mobile nav drawer if open
    if (publicNav) publicNav.classList.remove('open');
  }

  // Global click listener for all section links (navbar, hero, footer, etc.)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var sectionId = link.getAttribute('data-section');

    // Do NOT intercept pagination buttons or search queries
    if (link.closest('.public-pagination') || link.classList.contains('notice-page-btn') || href.indexOf('notice_page=') !== -1) {
      return;
    }

    if (!sectionId && href) {
      var m = href.match(/\/(verify|about|notices|contact)[\/\#]?$/);
      if (m) {
        sectionId = m[1];
      }
    }

    if (sectionId && document.getElementById(sectionId)) {
      e.preventDefault();
      var targetUrl = href || (window.location.origin + window.location.pathname.replace(/\/(verify|about|notices|contact)?\/?$/, '') + '/' + sectionId);
      jumpToSection(sectionId, true, targetUrl);
    }
  });

  // Handle direct page loads to /about, /notices, /contact, /verify, notice_page query, or legacy hash
  function checkUrlOnLoad() {
    var path = window.location.pathname.replace(/\/+$/, '');
    var match = path.match(/\/(verify|about|notices|contact)$/);
    var sectionId = match ? match[1] : (window.location.hash ? window.location.hash.replace('#', '') : null);

    if (!sectionId && window.location.search && window.location.search.indexOf('notice_page=') !== -1) {
      sectionId = 'notices';
    }

    if (sectionId && document.getElementById(sectionId)) {
      // Clean legacy hash if present in URL bar without reload
      if (window.location.hash && window.history && window.history.replaceState) {
        var baseNoHash = window.location.pathname.replace(/\/(index\.php)?\/?$/, '');
        var cleanPath = baseNoHash + '/' + sectionId;
        window.history.replaceState(null, '', cleanPath);
      }

      // Smooth scroll to target on initial load (with short delays to ensure DOM is rendered)
      jumpToSection(sectionId, false);
      setTimeout(function () { jumpToSection(sectionId, false); }, 150);
      setTimeout(function () { jumpToSection(sectionId, false); }, 400);
    }
  }

  checkUrlOnLoad();
  window.addEventListener('load', checkUrlOnLoad);
  window.addEventListener('popstate', checkUrlOnLoad);

  // --- Universal Custom Delete Confirmation Modal ---
  var activeDeleteForm = null;
  var deleteModal = document.getElementById('deleteConfirmModal');
  var targetNameEl = document.getElementById('deleteModalTargetName');
  var targetRegEl = document.getElementById('deleteModalTargetReg');
  var targetRegWrap = document.getElementById('deleteModalRegWrap');
  var cancelBtn = document.getElementById('deleteModalCancelBtn');
  var confirmBtn = document.getElementById('deleteModalConfirmBtn');

  function openCustomDeleteModal(form, name, regNo) {
    activeDeleteForm = form;
    if (!deleteModal) return;

    if (targetNameEl) targetNameEl.textContent = name || 'this record';
    if (targetRegEl && targetRegWrap) {
      if (regNo) {
        targetRegEl.textContent = regNo;
        targetRegWrap.style.display = 'inline-flex';
      } else {
        targetRegWrap.style.display = 'none';
      }
    }

    deleteModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeCustomDeleteModal() {
    activeDeleteForm = null;
    if (deleteModal) {
      deleteModal.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  if (cancelBtn) cancelBtn.addEventListener('click', closeCustomDeleteModal);
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      if (activeDeleteForm) {
        activeDeleteForm.setAttribute('data-confirmed', 'true');
        activeDeleteForm.submit();
      }
    });
  }

  // Click outside to close modal
  if (deleteModal) {
    deleteModal.addEventListener('click', function (e) {
      if (e.target === deleteModal) {
        closeCustomDeleteModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && deleteModal && deleteModal.style.display !== 'none') {
      closeCustomDeleteModal();
    }
  });

  // Global listener for delete forms
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.getAttribute('data-confirm-delete') || form.classList.contains('delete-form')) {
      if (form.getAttribute('data-confirmed') === 'true') {
        return; // Proceed with form submit
      }
      e.preventDefault();
      var name = form.getAttribute('data-name') || '';
      var reg = form.getAttribute('data-reg') || '';
      openCustomDeleteModal(form, name, reg);
    }
  });

  // --- Submit Button Loading Feedback (Save / Publish / Update forms) ---
  // Purely presentational: gives instant visual confirmation while the
  // server round-trip (DB write, photo upload, etc.) completes. Delete
  // forms are handled by the confirmation modal above and GET/search
  // forms are excluded since they don't mutate data.
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    if (form.hasAttribute('data-confirm-delete') || form.classList.contains('delete-form')) return;
    if (form.classList.contains('js-no-loading')) return;
    var method = (form.getAttribute('method') || 'GET').toUpperCase();
    if (method === 'GET') return;

    var submitBtn = form.querySelector('button[type="submit"]:not([formnovalidate]), input[type="submit"]');
    if (submitBtn && !submitBtn.classList.contains('is-loading')) {
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      // Safety timeout: re-enable if the browser blocks navigation
      // (e.g. client-side validation error surfaced after this handler).
      setTimeout(function () {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }, 15000);
    }
  });

  // --- Home Page Notice Board Continuous Carousel Slider ---
  var track = document.getElementById('noticeSliderTrack');
  var prevBtn = document.getElementById('noticePrevBtn');
  var nextBtn = document.getElementById('noticeNextBtn');
  var dotsContainer = document.getElementById('noticeSliderDots');
  var items = track ? track.querySelectorAll('.notice-slide-item') : [];
  var currentNoticeIndex = 0;
  var totalItems = items.length;

  function getVisibleCount() {
    var width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    var visible = getVisibleCount();
    return Math.max(0, totalItems - visible);
  }

  function buildNoticeDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    var maxIdx = getMaxIndex();
    if (maxIdx <= 0) return;

    for (var i = 0; i <= maxIdx; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'notice-dot' + (i === currentNoticeIndex ? ' active' : '');
      dot.setAttribute('data-slide', i);
      dot.setAttribute('aria-label', 'Notice position ' + (i + 1));
      dotsContainer.appendChild(dot);
    }
  }

  function updateNoticeSlider(newIndex) {
    if (!track || totalItems === 0) return;
    var maxIndex = getMaxIndex();
    currentNoticeIndex = Math.max(0, Math.min(newIndex, maxIndex));

    var firstItem = items[0];
    if (firstItem) {
      var itemWidth = firstItem.getBoundingClientRect().width;
      var gap = window.innerWidth <= 768 ? 14 : (window.innerWidth <= 1024 ? 18 : 24);
      var movePx = currentNoticeIndex * (itemWidth + gap);
      track.style.transform = 'translateX(-' + movePx + 'px)';
    }

    if (prevBtn) prevBtn.disabled = (currentNoticeIndex === 0);
    if (nextBtn) nextBtn.disabled = (currentNoticeIndex >= maxIndex);

    if (dotsContainer) {
      var dots = dotsContainer.querySelectorAll('.notice-dot');
      dots.forEach(function (d, idx) {
        if (idx === currentNoticeIndex) {
          d.classList.add('active');
        } else {
          d.classList.remove('active');
        }
      });
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.preventDefault();
      updateNoticeSlider(currentNoticeIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      updateNoticeSlider(currentNoticeIndex + 1);
    });
  }

  if (dotsContainer) {
    dotsContainer.addEventListener('click', function (e) {
      var dot = e.target.closest('.notice-dot');
      if (dot) {
        e.preventDefault();
        var targetIndex = parseInt(dot.getAttribute('data-slide'), 10) || 0;
        updateNoticeSlider(targetIndex);
      }
    });
  }

  if (track && totalItems > 0) {
    buildNoticeDots();
    updateNoticeSlider(0);
    window.addEventListener('resize', function () {
      buildNoticeDots();
      updateNoticeSlider(currentNoticeIndex);
    });

    var touchStartX = 0;
    var touchEndX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        updateNoticeSlider(currentNoticeIndex + 1);
      } else if (touchEndX - touchStartX > 45) {
        updateNoticeSlider(currentNoticeIndex - 1);
      }
    }, { passive: true });
  }

  // --- Admin Notices Management Smooth Carousel Slider ---
  var adminTrack = document.getElementById('adminNoticeSliderTrack');
  var adminPrevBtn = document.getElementById('adminNoticePrevBtn');
  var adminNextBtn = document.getElementById('adminNoticeNextBtn');
  var adminDotsContainer = document.getElementById('adminNoticeSliderDots');
  var adminSlides = adminTrack ? adminTrack.querySelectorAll('.admin-notice-slide') : [];
  var currentAdminSlide = 0;
  var totalAdminSlides = adminSlides.length;

  function updateAdminNoticeSlider(newIndex) {
    if (!adminTrack || totalAdminSlides === 0) return;
    currentAdminSlide = Math.max(0, Math.min(newIndex, totalAdminSlides - 1));

    // Smooth transform without page reload or route change
    adminTrack.style.transform = 'translateX(-' + (currentAdminSlide * 100) + '%)';

    // Update button states
    if (adminPrevBtn) adminPrevBtn.disabled = (currentAdminSlide === 0);
    if (adminNextBtn) adminNextBtn.disabled = (currentAdminSlide >= totalAdminSlides - 1);

    // Update active dot indicators
    if (adminDotsContainer) {
      var dots = adminDotsContainer.querySelectorAll('.notice-dot');
      dots.forEach(function (dot, idx) {
        if (idx === currentAdminSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  if (adminPrevBtn) {
    adminPrevBtn.addEventListener('click', function (e) {
      e.preventDefault();
      updateAdminNoticeSlider(currentAdminSlide - 1);
    });
  }

  if (adminNextBtn) {
    adminNextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      updateAdminNoticeSlider(currentAdminSlide + 1);
    });
  }

  if (adminDotsContainer) {
    adminDotsContainer.addEventListener('click', function (e) {
      var dot = e.target.closest('.notice-dot');
      if (dot) {
        e.preventDefault();
        var targetIndex = parseInt(dot.getAttribute('data-slide'), 10) || 0;
        updateAdminNoticeSlider(targetIndex);
      }
    });
  }
});
