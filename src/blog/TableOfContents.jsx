import React, { useEffect, useState } from 'react';

/**
 * "ON THIS PAGE" rail. `headings` ([{ id, text, level }]) is produced at build
 * time by the remarkTocHeadings plugin, with slugs that match rehype-slug — so
 * no DOM scraping is needed. An IntersectionObserver band just below the sticky
 * header tracks the section in view; clicks smooth-scroll. Desktop-only (xl+).
 */
export default function TableOfContents({ headings = [] }) {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        if (headings.length === 0) return undefined;
        const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
        if (els.length === 0) return undefined;
        const visible = new Set();

        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) visible.add(e.target.id);
                    else visible.delete(e.target.id);
                }
                if (visible.size > 0) {
                    const topmost = els.find((el) => visible.has(el.id));
                    if (topmost) setActiveId(topmost.id);
                    return;
                }
                // nothing in the band: use the last heading scrolled past
                let passed = '';
                for (const el of els) {
                    if (el.getBoundingClientRect().top < 140) passed = el.id;
                    else break;
                }
                if (passed) setActiveId(passed);
            },
            { rootMargin: '-96px 0px -80% 0px', threshold: 0 }
        );

        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [headings]);

    const handleClick = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        setActiveId(id);
        const top = el.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top, behavior: 'smooth' });
        window.history.replaceState(null, '', `#${id}`);
    };

    if (headings.length < 3) return null; // not worth a rail for a short post

    return (
        <nav
            aria-label="On this page"
            className="fixed left-[max(1.5rem,calc((100vw-46rem)/2-16rem))] top-24 hidden max-h-[calc(100vh-8rem)] w-56 overflow-y-auto xl:block"
        >
            <p className="mb-3 border-b border-line pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
                On this page
            </p>
            <ul className="border-l border-line">
                {headings.map((h) => {
                    const active = h.id === activeId;
                    return (
                        <li key={h.id}>
                            <a
                                href={`#${h.id}`}
                                onClick={(e) => handleClick(e, h.id)}
                                className={[
                                    '-ml-px block border-l-2 py-1 pr-2 text-[13px] leading-snug transition-colors',
                                    h.level === 3 ? 'pl-6' : 'pl-3',
                                    active
                                        ? 'border-accent-blue font-medium text-primary'
                                        : 'border-transparent text-secondary hover:text-primary'
                                ].join(' ')}
                            >
                                {h.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
