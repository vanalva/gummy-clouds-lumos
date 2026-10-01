/**
 * Hero Scroll
 *
 * 1. Hero scene parallax — SVGs with [data-hero-parallax] slide up from
 *    below as the hero section scrolls into view. The attribute value
 *    (0–1) controls speed: higher = enters faster.
 *
 * 2. Video scrub — scrubs [data-hero-video] based on scroll through
 *    .hero_video_wrap.
 *
 * 3. Checkpoints — toggles .is-active on [data-checkpoint] elements
 *    based on video progress ranges.
 */
(function () {

    /* ── Hero scene parallax ── */
    var heroWrap = document.querySelector('.hero_home_wrap');
    var parallaxEls = document.querySelectorAll('[data-hero-parallax]');

    function updateParallax() {
        if (!heroWrap || !parallaxEls.length) return;
        var rect = heroWrap.getBoundingClientRect();
        var scrollable = heroWrap.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;
        var progress = Math.max(0, Math.min(1, -rect.top / scrollable));

        for (var i = 0; i < parallaxEls.length; i++) {
            var el = parallaxEls[i];
            var speed = parseFloat(el.getAttribute('data-hero-parallax'));
            var dir = el.getAttribute('data-hero-direction');
            var yPercent;
            if (dir === 'up') {
                // starts at 70% (mostly hidden below), shifts up on scroll
                yPercent = 55 - progress * speed * 100;
            } else {
                // default: starts at 100%, moves to 0%
                yPercent = (1 - progress * speed) * 100;
                yPercent = Math.max(0, yPercent);
            }
            el.style.transform = 'translateY(' + yPercent + '%)';
        }
    }

    /* ── Video scrub + checkpoints ── */
    var video = document.querySelector('[data-hero-video]');
    var wrap = document.querySelector('.hero_video_wrap');

    var checkpoints = [];
    var cpData = [];
    if (wrap) {
        checkpoints = Array.prototype.slice.call(
            document.querySelectorAll('[data-checkpoint]')
        );
        cpData = checkpoints.map(function (el) {
            return {
                el: el,
                start: parseFloat(el.getAttribute('data-cp-start')),
                end: parseFloat(el.getAttribute('data-cp-end'))
            };
        });
    }

    function getVideoProgress() {
        if (!wrap) return 0;
        var rect = wrap.getBoundingClientRect();
        var scrollable = wrap.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return 0;
        return Math.max(0, Math.min(1, -rect.top / scrollable));
    }

    function updateVideo() {
        if (!video || !wrap) return;
        var progress = getVideoProgress();

        if (video.readyState >= 2 && isFinite(video.duration)) {
            var target = progress * video.duration;
            if (Math.abs(video.currentTime - target) > 0.05) {
                video.currentTime = target;
            }
        }

        for (var i = 0; i < cpData.length; i++) {
            var cp = cpData[i];
            var active = progress >= cp.start && progress <= cp.end;
            if (active && !cp.el.classList.contains('is-active')) {
                cp.el.classList.add('is-active');
            } else if (!active && cp.el.classList.contains('is-active')) {
                cp.el.classList.remove('is-active');
            }
        }
    }

    /* ── Scroll loop ── */
    var ticking = false;

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(function () {
                ticking = false;
                updateParallax();
                updateVideo();
            });
        }
    }

    if (video) {
        video.addEventListener('loadedmetadata', function () {
            video.currentTime = 0;
            updateVideo();
        });
        if (video.readyState >= 1) {
            video.currentTime = 0;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();
    updateVideo();
})();
