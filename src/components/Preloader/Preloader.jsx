import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/*
 * Intro preloader: a fixed full-screen overlay that draws a "V" monogram + the
 * name via SVG path tracing (framer-motion `pathLength` / `strokeDashoffset`),
 * then hands off to the site with a layered exit — the content lifts + fades
 * first, then the panel slides up out of frame — and unmounts entirely.
 * Lives inside <AnimatePresence> in App.
 */

const PANEL_EASE = [0.83, 0, 0.17, 1]; // expo in/out — the slide
const DRAW_EASE = [0.65, 0, 0.35, 1];
const MIN_MS = 2000; // floor so the trace is actually seen on fast loads
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
        if (reduced) rmT = setTimeout(tryFinish, 400);

        return () => {
            window.removeEventListener('load', onLoad);
            clearTimeout(minT);
            clearTimeout(capT);
            clearTimeout(rmT);
            document.documentElement.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const D = (t) => (reduced ? { duration: 0 } : t);
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
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#0D0D0D] px-6"
            initial={{ y: 0 }}
            exit={{ y: '-101%' }}
            transition={{ duration: reduced ? 0.4 : 0.95, ease: PANEL_EASE, delay: reduced ? 0 : 0.14 }}
        >
            {/* soft accent glow behind the mark */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute h-[440px] w-[440px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(30,144,255,0.12), transparent 68%)' }}
                initial={{ opacity: reduced ? 0.6 : 0, scale: reduced ? 1 : 0.7 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={D({ duration: 1.3, ease: 'easeOut' })}
            />

            {/* content — lifts + fades before the panel slides */}
            <motion.div
                className="relative flex flex-col items-center gap-9"
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30, transition: { duration: reduced ? 0.25 : 0.42, ease: 'easeIn' } }}
                transition={D({ duration: 0.5 })}
            >
                {/* V monogram — SVG path tracing */}
                <motion.svg
                    width="88"
                    height="88"
                    viewBox="0 0 140 140"
                    fill="none"
                    aria-hidden
                    initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={D({ duration: 0.5, ease: 'easeOut' })}
                >
                    <motion.path
                        d="M32 34 L70 104 L108 34"
                        stroke="#F7F7F7"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: reduced ? 1 : 0 }}
                        animate={{ pathLength: 1 }}
                        transition={D({ duration: 0.8, ease: DRAW_EASE, delay: 0.1 })}
                    />
                    <motion.path
                        d="M108 34 L126 34"
                        stroke="#1E90FF"
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ pathLength: reduced ? 1 : 0 }}
                        animate={{ pathLength: 1 }}
                        transition={D({ duration: 0.3, ease: 'easeOut', delay: 0.78 })}
                    />
                    <motion.path
                        d="M30 122 L110 122"
                        stroke="#F7F7F7"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: reduced ? 1 : 0 }}
                        animate={{ pathLength: 1 }}
                        transition={D({ duration: 0.45, ease: 'easeInOut', delay: 0.9 })}
                    />
                    <motion.circle
                        cx="70"
                        cy="104"
                        r="5"
                        fill="#1E90FF"
                        initial={{ scale: reduced ? 1 : 0 }}
                        animate={{ scale: 1 }}
                        transition={D({ duration: 0.4, ease: 'backOut', delay: 0.82 })}
                    />
                </motion.svg>

                {/* Name — stroke traced on, fill settles in over the top */}
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
                            transition={{ duration: 1.15, ease: [0.4, 0, 0.2, 1], delay: 0.85 }}
                        >
                            {NAME}
                        </motion.text>
                    )}
                    <motion.text
                        {...nameProps}
                        fill="#F7F7F7"
                        initial={{ opacity: reduced ? 1 : 0 }}
                        animate={{ opacity: 1 }}
                        transition={D({ duration: 0.6, ease: 'easeOut', delay: 1.75 })}
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
                    initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={D({ duration: 0.5, ease: 'easeOut', delay: 2.1 })}
                >
                    AI / ML &amp; Full-Stack Developer
                </motion.p>
            </motion.div>

            {/* pacing bar — rides up with the panel on exit */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/[0.07]">
                <motion.div
                    className="h-full origin-left bg-[#1E90FF]"
                    initial={{ scaleX: reduced ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={D({ duration: 2.6, ease: [0.4, 0, 0.2, 1] })}
                />
            </div>
        </motion.div>
    );
}
