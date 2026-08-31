import React from 'react';
import RootLayout from './RootLayout';
import Portfolio from './portfolio/Portfolio';
import BlogLayout from './blog/BlogLayout';
import BlogIndex from './blog/BlogIndex';
import BlogPost from './blog/BlogPost';
import { getAllSlugs } from './blog/posts';

export const routes = [
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <Portfolio /> },
            {
                path: 'blog',
                element: <BlogLayout />,
                children: [
                    { index: true, element: <BlogIndex /> },
                    {
                        path: ':slug',
                        element: <BlogPost />,
                        // pre-render one HTML page per post
                        getStaticPaths: () => getAllSlugs()
                    }
                ]
            }
        ]
    }
];
