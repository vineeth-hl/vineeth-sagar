import React from 'react';
import { FaFilePdf, FaArrowDown } from 'react-icons/fa';

/*
 * Sticky PDF-download affordance for a blog post.
 *   desktop (md+): a card pinned to the right edge, vertically centred, with one
 *                  pill per download
 *   mobile:        a bar fixed to the bottom of the viewport, downloads split
 *                  evenly across it
 *
 * Accepts `downloads` — an array of { label, url }. Renders nothing when empty.
 */
export default function DownloadButton({ downloads = [] }) {
    const items = downloads.filter((d) => d && d.url);
    if (items.length === 0) return null;

    const fileNameOf = (url) => {
        try {
            return decodeURIComponent(url.split('/').pop() || '') || 'download.pdf';
        } catch {
            return url.split('/').pop() || 'download.pdf';
        }
    };

    return (
        <>
            {/* desktop */}
            <div className="fixed right-5 top-1/2 z-50 hidden w-[210px] -translate-y-1/2 flex-col gap-1.5 rounded-2xl border border-accent-blue/40 bg-card/90 p-2 shadow-[0_0_40px_-12px_rgb(var(--accent))] backdrop-blur md:flex">
                <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
                    Downloads
                </p>
                {items.map((d) => (
                    <a
                        key={d.url}
                        href={d.url}
                        download={fileNameOf(d.url)}
                        className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-accent-blue hover:text-white"
                    >
                        <FaFilePdf className="shrink-0 text-accent-blue transition-colors group-hover:text-white" />
                        <span className="leading-tight">{d.label}</span>
                    </a>
                ))}
            </div>

            {/* mobile */}
            <div className="fixed inset-x-0 bottom-0 z-50 flex divide-x divide-accent-blue/25 border-t border-accent-blue/40 bg-card/95 backdrop-blur md:hidden">
                {items.map((d) => (
                    <a
                        key={d.url}
                        href={d.url}
                        download={fileNameOf(d.url)}
                        className="flex flex-1 items-center justify-center gap-2 px-3 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-primary"
                    >
                        <FaArrowDown className="shrink-0 text-accent-blue" />
                        {d.label}
                    </a>
                ))}
            </div>
        </>
    );
}
