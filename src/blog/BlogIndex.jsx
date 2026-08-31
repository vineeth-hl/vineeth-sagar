import React from 'react';
import { getAllPosts } from './posts';
import BlogPostCard from './BlogPostCard';
import useTitle from './useTitle';

export default function BlogIndex() {
    const posts = getAllPosts();
    useTitle(
        'Writing — Vineeth Sagar H L',
        'Technical deep dives on AI/ML systems — RAG pipelines, temporal graph models, explainable AI — by Vineeth Sagar H L.'
    );

    return (
        <main className="mx-auto max-w-5xl px-5 pb-8 pt-16">

            <header className="mb-14 max-w-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-accent-blue">Writing</p>
                <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
                    Notes on AI/ML &amp; full-stack engineering
                </h1>
                <p className="mt-4 text-base leading-relaxed text-secondary">
                    Deep dives on the systems I build — RAG pipelines, temporal graph models, explainable AI, and the
                    infrastructure around them. Each post links its full technical report.
                </p>
            </header>

            {posts.length === 0 ? (
                <p className="text-secondary">No posts yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <BlogPostCard key={post.slug} post={post} />
                    ))}
                </div>
            )}
        </main>
    );
}
