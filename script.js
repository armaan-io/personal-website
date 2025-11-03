/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelector('.page-links');

    menu.addEventListener('click', () => {
        menu.classList.toggle('is-active');
        links.classList.toggle('active');
    });
});

const discordLink = document.querySelector('.copy-discord');

discordLink.addEventListener('click', (e) => {
  e.preventDefault();
  const username = discordLink.getAttribute('data-username');
  navigator.clipboard.writeText(username);
  discordLink.textContent = 'Username Copied';
  setTimeout(() => {
    discordLink.textContent = `Discord ↗`;
  }, 1500);
});
