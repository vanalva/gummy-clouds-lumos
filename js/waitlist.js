/**
 * Waitlist — join form + "your spot" view with an invite link.
 *
 * FAKE MODE (WAITLIST_ENDPOINT = null): nothing leaves the browser. The entry,
 * a made-up position and a referral code are kept in localStorage so a returning
 * visitor sees their spot again. Referral credit can't work in this mode
 * (referrer and friend are on different browsers).
 *
 * REAL MODE: set WAITLIST_ENDPOINT to a URL that accepts
 *   POST { first_name, email, role, ref }  ->  { position, code, invites }
 * Nothing else on the page needs to change.
 */
(function () {
    var WAITLIST_ENDPOINT = null;
    var STORAGE_KEY = 'gc_waitlist_entry';
    var BASE_POSITION = 1240;
    var SPOTS_PER_INVITE = 5;

    var formState = document.querySelector('[data-waitlist-form-state]');
    var doneState = document.querySelector('[data-waitlist-done-state]');
    var form = document.querySelector('[data-waitlist-form]');
    if (!formState || !doneState || !form) return;

    var errorEl = form.querySelector('[data-waitlist-error]');
    var submitBtn = form.querySelector('[data-waitlist-submit]');
    var ref = (new URLSearchParams(window.location.search).get('ref') || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 12);

    if (ref) {
        var note = document.querySelector('[data-waitlist-ref-note]');
        if (note) note.hidden = false;
    }

    function readEntry() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { return null; }
    }
    function saveEntry(entry) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entry)); } catch (e) {}
    }
    function clearEntry() {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }

    function hash(str) {
        var h = 0;
        for (var i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
        return Math.abs(h);
    }
    function makeCode(email) {
        return hash(email + ':gummy').toString(36).toUpperCase().slice(0, 6);
    }

    function fakeJoin(data) {
        return new Promise(function (resolve) {
            window.setTimeout(function () {
                resolve({
                    position: BASE_POSITION + (hash(data.email) % 90),
                    code: makeCode(data.email),
                    invites: 0
                });
            }, 700);
        });
    }
    function realJoin(data) {
        return fetch(WAITLIST_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw new Error('request failed');
            return res.json();
        });
    }

    function inviteLink(code) {
        return window.location.origin + window.location.pathname + '?ref=' + encodeURIComponent(code);
    }

    function showDone(entry) {
        var link = inviteLink(entry.code);
        var position = Math.max(1, entry.position - (entry.invites || 0) * SPOTS_PER_INVITE);
        doneState.querySelector('[data-waitlist-name]').textContent = entry.first_name;
        doneState.querySelector('[data-waitlist-email]').textContent = entry.email;
        doneState.querySelector('[data-waitlist-position]').textContent = '#' + position.toLocaleString('en-US');
        doneState.querySelector('[data-waitlist-invites]').textContent = entry.invites || 0;
        doneState.querySelector('[data-waitlist-link]').value = link;

        var msg = 'I just joined the Gummy Clouds waitlist, a fun way to get kids brushing. Join with my link: ' + link;
        var shares = {
            whatsapp: 'https://wa.me/?text=' + encodeURIComponent(msg),
            email: 'mailto:?subject=' + encodeURIComponent('Join me on Gummy Clouds') + '&body=' + encodeURIComponent(msg),
            x: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(msg)
        };
        doneState.querySelectorAll('[data-waitlist-share]').forEach(function (a) {
            a.href = shares[a.getAttribute('data-waitlist-share')] || '#';
        });

        formState.classList.add('is-hidden');
        doneState.classList.remove('is-hidden');
    }

    function showError(text) {
        errorEl.textContent = text;
        errorEl.hidden = !text;
    }

    form.addEventListener('input', function () { if (!errorEl.hidden) showError(''); });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        showError('');

        var firstName = form.first_name.value.trim();
        var email = form.email.value.trim().toLowerCase();
        var role = (form.querySelector('input[name="role"]:checked') || {}).value || 'parent';

        // Honeypot: bots fill the hidden field. Pretend it worked.
        if (form.website.value) { form.reset(); return; }

        if (!firstName) { showError('Please add your first name.'); form.first_name.focus(); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('Please enter a valid email address.'); form.email.focus(); return; }

        var data = { first_name: firstName, email: email, role: role, ref: ref || null };
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving your spot…';

        (WAITLIST_ENDPOINT ? realJoin(data) : fakeJoin(data)).then(function (result) {
            var entry = {
                first_name: firstName, email: email, role: role, ref: ref || null,
                position: result.position, code: result.code, invites: result.invites || 0,
                joined_at: new Date().toISOString()
            };
            saveEntry(entry);
            showDone(entry);
        }).catch(function () {
            showError('Something went wrong saving your spot. Please try again in a moment.');
        }).then(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Join the waitlist';
        });
    });

    var copyBtn = doneState.querySelector('[data-waitlist-copy]');
    copyBtn.addEventListener('click', function () {
        var input = doneState.querySelector('[data-waitlist-link]');
        function done() {
            copyBtn.textContent = 'Copied!';
            window.setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1800);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(input.value).then(done, function () { input.select(); });
        } else {
            input.select();
        }
    });

    doneState.querySelector('[data-waitlist-reset]').addEventListener('click', function () {
        clearEntry();
        form.reset();
        doneState.classList.add('is-hidden');
        formState.classList.remove('is-hidden');
        form.first_name.focus();
    });

    var existing = readEntry();
    if (existing && existing.code) showDone(existing);
})();
