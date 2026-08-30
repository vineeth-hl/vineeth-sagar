import React from 'react';

/**
 * Cheap feature-detect: is WebGL even a thing in this browser? This does NOT
 * create a probe context (which could interfere with the real R3F <Canvas> or
 * hit a context limit) — it only checks the API exists. The real "can it
 * actually render" question is answered by letting the <Canvas> mount and
 * catching failure in <WebGLBoundary>.
 *
 * `?nowebgl` in the URL forces the fallback path (manual testing / support).
 */
export function isWebGLAvailable() {
    if (typeof window === 'undefined') return false;
    if (/[?&]nowebgl\b/.test(window.location.search)) return false;
    return !!(window.WebGLRenderingContext || window.WebGL2RenderingContext);
}

/**
 * Catches render-time errors from an optional 3D subtree (e.g. R3F <Canvas>
 * failing to create a WebGL context, or a lost context on mount) and shows
 * `fallback` instead of letting the whole app hit its error boundary.
 */
export default class WebGLBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { failed: false };
    }

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error) {
        if (typeof console !== 'undefined') {
            // eslint-disable-next-line no-console
            console.warn('[WebGLBoundary] 3D content unavailable, showing fallback:', error?.message || error);
        }
        this.props.onError?.(error);
    }

    render() {
        if (this.state.failed) return this.props.fallback ?? null;
        return this.props.children;
    }
}
