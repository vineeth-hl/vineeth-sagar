import { useEffect, useState } from 'react';

/**
 * True once the intro <Preloader /> begins its exit (or immediately if there is
 * no preloader / reduced motion). Hero + Navbar hold their entrance animations
 * until this flips, so the reveal shows the site animating in fresh rather than
 * a half-finished frame.
 */
export default function usePreloaderReady() {
    const [ready, setReady] = useState(() => typeof window !== 'undefined' && !!window.__preloaderDone);

    useEffect(() => {
        if (ready) return undefined;
        const on = () => setReady(true);
        window.addEventListener('preloader:done', on);
        // hard fallback so entrances never get stuck if the preloader errors
        const fb = setTimeout(() => setReady(true), 8000);
        return () => {
            window.removeEventListener('preloader:done', on);
            clearTimeout(fb);
        };
    }, [ready]);

    return ready;
}
