import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

// On the blogs. subdomain, "/" is rewritten back to the blog, so links to the
// portfolio have to be absolute to the main site. On the main domain a plain
// client-side link is fine.
const PORTFOLIO_URL =
    typeof window !== 'undefined' && window.location.host.startsWith('blogs.')
        ? `${window.location.protocol}//${window.location.host.replace(/^blogs\./, '')}/`
        : '/';

/* Shared chrome for every /blog page — dark, minimal, matches the portfolio. */
export default function BlogLayout() {
    const external = PORTFOLIO_URL !== '/';
    const homeProps = external ? { href: PORTFOLIO_URL } : { to: '/' };
    const Home = external ? 'a' : Link;

    return (
        <div className="min-h-screen bg-background font-sans text-primary antialiased">
            <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
                    <Home
                        {...homeProps}
                        className="flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
                    >
                        <FaArrowLeft size={11} />
                        Vineeth Sagar
                    </Home>
                    <Link to="/blog" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                        Writing
                    </Link>
                </div>
            </header>

            <Outlet />

            <footer className="mt-24 border-t border-line">
                <div className="mx-auto max-w-5xl px-5 py-10 text-xs text-secondary">
                    &copy; {new Date().getFullYear()} Vineeth Sagar H L ·{' '}
                    <Home {...homeProps} className="text-accent-blue hover:underline">
                        vineethsagar.co.in
                    </Home>
                </div>
            </footer>
        </div>
    );
}
