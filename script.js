/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelector('.page-links');
    const nameSwitch = document.querySelector('.name-switch');
    const punjabClock = document.getElementById('punjab-clock');
    const themeToggle = document.querySelector('.theme-toggle');

    if (themeToggle) {
        const root = document.documentElement;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

        const isDarkTheme = () => root.dataset.theme
            ? root.dataset.theme === 'dark'
            : systemTheme.matches;
        const updateThemeToggle = () => {
            const isDark = isDarkTheme();
            themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
            themeToggle.setAttribute('aria-pressed', isDark.toString());
        };

        themeToggle.addEventListener('click', () => {
            root.dataset.theme = isDarkTheme() ? 'light' : 'dark';
            try {
                localStorage.setItem('theme', root.dataset.theme);
            } catch {
                // The applied theme still works when persistence is unavailable.
            }
            updateThemeToggle();
        });

        systemTheme.addEventListener('change', () => {
            if (!root.dataset.theme) updateThemeToggle();
        });
        updateThemeToggle();
    }

    if (menu && links) {
        menu.addEventListener('click', () => {
            menu.classList.toggle('is-active');
            const isOpen = links.classList.toggle('active');
            menu.setAttribute('aria-expanded', isOpen.toString());
            menu.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });

        links.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                menu.classList.remove('is-active');
                links.classList.remove('active');
                menu.setAttribute('aria-expanded', 'false');
                menu.setAttribute('aria-label', 'Open navigation menu');
            });
        });
    }

    if (punjabClock) {
        const formatter = new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        const updatePunjabClock = () => {
            punjabClock.textContent = `${formatter.format(new Date())} IST`;
        };

        updatePunjabClock();
        window.setInterval(updatePunjabClock, 1000);
    }

    if (nameSwitch) {
        const mobileQuery = window.matchMedia('(max-width: 768px)');
        let ticking = false;

        const setNameProgress = () => {
            const progress = mobileQuery.matches
                ? Math.min(Math.max(window.scrollY / (window.innerHeight * 0.65), 0), 1)
                : 0;

            nameSwitch.style.setProperty('--name-eng-clip', `inset(0 ${100 - progress * 100}% 0 0)`);
            nameSwitch.style.setProperty('--name-pbi-clip', `inset(0 0 0 ${progress * 100}%)`);
            ticking = false;
        };

        const requestNameProgress = () => {
            if (!ticking) {
                window.requestAnimationFrame(setNameProgress);
                ticking = true;
            }
        };

        setNameProgress();
        window.addEventListener('scroll', requestNameProgress, { passive: true });
        window.addEventListener('resize', requestNameProgress);
        mobileQuery.addEventListener('change', setNameProgress);
    }
});

const discordLink = document.querySelector('.copy-discord');

if (discordLink) {
    discordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const username = discordLink.getAttribute('data-username');
        if (!username) return;

        navigator.clipboard.writeText(username);
        discordLink.textContent = 'Username Copied';
        setTimeout(() => {
            discordLink.textContent = `Discord ↗`;
        }, 1500);
    });
}
