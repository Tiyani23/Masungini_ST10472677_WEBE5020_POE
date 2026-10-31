// DOM selector helpers
function $(selector, root) {
    return (root || document).querySelector(selector);
}
function $$(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
}

/* ---------- Toast Notification ---------- */
    function showToast(message, type, duration) {
        type = type || 'success';
        duration = duration || 4500;

        $$('.hh-toast').forEach(function (t) { t.remove(); });

        const icons = { success: '✓', error: '⚠', info: 'ℹ', warning: '⚡' };

        const toast = document.createElement('div');
        toast.className = 'hh-toast ' + type;
        toast.setAttribute('role', 'status');
        toast.innerHTML =
            '<span class="hh-toast-icon">' + (icons[type] || 'ℹ') + '</span>' +
            '<span class="hh-toast-text">' + message + '</span>';

        document.body.appendChild(toast);
        void toast.offsetWidth;
        toast.classList.add('show');

        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 500);
        }, duration);
    }

    /* ---------- Modal Popup ---------- */
    function showModal(title, message, icon) {
        icon = icon || '✓';

        const overlay = document.createElement('div');
        overlay.className = 'hh-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML =
            '<div class="hh-modal">' +
                '<span class="hh-modal-icon">' + icon + '</span>' +
                '<h3>' + title + '</h3>' +
                '<p>' + message + '</p>' +
                '<button class="btn btn-primary" id="hhModalClose">Great, thanks!</button>' +
            '</div>';

        document.body.appendChild(overlay);
        void overlay.offsetWidth;
        overlay.classList.add('show');

        function close() {
            overlay.classList.remove('show');
            setTimeout(function () { overlay.remove(); }, 400);
        }

        overlay.querySelector('#hhModalClose').addEventListener('click', close);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) close();
        });

        setTimeout(function () {
            const btn = overlay.querySelector('#hhModalClose');
            if (btn) btn.focus();
        }, 100);

        return overlay;
    }

    /* ---------- Validation Helpers ---------- */
    const isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
    const isPhone = function (v) { return /^[\d\s+()-]{10,}$/.test(v); };
    const isName  = function (v) { return v.length >= 2 && v.length <= 80; };

    function setFieldError(field, message) {
        if (!field) return;
        field.classList.add('error');
        field.classList.remove('valid');

        let err = field.parentElement.querySelector('.error-text');
        if (!err) {
            err = document.createElement('span');
            err.className = 'error-text';
            field.parentElement.appendChild(err);
        }
        err.textContent = message;
    }

    function clearFieldError(field) {
        if (!field) return;
        field.classList.remove('error');
        const err = field.parentElement.querySelector('.error-text');
        if (err) err.textContent = '';
    }

    function markFieldValid(field) {
        if (!field) return;
        field.classList.add('valid');
        field.classList.remove('error');
        const err = field.parentElement.querySelector('.error-text');
        if (err) err.textContent = '';
    }

    function validateForm(fields) {
        let valid = true;
        let firstInvalid = null;

        fields.forEach(function (item) {
            if (!item.el) return;
            const val = item.el.value.trim();
            if (!item.check(val)) {
                setFieldError(item.el, item.msg);
                if (!firstInvalid) firstInvalid = item.el;
                valid = false;
            } else {
                markFieldValid(item.el);
            }
        });

        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return valid;
    }

    function setLoading(btn, loading, loadingText) {
        if (!btn) return;
        if (loading) {
            if (!btn.dataset.original) btn.dataset.original = btn.textContent.trim();
            btn.textContent = loadingText || 'Please wait...';
            btn.disabled = true;
            btn.classList.add('loading');
        } else {
            btn.textContent = btn.dataset.original || 'Submit';
            btn.disabled = false;
            btn.classList.remove('loading');
        }
    }

    
    /* ================================================================
       4. MOBILE MENU
       ================================================================ */
    const menuToggle = $('#menuToggle');
    const mainNav = $('#mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            mainNav.classList.toggle('open');
            const isOpen = mainNav.classList.contains('open');
            menuToggle.textContent = isOpen ? '✕' : '☰';
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        $$('a', mainNav).forEach(function (a) {
            a.addEventListener('click', function () {
                mainNav.classList.remove('open');
                menuToggle.textContent = '☰';
            });
        });

        document.addEventListener('click', function (e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('open');
                menuToggle.textContent = '☰';
            }
        });
    }

    /* ================================================================
       5. ACTIVE NAV LINK
       ================================================================ */
    (function () {
        const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        $$('nav a').forEach(function (link) {
            const href = (link.getAttribute('href') || '').toLowerCase().split('#')[0];
            if (!href) return;
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    })();

    /* ================================================================
       6. HEADER SCROLL EFFECT
       ================================================================ */
    const header = $('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /* ================================================================
       7. SMOOTH SCROLL
       ================================================================ */
    $$('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            const id = a.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            const target = document.getElementById(id.slice(1));
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });



    

    /* ================================================================
       11. NEWSLETTER FORM
       → "Subscription successful!"
       ================================================================ */
    const newsletterForm = $('#newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = $('#newsletterEmail');
            const msg = $('#newsletterMessage');
            const btn = newsletterForm.querySelector('button[type="submit"]');
            const email = emailInput ? emailInput.value.trim() : '';

            if (!isEmail(email)) {
                if (msg) {
                    msg.style.color = '#ffdddd';
                    msg.textContent = '⚠ Please enter a valid email address.';
                }
                showToast('Please enter a valid email address.', 'error');
                if (emailInput) emailInput.focus();
                return;
            }

            setLoading(btn, true, 'Subscribing...');

            setTimeout(function () {
                setLoading(btn, false);

                if (msg) {
                    msg.style.color = '#ffffff';
                    msg.textContent = '✓ Subscription successful! Thank you for subscribing.';
                }

                showModal(
                    'Subscription Successful!',
                    'Thank you for subscribing! You will receive updates at <strong>' + email + '</strong>.',
                    '💌'
                );

                showToast('Subscription successful!', 'success');
                newsletterForm.reset();

                setTimeout(function () { if (msg) msg.textContent = ''; }, 6000);
            }, 900);
        });
    }

    /* ================================================================
       12. VOLUNTEER FORM
       → "Form submitted successfully!"
       ================================================================ */
    const volunteerForm = $('#volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name     = $('#name');
            const email    = $('#email');
            const phone    = $('#phone');
            const interest = $('#interest');
            const message  = $('#message');
            const response = $('#volunteerMessage');
            const btn      = volunteerForm.querySelector('button[type="submit"]');

            const ok = validateForm([
                { el: name,     check: isName,                                  msg: 'Please enter your full name (min 2 characters).' },
                { el: email,    check: isEmail,                                 msg: 'Please enter a valid email address.' },
                { el: phone,    check: isPhone,                                 msg: 'Please enter a valid phone number.' },
                { el: interest, check: function (v) { return v !== ''; },       msg: 'Please choose an area of interest.' },
                { el: message,  check: function (v) { return v.length >= 10; }, msg: 'Please tell us a bit more (min 10 characters).' }
            ]);

            if (!ok) {
                showToast('Please fix the highlighted fields.', 'error');
                return;
            }

            setLoading(btn, true, 'Submitting...');

            setTimeout(function () {
                setLoading(btn, false);

                const firstName = name.value.trim().split(' ')[0];

                if (response) {
                    response.className = 'form-message success';
                    response.textContent = '✓ Form submitted successfully! Thank you, ' + firstName +
                        '. Your volunteer application has been received. We will contact you within 48 hours.';
                }

                showModal(
                    'Form Submitted Successfully!',
                    'Thank you, <strong>' + firstName + '</strong>! Your application for <strong>' +
                    interest.value + '</strong> has been received. We will contact you at <strong>' +
                    email.value + '</strong> within 48 hours.',
                    '🎉'
                );

                showToast('Form submitted successfully!', 'success');

                try {
                    const apps = JSON.parse(localStorage.getItem('hh_volunteers') || '[]');
                    apps.push({
                        name: name.value,
                        email: email.value,
                        phone: phone.value,
                        interest: interest.value,
                        date: new Date().toISOString()
                    });
                    localStorage.setItem('hh_volunteers', JSON.stringify(apps));
                } catch (err) {}

                volunteerForm.reset();
                if (response) response.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1100);
        });
    }

    /* ================================================================
       13. CONTACT FORM
       → "Message successfully submitted!"
       ================================================================ */
    console.log('[Hope Hands] Looking for #contactForm...');
    const contactForm = $('#contactForm');

    if (!contactForm) {
        console.warn('[Hope Hands] Contact form (#contactForm) is cannot be found on this page.');
    } else {
        console.log('[Hope Hands] Contact form found ✓ — attaching submit handler.');

        // Prevent double-binding (in case script is loaded twice)
        if (!contactForm.dataset.hhBound) {
            contactForm.dataset.hhBound = 'true';

            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                console.log('[Hope Hands] Contact form submitted.');

                const name     = $('#contactName');
                const email    = $('#contactEmail');
                const subject  = $('#contactSubject');
                const message  = $('#contactMessage');
                const response = $('#contactResponse');
                const btn      = contactForm.querySelector('button[type="submit"]');

                // Safety check — make sure fields exist
                if (!name || !email || !subject || !message) {
                    console.error('[Hope Hands] Missing one or more contact fields. Check the HTML IDs.');
                    showToast('Form error. Please refresh the page.', 'error');
                    return;
                }

                const ok = validateForm([
                    { el: name,    check: isName,                                  msg: 'Please enter your full name (min 2 characters).' },
                    { el: email,   check: isEmail,                                 msg: 'Please enter a valid email address.' },
                    { el: subject, check: function (v) { return v.length >= 3; },  msg: 'Please enter a subject.' },
                    { el: message, check: function (v) { return v.length >= 10; }, msg: 'Please write a longer message (min 10 characters).' }
                ]);

                if (!ok) {
                    console.log('[Hope Hands] Validation failed.');
                    showToast('Please fix the highlighted fields.', 'error');
                    return;
                }

                console.log('[Hope Hands] Validation passed. Sending message...');
                setLoading(btn, true, 'Sending...');

                setTimeout(function () {
                    setLoading(btn, false);

                    const firstName = name.value.trim().split(' ')[0];
                    const emailVal = email.value.trim();
                    const subjectVal = subject.value.trim();

                    if (response) {
                        response.className = 'form-message success';
                        response.textContent = '✓ Message successfully submitted! Thank you, ' + firstName +
                            '. We will reply to ' + emailVal + ' shortly.';
                    }

                    showModal(
                        'Message Successfully Submitted!',
                        'Thank you, <strong>' + firstName + '</strong>! Your message about "<strong>' +
                        subjectVal + '</strong>" has been sent. We will reply to <strong>' +
                        emailVal + '</strong> as soon as possible.',
                        '📩'
                    );

                    showToast('Message successfully submitted!', 'success');

                    try {
                        const msgs = JSON.parse(localStorage.getItem('hh_messages') || '[]');
                        msgs.push({
                            name: name.value,
                            email: emailVal,
                            subject: subjectVal,
                            message: message.value,
                            date: new Date().toISOString()
                        });
                        localStorage.setItem('hh_messages', JSON.stringify(msgs));
                    } catch (err) {}

                    contactForm.reset();
                    if (response) response.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    console.log('[Hope Hands] Message sent successfully.');
                }, 1100);
            });
        }
    }

    /* ================================================================
       14. DONATION BUTTONS
       → "Donation complete. Thank you!"
       ================================================================ */
    window.donate = function (amount) {
        const msg = $('#donationMessage');
        const formatted = 'R' + Number(amount).toLocaleString('en-ZA');

        if (msg) {
            msg.style.color = '#39d353';
            msg.textContent = 'Processing your donation of ' + formatted + '...';
        }

        const allBtn = $$('.donation-buttons button');
        allBtn.forEach(function (b) { b.disabled = true; });

        setTimeout(function () {
            allBtn.forEach(function (b) { b.disabled = false; });

            if (msg) {
                msg.innerHTML = '✓ Donation complete. Thank you for donating <strong>' + formatted + '</strong>!';
                msg.style.color = '#39d353';
            }

            showModal(
                'Donation Complete!',
                'Thank you so much for your generous donation of <strong>' + formatted +
                '</strong>! Your support helps us provide food, education, and opportunities.',
                '❤️'
            );

            showToast('Donation complete. Thank you!', 'success');

            try {
                const history = JSON.parse(localStorage.getItem('hh_donations') || '[]');
                history.push({ amount: amount, formatted: formatted, date: new Date().toISOString() });
                localStorage.setItem('hh_donations', JSON.stringify(history));
            } catch (err) {}

            setTimeout(function () { if (msg) msg.innerHTML = ''; }, 8000);
        }, 1000);
    };

    /* ================================================================
       15. CUSTOM DONATION AMOUNT
       ================================================================ */
    const customDonateBtn = $('#customDonateBtn');
    const customDonateInput = $('#customDonateAmount');

    if (customDonateBtn && customDonateInput) {
        customDonateBtn.addEventListener('click', function () {
            const val = parseFloat(customDonateInput.value);
            if (isNaN(val) || val < 5) {
                showToast('Please enter an amount of at least R5.', 'error');
                customDonateInput.focus();
                return;
            }
            window.donate(val);
            customDonateInput.value = '';
        });
    }

    /* ================================================================
       16. data-action BUTTONS
       ================================================================ */
    $$('[data-action]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            const action = btn.dataset.action;

            const messages = {
                'become-volunteer': ['Ready to Volunteer?', 'You will now be taken to the volunteer form.', '🤝'],
                'volunteer-today':  ['Join Our Team', 'You will now be taken to the volunteer form.', '💚'],
                'donate-now':       ['Support Our Mission', 'Every rand creates real change!', '❤️'],
                'learn-more':       ['Learn More', 'Explore our programmes to find out more.', '📘'],
                'contact-us':       ['Contact Us', 'Please fill in our contact form.', '✉️'],
                'demo':             ['Feature Preview', 'This feature is coming soon.', '🔔']
            };

            const info = messages[action];
            if (!info) return;

            e.preventDefault();
            showModal(info[0], info[1], info[2]);
            showToast(info[0], 'info');

            const href = btn.getAttribute('href');
            if (href && (action === 'become-volunteer' || action === 'volunteer-today')) {
                setTimeout(function () { window.location.href = href; }, 1400);
            }
        });
    });

    /* ================================================================
       17. BUTTON PULSE EFFECT
       ================================================================ */
    $$('.btn, .donation-buttons button, button[type="submit"], button').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (btn.disabled) return;
            btn.animate(
                [
                    { transform: 'scale(1)' },
                    { transform: 'scale(0.96)' },
                    { transform: 'scale(1)' }
                ],
                { duration: 220, easing: 'ease-out' }
            );
        });
    });

    /* Website Search */
    (function () {
        const form = $('#siteSearchForm');
        const input = $('#siteSearchInput');
        const results = $('#searchResults');
        if (!form || !input || !results) return;

        const pages = [
            { title: 'Home', url: 'index.html', words: 'home hope hands community foundation welcome donate donation food relief education families youth development community outreach newsletter' },
            { title: 'About Us', url: 'about.html', words: 'about us mission vision values history foundation team who we are helping communities disadvantaged families' },
            { title: 'Programmes', url: 'programmes.html', words: 'programmes projects services education food relief youth development community outreach support' },
            { title: 'Volunteer', url: 'volunteer.html', words: 'volunteer join help get involved application sign up skills community contribute' },
            { title: 'Contact', url: 'contact.html', words: 'contact email phone address message enquiry get in touch questions' }
        ];

        function search() {
            const query = input.value.trim().toLowerCase();
            results.replaceChildren();

            if (!query) {
                results.classList.remove('show');
                return;
            }

            const terms = query.split(/\s+/).filter(Boolean);
            const matches = pages.filter(function (page) {
                const pageText = (page.title + ' ' + page.words).toLowerCase();
                return terms.every(function (term) { return pageText.includes(term); });
            });

            if (!matches.length) {
                const message = document.createElement('p');
                message.textContent = 'No matching pages found.';
                results.appendChild(message);
            } else {
                matches.forEach(function (page) {
                    const link = document.createElement('a');
                    link.href = page.url;
                    link.textContent = page.title;
                    results.appendChild(link);
                });
            }

            results.classList.add('show');
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            search();
        });
        input.addEventListener('input', search);
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                results.classList.remove('show');
                input.blur();
            }
        });
        document.addEventListener('click', function (event) {
            if (!form.contains(event.target)) results.classList.remove('show');
        });
    }());