import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { getPost } from './posts';
import { mdxComponents } from './mdx-components';
import DownloadButton from './DownloadButton';
import TableOfContents from './TableOfContents';
import useTitle from './useTitle';

export default function BlogPost() {
    const { slug } = useParams();
    const post = getPost(slug);

    useTitle(post && `${post.title} — Vineeth Sagar H L`, post?.description);

    if (!post) return <Navigate to="/blog" replace />;

    const { Component } = post;

    return (
        <>
            <TableOfContents headings={post.headings} />

            <article className="mx-auto max-w-[46rem] px-5 pb-12 pt-14 md:pb-24">
                <Link to="/blog" className="text-xs font-medium uppercase tracking-[0.25em] text-secondary hover:text-primary">
                    &larr; All posts
                </Link>

                <header className="mt-6 mb-10 border-b border-line pb-8">
                    <div className="mb-4 flex flex-wrap gap-1.5">
                        {post.tags.map((t) => (
                            <span
                                key={t}
                                className="rounded border border-line bg-card px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-blue"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl font-extrabold normal-case leading-tight tracking-tight text-primary md:text-[2.6rem]">
                        {post.title}
                    </h1>
                    <div className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-wider text-secondary">
                        {post.date && (
                            <span>
                                {new Date(post.date).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        )}
                        {post.date && <span className="text-line">·</span>}
                        <span>{post.readingMinutes} min read</span>
                    </div>
                </header>

                <div
                    id="post-content"
                    className="prose prose-invert max-w-none
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-primary
                        prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-xl
                        prose-p:text-secondary prose-p:leading-[1.8]
                        prose-a:text-accent-blue prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-primary
                        prose-code:rounded prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:text-primary prose-code:before:content-[''] prose-code:after:content-['']
                        prose-pre:border prose-pre:border-line prose-pre:bg-[#0b0b0d] prose-pre:text-[0.86em]
                        prose-blockquote:border-l-accent-blue prose-blockquote:text-secondary prose-blockquote:not-italic
                        prose-li:text-secondary prose-li:marker:text-line
                        prose-hr:border-line
                        prose-img:rounded-lg prose-img:border prose-img:border-line
                        prose-table:text-sm prose-th:text-primary prose-td:border-line"
                >
                    <MDXProvider components={mdxComponents}>
                        <Component />
                    </MDXProvider>
                </div>
            </article>

            <DownloadButton downloads={post.downloads} />
        </>
    );
}
