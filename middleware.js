import { rewrite, next } from '@vercel/edge';

/*
 * Serves the blog at the apex of the `blogs.` subdomain.
 *   blogs.vineethsagar.co.in/            -> /blog
 *   blogs.vineethsagar.co.in/<slug>      -> /blog/<slug>
 * The main domain is untouched (blog stays reachable at /blog there too).
 * Static assets and already-/blog-prefixed paths are excluded by the matcher/guard.
 */

export const config = {
    matcher: ['/((?!assets/|reports/|.*\\.[\\w]+$).*)']
};

export default function middleware(request) {
    const host = (request.headers.get('host') || '').toLowerCase();
    const url = new URL(request.url);

    const isBlogHost = host.startsWith('blogs.');
    if (isBlogHost && !url.pathname.startsWith('/blog')) {
        url.pathname = url.pathname === '/' ? '/blog' : `/blog${url.pathname}`;
        return rewrite(url);
    }
    return next();
}
