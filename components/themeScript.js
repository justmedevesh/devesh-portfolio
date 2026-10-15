export const THEME_KEY = 'dkm-theme';

/**
 * Runs in <head> before first paint so the saved theme never flashes.
 * Dark is the default; only an explicit "light" choice switches it.
 */
export const themeInitScript = `try{document.documentElement.dataset.theme=localStorage.getItem('${THEME_KEY}')==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;
