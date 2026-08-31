// compiled MDX modules — each exposes:
//   default        -> the React component
//   frontmatter    -> parsed YAML frontmatter (via remark-mdx-frontmatter)
//   readingMinutes -> word-count estimate (via the remarkReadingTime plugin)
//   headings       -> [{ id, text, level }] for the TOC (via remarkTocHeadings)
const modules = import.meta.glob('./content/*.mdx', { eager: true });

const slugOf = (path) => path.split('/').pop().replace(/\.mdx$/, '');

export const posts = Object.entries(modules)
    .map(([path, mod]) => {
        const fm = mod.frontmatter || {};
        return {
            slug: slugOf(path),
            Component: mod.default,
            title: fm.title || slugOf(path),
            description: fm.description || '',
            date: fm.date || '',
            tags: Array.isArray(fm.tags) ? fm.tags : [],
            thumbnail: fm.thumbnail || null,
            reportUrl: fm.reportUrl || null,
            readingMinutes: mod.readingMinutes || 1,
            headings: Array.isArray(mod.headings) ? mod.headings : []
        };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getAllPosts = () => posts;
export const getPost = (slug) => posts.find((p) => p.slug === slug);
export const getAllSlugs = () => posts.map((p) => p.slug);
