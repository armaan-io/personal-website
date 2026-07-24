/* script.js */

const siteContent = {
    interests: ['physics', 'code', 'photography', 'guitar', 'cars', 'astronomy', 'writing', 'learning'],
};

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelector('.page-links');
    const nameSwitch = document.querySelector('.name-switch');
    const heroCarouselList = document.querySelector('.hero-carousel-list');
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

    if (heroCarouselList) {
        const copies = 3;
        let scrollPosition = siteContent.interests.length + 2;

        heroCarouselList.innerHTML = Array.from(
            { length: siteContent.interests.length * copies },
            (_, virtualIndex) => `<li class="hero-carousel-item"><span>${siteContent.interests[virtualIndex % siteContent.interests.length]}</span></li>`,
        ).join('');

        const carouselItems = [...heroCarouselList.querySelectorAll('.hero-carousel-item')];
        const updateCarousel = () => {
            carouselItems.forEach((item, index) => {
                const offset = index - scrollPosition;
                const distance = Math.abs(offset);
                item.style.setProperty('--carousel-offset', offset.toFixed(3));
                item.style.setProperty('--carousel-distance', distance.toFixed(3));
                item.style.setProperty('--carousel-z-index', Math.round(20 - distance));
            });
        };

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        let lastTimestamp;
        const animateCarousel = (timestamp) => {
            if (lastTimestamp === undefined) lastTimestamp = timestamp;
            const elapsedSeconds = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;
            scrollPosition += elapsedSeconds * 0.34;
            if (scrollPosition >= siteContent.interests.length * 2) {
                scrollPosition -= siteContent.interests.length;
            }
            updateCarousel();
            window.requestAnimationFrame(animateCarousel);
        };

        updateCarousel();
        if (!motionQuery.matches) window.requestAnimationFrame(animateCarousel);
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
