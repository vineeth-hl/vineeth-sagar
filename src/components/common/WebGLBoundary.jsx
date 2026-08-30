import React from 'react';

/**
 * True if this browser can create a WebGL context. Cached after the first call.
 * A decorative 3D component should skip mounting entirely when this is false.
 */
let cached;
export function isWebGLAvailable() {
    if (cached !== undefined) return cached;
    if (typeof window !== 'undefined' && /[?&]nowebgl\b/.test(window.location.search)) {
        cached = false; // manual test override
        return cached;
    }
    if (typeof window === 'undefined' || !window.WebGLRenderingContext) {
        cached = false;
        return cached;
    }
    try {
        const canvas = document.createElement('canvas');
        const gl =
            canvas.getContext('webgl2') ||
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl');
        if (gl) {
            // don't hold the probe context against the browser's context limit
            gl.getExtension('WEBGL_lose_context')?.loseContext();
            cached = true;
        } else {
            cached = false;
        }
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
