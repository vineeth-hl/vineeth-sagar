import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

/* Shared chrome for every /blog page — dark, minimal, matches the portfolio. */
export default function BlogLayout() {
    return (
        <div className="min-h-screen bg-background font-sans text-primary antialiased">
            <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
                    >
                        <FaArrowLeft size={11} />
                        Vineeth Sagar
                    </Link>
                    <Link to="/blog" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                        Writing
                    </Link>
                </div>
            </header>

            <Outlet />

            <footer className="mt-24 border-t border-line">
                <div className="mx-auto max-w-5xl px-5 py-10 text-xs text-secondary">
                    &copy; {new Date().getFullYear()} Vineeth Sagar H L ·{' '}
                    <Link to="/" className="text-accent-blue hover:underline">
                        vineethsagar.co.in
                    </Link>
                </div>
            </footer>
        </div>
    );
}
