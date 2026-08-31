import { useEffect } from 'react';

/*
 * Client-side <title> / <meta description> for SPA navigation. The pre-rendered
 * HTML already has the right tags (set in main.jsx onPageRendered); this keeps
 * them in sync when the user navigates between routes without a full reload.
 */
export default function useTitle(title, description) {
    useEffect(() => {
        if (typeof document === 'undefined') return;
        if (title) document.title = title;
        if (description) {
            let m = document.querySelector('meta[name="description"]');
            if (!m) {
                m = document.createElement('meta');
                m.setAttribute('name', 'description');
                document.head.appendChild(m);
            }
            m.setAttribute('content', description);
        }
    }, [title, description]);
}
