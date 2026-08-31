import React from 'react';
import { Link } from 'react-router-dom';
import { FaThumbtack } from 'react-icons/fa6';

/* deterministic gradient fallback when a post has no thumbnail */
function hashHue(str) {
    let h = 0;
    for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) % 360;
    return h;
}

export default function BlogPostCard({ post }) {
    const hue = hashHue(post.slug);
    return (
        <Link
            to={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent-blue/50 hover:shadow-[0_0_36px_-10px_rgb(var(--accent))]"
        >
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line">
                {post.thumbnail ? (
                    <img
                        src={post.thumbnail}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover grayscale-[30%] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div
                        className="h-full w-full"
                        style={{
                            background: `radial-gradient(120% 120% at 15% 0%, hsl(${hue} 70% 20%), #0d0d0d 70%)`
                        }}
                    />
                )}
                {post.pinned != null && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-accent-blue/50 bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-blue backdrop-blur">
                        <FaThumbtack className="text-[9px]" />
                        Pinned
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((t) => (
                        <span
                            key={t}
                            className="rounded border border-line bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-blue"
                        >
                            {t}
                        </span>
                    ))}
                </div>

                <h3 className="text-base font-bold leading-snug text-primary transition-colors group-hover:text-accent-blue">
                    {post.title}
                </h3>

                {post.description && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-secondary">{post.description}</p>
                )}

                <div className="mt-auto flex items-center gap-2 pt-2 text-[11px] uppercase tracking-wider text-secondary">
                    {post.date && <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
                    {post.date && <span className="text-line">·</span>}
                    <span>{post.readingMinutes} min read</span>
                </div>
            </div>
        </Link>
    );
}
