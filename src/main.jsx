import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import './index.css';

/*
 * On the `blogs.` subdomain the edge middleware rewrites `/` -> `/blog` (and
 * `/foo` -> `/blog/foo`) so the correct pre-rendered HTML is served. But the
 * browser URL still reads `/`, so react-router would hydrate the "/" route
 * (the portfolio) over that HTML. Mirror the middleware here BEFORE the router
 * is created so the client path matches what was served.
 */
if (typeof window !== 'undefined') {
    const { host, pathname, search, hash } = window.location;
    if (host.startsWith('blogs.') && !pathname.startsWith('/blog')) {
        const next = pathname === '/' ? '/blog' : `/blog${pathname}`;
        window.history.replaceState(null, '', next + search + hash);
    }
}

// Per-route <title> / <meta description> for the pre-rendered HTML is handled at
// build time in vite.config.js (ssgOptions.onPageRendered). Client-side route
// changes are kept in sync by the useTitle() hook in the blog pages.
export const createRoot = ViteReactSSG({ routes });
