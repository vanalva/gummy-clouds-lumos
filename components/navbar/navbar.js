// Webflow: Goes in page-level custom code (before </body>)
// Dependencies: None
// Handles: Mobile menu toggle

(function () {
    var trigger = document.querySelector('[data-nav-trigger]');
    var menu = document.querySelector('[data-nav-menu]');
    if (!trigger || !menu) return;

    // Mobile menu toggle
    trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        menu.setAttribute('aria-hidden', String(isOpen));
        menu.classList.toggle('is-open');
        trigger.classList.toggle('is-open');
        document.body.style.setProperty('overflow-y', isOpen ? '' : 'hidden');
    });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            trigger.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            menu.classList.remove('is-open');
            trigger.classList.remove('is-open');
            document.body.style.removeProperty('overflow-y');
        });
    });
})();
