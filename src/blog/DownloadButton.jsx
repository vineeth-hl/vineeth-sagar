import React from 'react';
import { FaFilePdf, FaArrowDown } from 'react-icons/fa';

/*
 * Sticky "Download Project Report (PDF)" affordance.
 *   desktop (md+): a pill anchored to the right edge, vertically centred
 *   mobile:        a full-width bar fixed to the bottom of the viewport
 * Renders nothing when the post has no `reportUrl`.
 */
export default function DownloadButton({ url, label = 'Download Project Report' }) {
    if (!url) return null;
    const fileName = url.split('/').pop() || 'report.pdf';

    return (
        <>
            {/* desktop */}
            <a
                href={url}
                download={fileName}
                className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 items-center gap-2.5 rounded-full border border-accent-blue/50 bg-card/90 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-primary shadow-[0_0_40px_-12px_rgb(var(--accent))] backdrop-blur transition-colors hover:border-accent-blue hover:bg-accent-blue hover:text-white md:inline-flex"
            >
                <FaFilePdf className="text-accent-blue transition-colors group-hover:text-white" />
                <span className="max-w-[140px] leading-tight">{label}</span>
            </a>

            {/* mobile */}
            <a
                href={url}
                download={fileName}
                className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 border-t border-accent-blue/40 bg-card/95 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur md:hidden"
            >
                <FaArrowDown className="text-accent-blue" />
                {label} (PDF)
            </a>
        </>
    );
}
