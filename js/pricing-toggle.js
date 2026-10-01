// Webflow: Goes in page-level custom code
(function() {
    var toggleBtns = document.querySelectorAll('.pricing_toggle_btn');
    if (!toggleBtns.length) return;

    toggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            toggleBtns.forEach(function(b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');
            var isAnnual = btn.dataset.plan === 'annual';

            document.querySelectorAll('[data-price-monthly]').forEach(function(el) {
                el.textContent = isAnnual ? el.dataset.priceAnnual : el.dataset.priceMonthly;
            });
            document.querySelectorAll('[data-period-toggle]').forEach(function(el) {
                el.textContent = isAnnual ? '/month (billed annually)' : '/month';
            });
        });
    });
})();
