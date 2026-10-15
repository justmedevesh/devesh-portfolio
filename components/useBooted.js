import { useEffect, useState } from 'react';

/**
 * True once the BootLoader intro has finished (or was skipped), so the hero
 * can start its entrance animation instead of playing it under the overlay.
 */
export function useBooted() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (window.__dkmBooted) {
      setBooted(true);
      return;
    }
    const done = () => setBooted(true);
    window.addEventListener('dkm:booted', done);
    // Safety net in case the loader never mounts
    const t = setTimeout(done, 4000);
    return () => {
      window.removeEventListener('dkm:booted', done);
      clearTimeout(t);
    };
  }, []);

  return booted;
}
