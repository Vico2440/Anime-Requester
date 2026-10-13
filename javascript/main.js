

import { initForms } from './formulaire.js';

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = themeToggle.querySelector('.theme-toggle-label');
    const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
    const savedTheme = localStorage.getItem('anime-requester-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const setTheme = (theme) => {
        const isDark = theme === 'dark';
        document.documentElement.dataset.theme = theme;
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeLabel.textContent = isDark ? 'Activer le mode clair' : 'Activer le mode sombre';
        themeIcon.textContent = isDark ? '☀' : '☾';
    };

    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('anime-requester-theme', theme);
        setTheme(theme);
    });

    initForms();
});