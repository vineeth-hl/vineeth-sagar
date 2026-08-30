import React from 'react';

/**
 * Can this browser actually create a WebGL context? Tries once (result cached).
 * A truthy result means an R3F <Canvas> should succeed; a falsy one means the
 * 3D must not mount (its <Canvas> would throw "Error creating WebGL context"
 * and — without the boundary below — take the whole app down).
 *
 * The probe context is left for GC rather than force-lost; a single transient
 * context is well under any browser limit and avoids the driver quirks that
 * WEBGL_lose_context can trigger.
 *
 * `?nowebgl` in the URL forces the fallback (manual testing / support).
 */
let cached;
export function isWebGLAvailable() {
    if (typeof window === 'undefined') return false;
    if (/[?&]nowebgl\b/.test(window.location.search)) return false;
    if (cached !== undefined) return cached;
    if (!(window.WebGLRenderingContext || window.WebGL2RenderingContext)) {
        cached = false;
        return cached;
    }
    try {
        const c = document.createElement('canvas');
        cached = !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) {
        cached = false;
    }
    return cached;
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
