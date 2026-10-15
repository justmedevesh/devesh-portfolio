import { useCallback, useEffect, useState } from 'react';
import { THEME_KEY } from './themeScript';

const read = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

/** Current theme + toggle. Every instance stays in sync via the `dkm:theme` event. */
export function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(read());
    const sync = () => setTheme(read());
    window.addEventListener('dkm:theme', sync);
    return () => window.removeEventListener('dkm:theme', sync);
  }, []);

  const toggle = useCallback(() => {
    const next = read() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    window.dispatchEvent(new Event('dkm:theme'));
  }, []);

  return { theme, toggle };
}
