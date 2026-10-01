// Webflow: Goes in page-level custom code
// Handles: prev/next button click for card carousels
(function() {
    document.querySelectorAll('.c-button-arrow').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var section = btn.closest('.u-section') || btn.closest('section');
            if (!section) return;
            var grid = section.querySelector('.u-grid-3, .u-grid-2');
            if (!grid) return;
            var scrollAmount = grid.firstElementChild ? grid.firstElementChild.offsetWidth + 20 : 300;
            if (btn.getAttribute('aria-label') === 'Previous') {
                grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });
    });
})();
