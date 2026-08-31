import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Renders any `<pre class="mermaid">` blocks on the current post (produced by the
 * rehypeMermaid build step). mermaid is browser-only and heavy (~500KB), so it's
 * dynamically imported and only when a diagram is actually present. Re-runs on
 * client-side route changes. Renders nothing itself.
 */
export default function MermaidRenderer() {
    const { pathname } = useLocation();

    useEffect(() => {
        if (typeof document === 'undefined') return undefined;
        const nodes = Array.from(document.querySelectorAll('pre.mermaid:not([data-processed])'));
        if (nodes.length === 0) return undefined;

        let cancelled = false;
        (async () => {
            try {
                const { default: mermaid } = await import('mermaid');
                if (cancelled) return;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'dark',
                    securityLevel: 'loose', // allow <br/> in node labels (own content)
                    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                    themeVariables: {
                        background: 'transparent',
                        primaryColor: '#141414',
                        primaryBorderColor: '#2f6bff',
                        primaryTextColor: '#e6e6e6',
                        lineColor: '#5a5a5a',
                        secondaryColor: '#1c1c1c',
                        tertiaryColor: '#1c1c1c'
                    }
                });
                await mermaid.run({ nodes, suppressErrors: true });
            } catch {
                // leave the raw source visible if mermaid can't load/parse
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [pathname]);

    return null;
}
