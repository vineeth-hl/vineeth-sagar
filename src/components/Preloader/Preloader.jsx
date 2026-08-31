import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/*
 * Intro preloader: a fixed full-screen overlay that draws a "V" monogram + the
 * name via SVG path tracing (framer-motion `pathLength` / `strokeDashoffset`),
 * then slides up out of the frame once (a) the draw finishes and (b) window
 * `load` has fired and a minimum on-screen time has passed. It lives inside an
 * <AnimatePresence> in App, so the `exit` runs and then it unmounts entirely.
 */

const EXIT_EASE = [0.76, 0, 0.24, 1];
const MIN_MS = 2600; // floor so the animation is actually seen on fast loads
const CAP_MS = 7000; // never hang the site

const NAME = 'VINEETH SAGAR H L';
const DASH = 2600; // > the stroked-text outline length, so it fully draws

export default function Preloader({ onComplete }) {
    const reduced =
        typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

    const done = useRef(false);
    const drawDone = useRef(reduced);
    const loaded = useRef(typeof document !== 'undefined' && document.readyState === 'complete');
    const started = useRef(0);

    const finish = () => {
        if (done.current) return;
        done.current = true;
        window.__preloaderDone = true;
        window.dispatchEvent(new Event('preloader:done'));
        document.documentElement.style.overflow = '';
        onComplete?.();
    };

    const tryFinish = () => {
        if (drawDone.current && loaded.current && performance.now() - started.current >= MIN_MS) finish();
    };

    useEffect(() => {
        started.current = performance.now();
        document.documentElement.style.overflow = 'hidden';

        const onLoad = () => {
            loaded.current = true;
            tryFinish();
        };
        if (!loaded.current) window.addEventListener('load', onLoad);

        const minT = setTimeout(tryFinish, MIN_MS + 40);
        const capT = setTimeout(finish, CAP_MS);
        let rmT;
        if (reduced) rmT = setTimeout(tryFinish, 450);

        return () => {
            window.removeEventListener('load', onLoad);
            clearTimeout(minT);
            clearTimeout(capT);
            clearTimeout(rmT);
            document.documentElement.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const D = (t) => (reduced ? { duration: 0 } : t); // collapse timings for reduced motion
    const nameProps = {
        x: 320,
        y: 60,
        textAnchor: 'middle',
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 46,
        fontWeight: 800,
        letterSpacing: 6
    };

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-9 bg-[#0D0D0D] px-6"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: '-100%' }}
            transition={{ duration: reduced ? 0.35 : 0.85, ease: EXIT_EASE }}
        >
            {/* V monogram — SVG path tracing */}
            <svg width="92" height="92" viewBox="0 0 140 140" fill="none" aria-hidden>
                <motion.path
                    d="M32 34 L70 104 L108 34"
                    stroke="#F7F7F7"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: reduced ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={D({ duration: 1.1, ease: [0.65, 0, 0.35, 1] })}
                />
                <motion.path
                    d="M108 34 L126 34"
                    stroke="#1E90FF"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: reduced ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={D({ duration: 0.35, ease: 'easeOut', delay: 0.95 })}
                />
                <motion.path
                    d="M30 122 L110 122"
                    stroke="#F7F7F7"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: reduced ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={D({ duration: 0.5, ease: 'easeInOut', delay: 1.1 })}
                />
                <motion.circle
                    cx="70"
                    cy="104"
                    r="5"
                    fill="#1E90FF"
                    initial={{ scale: reduced ? 1 : 0 }}
                    animate={{ scale: 1 }}
                    transition={D({ duration: 0.4, ease: 'backOut', delay: 1.0 })}
                />
            </svg>

            {/* Name — stroke drawn on, then the fill settles in */}
            <svg viewBox="0 0 640 90" className="w-[min(80vw,560px)]" fill="none" role="img" aria-label={NAME}>
                {!reduced && (
                    <motion.text
                        {...nameProps}
                        fill="none"
                        stroke="#F7F7F7"
                        strokeWidth="1.1"
                        style={{ strokeDasharray: DASH }}
                        initial={{ strokeDashoffset: DASH }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 1.7, ease: [0.4, 0, 0.2, 1], delay: 1.2 }}
                    >
                        {NAME}
                    </motion.text>
                )}
                <motion.text
                    {...nameProps}
                    fill="#F7F7F7"
                    initial={{ opacity: reduced ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={D({ duration: 0.6, delay: 2.7 })}
                    onAnimationComplete={() => {
                        drawDone.current = true;
                        tryFinish();
                    }}
                >
                    {NAME}
                </motion.text>
            </svg>

            <motion.p
                className="font-mono text-[10px] uppercase tracking-[0.42em] text-white/35 md:text-[11px]"
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={{ opacity: 1 }}
                transition={D({ duration: 0.5, delay: 3.0 })}
            >
                AI / ML &amp; Full-Stack Developer
            </motion.p>

            {/* pacing bar */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
                <motion.div
                    className="h-full origin-left bg-[#1E90FF]"
                    initial={{ scaleX: reduced ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={D({ duration: 3.4, ease: [0.4, 0, 0.2, 1] })}
                />
            </div>
        </motion.div>
    );
}
