(function() {
    var bar = document.querySelector('[data-notification-bar]');
    if (!bar) return;
    var close = bar.querySelector('[data-notif-close]');
    if (close) {
        close.addEventListener('click', function() {
            bar.classList.add('is-hidden');
        });
    }
})();
