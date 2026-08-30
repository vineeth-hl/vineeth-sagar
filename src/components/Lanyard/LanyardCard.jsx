import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';

const Lanyard = lazy(() => import('./Lanyard'));

/**
 * About-section wrapper around the 3D Lanyard badge.
 *
 * The 3D component pulls in @react-three/rapier (Rapier WASM) + meshline, so it's
 * code-split and only mounts once the badge scrolls into view. Reduced-motion
 * users get a plain framed photo instead of the swinging physics object.
 */
const LanyardCard = ({ photo }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        setReduced(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
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

    if (reduced) {
        return (
            <div ref={ref} className="flex h-full w-full items-center justify-center">
                <img
                    src={photo}
                    alt="Vineeth Sagar H L"
                    className="max-h-[86%] w-auto rounded-xl border border-line object-contain shadow-2xl"
                />
            </div>
        );
    }

    return (
        <div ref={ref} className="h-full w-full">
            {inView && (
                <Suspense fallback={<div className="h-full w-full" />}>
                    <Lanyard photo={photo} org="BMSIT&M" lanyardColor="#2f6bff" />
                </Suspense>
            )}
        </div>
    );
};

export default LanyardCard;
