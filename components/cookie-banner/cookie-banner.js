/* ================================================================
   Cookie Consent Banner — Gummy Clouds
   Vanilla JS, localStorage-based
   ================================================================ */

(function () {
  var STORAGE_KEY = 'gc-cookie-consent';
  var banner = document.querySelector('[data-cookie-banner]');

  if (!banner) return;

  // If consent already given, hide immediately (no transition)
  if (localStorage.getItem(STORAGE_KEY)) {
    banner.classList.add('is-hidden');
    banner.style.display = 'none';
    return;
  }

  function hideBanner() {
    banner.classList.add('is-hidden');
    localStorage.setItem(STORAGE_KEY, 'accepted');
  }

  // Accept all
  var acceptBtn = banner.querySelector('[data-cookie-accept]');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', function (e) {
      e.preventDefault();
      hideBanner();
    });
  }

  // Dismiss (X button) — same as accept
  var dismissBtn = banner.querySelector('[data-cookie-dismiss]');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', function () {
      hideBanner();
    });
  }

  // Manage — navigates to privacy.html (default link behavior, no JS needed)
})();
