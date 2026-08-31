// compiled MDX modules — each exposes:
//   default        -> the React component
//   frontmatter    -> parsed YAML frontmatter (via remark-mdx-frontmatter)
//   readingMinutes -> word-count estimate (via the remarkReadingTime plugin)
//   headings       -> [{ id, text, level }] for the TOC (via remarkTocHeadings)
const modules = import.meta.glob('./content/*.mdx', { eager: true });

// `pinned` in frontmatter: a number is an explicit rank (1 = first); `true`
// pins after the numbered ones; anything else is unpinned.
const pinRank = (v) => (typeof v === 'number' ? v : v === true ? Number.MAX_SAFE_INTEGER : null);

const slugOf = (path) => path.split('/').pop().replace(/\.mdx$/, '');

// Normalise download links: prefer a `downloads: [{ label, url }]` list in
// frontmatter; fall back to a single `reportUrl`.
function downloadsOf(fm) {
    // encodeURI keeps "/" but turns spaces etc. into a valid href
    const enc = (u) => (/%[0-9a-f]{2}/i.test(u) ? u : encodeURI(u));
    if (Array.isArray(fm.downloads)) {
        return fm.downloads
            .filter((d) => d && d.url)
            .map((d) => ({ label: d.label || 'Download', url: enc(d.url) }));
    }
    if (fm.reportUrl) return [{ label: 'Project Report', url: enc(fm.reportUrl) }];
    return [];
}

export const posts = Object.entries(modules)
    .map(([path, mod]) => {
        const fm = mod.frontmatter || {};
        const downloads = downloadsOf(fm);
        return {
            slug: slugOf(path),
            Component: mod.default,
            title: fm.title || slugOf(path),
            description: fm.description || '',
            date: fm.date || '',
            tags: Array.isArray(fm.tags) ? fm.tags : [],
            thumbnail: fm.thumbnail || null,
            downloads,
            reportUrl: downloads.find((d) => /\.pdf(\?|#|$)/i.test(d.url))?.url || downloads[0]?.url || null,
            pinned: pinRank(fm.pinned),
            readingMinutes: mod.readingMinutes || 1,
            headings: Array.isArray(mod.headings) ? mod.headings : []
        };
    })
    .sort((a, b) => {
        // pinned posts first (by rank), then the rest newest-first
        if (a.pinned != null && b.pinned != null) return a.pinned - b.pinned;
        if (a.pinned != null) return -1;
        if (b.pinned != null) return 1;
        return a.date < b.date ? 1 : -1;
    });

export const getAllPosts = () => posts;
export const getPost = (slug) => posts.find((p) => p.slug === slug);
export const getAllSlugs = () => posts.map((p) => p.slug);
