import React from 'react';

/* Custom components usable directly inside .mdx files */

export function Callout({ type = 'note', title, children }) {
    const tones = {
        note: { border: 'rgb(var(--accent) / 0.45)', bg: 'rgb(var(--accent) / 0.07)' },
        warn: { border: 'rgba(251, 191, 36, 0.45)', bg: 'rgba(251, 191, 36, 0.07)' },
        tip: { border: 'rgba(52, 211, 153, 0.45)', bg: 'rgba(52, 211, 153, 0.07)' }
    };
    const t = tones[type] || tones.note;
    return (
        <div
            className="my-6 rounded-lg border px-4 py-3 text-[0.95em]"
            style={{ borderColor: t.border, background: t.bg }}
        >
            {title && <p className="mb-1 font-semibold text-primary">{title}</p>}
            <div className="text-secondary [&>p]:my-1">{children}</div>
        </div>
    );
}

export function Figure({ src, alt, caption }) {
    return (
        <figure className="my-8">
            <img src={src} alt={alt || ''} className="w-full rounded-lg border border-line" loading="lazy" />
            {caption && <figcaption className="mt-2 text-center text-xs text-secondary">{caption}</figcaption>}
        </figure>
    );
}

/* Overrides applied to raw markdown elements via <MDXProvider> */
const A = ({ href = '', children, ...rest }) => {
    const external = /^https?:\/\//.test(href);
    return (
        <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
            {children}
        </a>
    );
};

export const mdxComponents = {
    a: A,
    Callout,
    Figure
};
