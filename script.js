/* =========================================================================
   PATEL KISHAN — PORTFOLIO SCRIPTS

     PART 1  — written by me (Patel Kishan). My original JavaScript.
     PART 2  — AI-assisted. Extras for the rebuilt sections.
   ========================================================================= */


/* =========================================================================
   PART 1 — WRITTEN BY PATEL KISHAN
   ========================================================================= */

// Theme Switching
function setTheme(theme) {
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.dataset.theme = prefersDark ? 'dark' : 'light';
    } else {
        document.body.dataset.theme = theme;
    }
    localStorage.setItem('theme', theme); // Save preference

    // [ADDED] show which button is currently active
    document.querySelectorAll('[data-theme-choice]').forEach(btn => {
        btn.setAttribute('aria-pressed', String(btn.dataset.themeChoice === theme));
    });
}

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// Smooth Scrolling
function scrollToSection(sectionId) {
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Add event listeners to nav links for smooth scroll
document.querySelectorAll('.sticky-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href');
        scrollToSection(sectionId);
    });
});

// Fade-in sections on scroll
const sections = document.querySelectorAll('.section');
const options = { threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, options);

sections.forEach(section => observer.observe(section));

// Contact Form Handler (using Formspree)
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default submission

        const formData = new FormData(form);
        const endpoint = form.getAttribute('action'); // Your Formspree URL

        // [ADDED] disable the button while the message is sending
        const button = form.querySelector('button[type="submit"]');
        const label = button.textContent;
        button.disabled = true;
        button.textContent = 'Sending…';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // Tell Formspree to respond with JSON
                }
            });

            if (response.ok) {
                showStatus('Message sent. I\u2019ll reply to the email you gave.', 'is-ok');
                form.reset(); // Clear the form
            } else {
                showStatus('The form didn\u2019t send. Email patelkishank07@gmail.com instead.', 'is-error');
            }
        } catch (error) {
            showStatus('No connection. Check your network and send again.', 'is-error');
        } finally {
            button.disabled = false;
            button.textContent = label;
        }
    });
}


/* =========================================================================
   PART 2 — AI-ASSISTED
   ========================================================================= */

// Tells the CSS that JavaScript is running, so the fade-in can hide
// sections. Without this a script error would leave the page blank.
document.documentElement.classList.add('js');

// Wire the three theme buttons to my setTheme() function above.
document.querySelectorAll('[data-theme-choice]').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.themeChoice));
});

// If "Auto" is selected, follow the system when it switches.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem('theme') || 'dark') === 'auto') setTheme('auto');
});

// Highlight the nav link for whichever section is on screen.
const navLinks = document.querySelectorAll('.sticky-nav ul a');
const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
    });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(section => spy.observe(section));

// Hero terminal: "run" the C program and type out its output.
const out = document.getElementById('terminal-out');
const OUTPUT = 'Patel Kishan, year 2';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (out) {
    if (reduceMotion) {
        out.textContent = OUTPUT;
        out.classList.add('done');
    } else {
        let i = 0;
        setTimeout(function type() {
            out.textContent = OUTPUT.slice(0, ++i);
            if (i < OUTPUT.length) {
                setTimeout(type, 55);
            } else {
                out.classList.add('done');
            }
        }, 900);
    }
}

// Show a "PK" monogram if IMAGES/PROFILE.jpeg can't be loaded.
const portrait = document.getElementById('portrait-img');
if (portrait) {
    portrait.addEventListener('error', () => {
        portrait.closest('.portrait').classList.add('no-photo');
    });
}

// Status message helper used by the form handler above.
function showStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.className = 'is-visible ' + kind;
}
