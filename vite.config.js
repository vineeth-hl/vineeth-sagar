import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import { toString as mdastToString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import { parse as acornParse } from 'acorn';
import GithubSlugger from 'github-slugger';

// inject an ESM export into an MDX module from a source string
function injectEsm(tree, code) {
    tree.children.unshift({
        type: 'mdxjsEsm',
        value: code,
        data: { estree: acornParse(code, { ecmaVersion: 'latest', sourceType: 'module' }) }
    });
}

// remark plugin: inject `export const headings = [{ id, text, level }]` built
// from the h2/h3 headings, with slugs that match rehype-slug (github-slugger).
// Done at build time so the TOC has data without reading the DOM after render.
function remarkTocHeadings() {
    return (tree) => {
        const slugger = new GithubSlugger();
        const headings = [];
        visit(tree, 'heading', (node) => {
            if (node.depth < 2 || node.depth > 3) return;
            const text = mdastToString(node).trim();
            if (!text) return;
            headings.push({ id: slugger.slug(text), text, level: node.depth });
        });
        injectEsm(tree, `export const headings = ${JSON.stringify(headings)}`);
    };
}

// remark plugin: inject `export const readingMinutes = <n>` into each MDX module
function remarkReadingTime() {
    return (tree) => {
        const words = mdastToString(tree).trim().split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.round(words / 220));
        tree.children.unshift({
            type: 'mdxjsEsm',
            value: `export const readingMinutes = ${minutes}`,
            data: {
                estree: {
                    type: 'Program',
                    sourceType: 'module',
                    body: [
                        {
                            type: 'ExportNamedDeclaration',
                            specifiers: [],
                            source: null,
                            declaration: {
                                type: 'VariableDeclaration',
                                kind: 'const',
                                declarations: [
                                    {
                                        type: 'VariableDeclarator',
                                        id: { type: 'Identifier', name: 'readingMinutes' },
                                        init: { type: 'Literal', value: minutes }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        });
    };
}

// ---- build-time per-route <title> / <meta> for the pre-rendered pages ----
// vite-react-ssg's onPageRendered / includedRoutes are BUILD options and must
// live here (ssgOptions), not in the client entry. We read the MDX frontmatter
// straight off disk so this stays independent of the app bundle.
const CONTENT_DIR = fileURLToPath(new URL('./src/blog/content', import.meta.url));

function readPosts() {
    let files = [];
    try {
        files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
    } catch {
        return [];
    }
    return files.map((file) => {
        const slug = file.replace(/\.mdx$/, '');
        const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
        const fm = raw.match(/^---\s*[\r\n]([\s\S]*?)[\r\n]---/);
        const get = (key) => {
            if (!fm) return '';
            const m = fm[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
            if (!m) return '';
            return m[1].trim().replace(/^["']|["']$/g, '');
        };
        return { slug, title: get('title'), description: get('description') };
    });
}

const DEFAULT_DESC =
    'Vineeth Sagar H L — AI/ML undergraduate. Projects across cybersecurity AI, agentic systems and RAG pipelines.';
const escHtml = (s = '') =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function metaFor(route) {
    if (route === '/blog') {
        return {
            title: 'Writing — Vineeth Sagar H L',
            desc: 'Technical deep dives on AI/ML systems — RAG pipelines, temporal graph models, explainable AI — by Vineeth Sagar H L.'
        };
    }
    const m = route.match(/^\/blog\/(.+?)\/?$/);
    if (m) {
        const post = readPosts().find((p) => p.slug === m[1]);
        if (post) return { title: `${post.title} — Vineeth Sagar H L`, desc: post.description || DEFAULT_DESC };
    }
    return { title: 'Vineeth Sagar H L | Portfolio', desc: DEFAULT_DESC };
}

// https://vite.dev/config/
export default defineConfig({
    ssgOptions: {
        includedRoutes() {
            return ['/', '/blog', ...readPosts().map((p) => `/blog/${p.slug}`)];
        },
        onPageRendered(route, html) {
            const { title, desc } = metaFor(route);
            return html
                .replace(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(title)}</title>`)
                .replace(
                    /<meta name="description"[^>]*>/,
                    `<meta name="description" content="${escHtml(desc)}" />` +
                        `<meta property="og:title" content="${escHtml(title)}" />` +
                        `<meta property="og:description" content="${escHtml(desc)}" />`
                );
        }
    },
    plugins: [
        {
            enforce: 'pre',
            ...mdx({
                remarkPlugins: [
                    remarkFrontmatter,
                    [remarkMdxFrontmatter, { name: 'frontmatter' }],
                    remarkGfm,
                    remarkMath,
                    remarkReadingTime,
                    remarkTocHeadings
                ],
                rehypePlugins: [
                    rehypeSlug,
                    [rehypeHighlight, { detect: true, ignoreMissing: true }],
                    [rehypeKatex, { strict: false }]
                ],
                providerImportSource: '@mdx-js/react'
            })
        },
        react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ })
    ],
    ssr: {
        // bundle these for SSR so their CJS default exports interop correctly
        noExternal: ['react-icons', 'react-countup', '@mdx-js/react', 'framer-motion']
    }
});
