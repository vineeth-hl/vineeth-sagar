import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import WebGLBoundary, { isWebGLAvailable } from '../common/WebGLBoundary';

const Lanyard = lazy(() => import('./Lanyard'));

/**
 * About-section wrapper around the 3D Lanyard badge.
 *
 * The 3D component pulls in @react-three/rapier (Rapier WASM) + meshline, so it's
 * code-split and only mounts once the badge scrolls into view. Reduced-motion
 * users, browsers without WebGL, or a scene error all fall back to a plain
 * framed photo instead of crashing.
 */
const LanyardCard = ({ photo }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    const [reduced, setReduced] = useState(false);
    // Assume WebGL is available for the first (hydration) render so the
    // pre-rendered markup matches; downgrade to the static photo in an effect
    // only if the probe actually fails. Deciding this during render would make
    // SSG emit the fallback and then mismatch on the client.
    const [noWebGL, setNoWebGL] = useState(false);

    useEffect(() => {
        setReduced(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
        if (!isWebGLAvailable()) setNoWebGL(true);
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), {
            rootMargin: '200px 0px'
        });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const staticPhoto = (
        <img
            src={photo}
            alt="Vineeth Sagar H L"
            className="max-h-[86%] w-auto rounded-xl border border-line object-contain shadow-2xl"
        />
    );

    if (reduced || noWebGL) {
        return (
            <div ref={ref} className="flex h-full w-full items-center justify-center">
                {staticPhoto}
            </div>
        );
    }

    return (
        <div ref={ref} className="h-full w-full">
            {inView && (
                <WebGLBoundary
                    onError={() => setNoWebGL(true)}
                    fallback={<div className="flex h-full w-full items-center justify-center">{staticPhoto}</div>}
                >
                    <Suspense fallback={<div className="h-full w-full" />}>
                        <Lanyard photo={photo} org="BMSIT&M" lanyardColor="#2f6bff" />
                    </Suspense>
                </WebGLBoundary>
            )}
        </div>
    );
};

export default LanyardCard;
