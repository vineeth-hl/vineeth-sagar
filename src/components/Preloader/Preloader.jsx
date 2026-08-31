import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/*
 * Intro preloader: a fixed full-screen overlay.
 *   - a "V" monogram is traced with framer-motion `pathLength`
 *   - the name is a single HTML element using `-webkit-text-stroke` (so every
 *     glyph, "L" included, is identical hollow outline — no stacked SVG paths,
 *     no ghost strokes); a left-to-right clip-path wipe "writes" it on, then the
 *     colour fills in from transparent to white
 *   - exit is layered: content lifts + fades, then the panel slides up, then it
 *     unmounts entirely (via <AnimatePresence> in App)
 */

const PANEL_EASE = [0.83, 0, 0.17, 1];
const DRAW_EASE = [0.65, 0, 0.35, 1];
const MIN_MS = 2800; // floor so the trace is actually seen
const HOLD_MS = 1000; // sit on the finished frame so the subtitle is readable
const CAP_MS = 8000; // never hang the site

const NAME = 'VINEETH SAGAR H L';

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

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-10 overflow-hidden bg-[#0D0D0D] px-6"
            initial={{ y: 0 }}
            exit={{ y: '-101%' }}
            transition={{ duration: reduced ? 0.4 : 0.95, ease: PANEL_EASE, delay: reduced ? 0 : 0.16 }}
        >
            {/* soft accent glow behind the mark */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute h-[460px] w-[460px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(30,144,255,0.12), transparent 68%)' }}
                initial={{ opacity: reduced ? 0.6 : 0, scale: reduced ? 1 : 0.7 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={D({ duration: 1.6, ease: 'easeOut' })}
            />

            {/* content — lifts + fades before the panel slides */}
            <motion.div
                className="relative flex flex-col items-center gap-10"
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30, transition: { duration: reduced ? 0.25 : 0.44, ease: 'easeIn' } }}
                transition={D({ duration: 0.5 })}
            >
                {/* V monogram — path traced, symmetric so it sits on the true centre */}
                <motion.svg
                    width="86"
                    height="86"
                    viewBox="0 0 140 140"
                    fill="none"
                    aria-hidden
                    initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={D({ duration: 0.5, ease: 'easeOut' })}
                >
                    <motion.path
                        d="M34 36 L70 104 L106 36"
                        stroke="#F7F7F7"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: reduced ? 1 : 0 }}
                        animate={{ pathLength: 1 }}
                        transition={D({ duration: 1.0, ease: DRAW_EASE, delay: 0.2 })}
                    />
                    <motion.path
                        d="M36 122 L104 122"
                        stroke="#1E90FF"
                        strokeWidth="5"
                        strokeLinecap="round"
                        initial={{ pathLength: reduced ? 1 : 0 }}
                        animate={{ pathLength: 1 }}
                        transition={D({ duration: 0.5, ease: 'easeInOut', delay: 1.05 })}
                    />
                    <motion.circle
                        cx="70"
                        cy="104"
                        r="4"
                        fill="#F7F7F7"
                        initial={{ scale: reduced ? 1 : 0 }}
                        animate={{ scale: 1 }}
                        transition={D({ duration: 0.4, ease: 'backOut', delay: 1.0 })}
                    />
                </motion.svg>

                {/* Name — solid fill, revealed by a clean L->R clip-path wipe
                    (no text-stroke: it fringes on curves and reads as doubled).
                    An accent underline then draws in beneath it. */}
                <div className="relative flex flex-col items-center gap-3">
                    <motion.p
                        aria-label={NAME}
                        className="select-none whitespace-nowrap text-center font-extrabold uppercase leading-none text-[#F7F7F7]"
                        style={{
                            fontFamily: '"Inter", system-ui, sans-serif',
                            fontSize: 'clamp(1.3rem, 4.6vw, 2.5rem)',
                            letterSpacing: '0.16em'
                        }}
                        initial={{ clipPath: reduced ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)' }}
                        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                        transition={D({ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.85 })}
                    >
                        {NAME}
                    </motion.p>
                    <motion.span
                        aria-hidden
                        className="h-[2px] w-full origin-left rounded-full bg-[#1E90FF]"
                        initial={{ scaleX: reduced ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={D({ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 2.4 })}
                    />
                </div>

                <motion.p
                    className="font-mono text-[10px] uppercase tracking-[0.42em] text-white/50 md:text-[11px]"
                    initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={D({ duration: 0.6, ease: 'easeOut', delay: 2.85 })}
                    onAnimationComplete={() => {
                        // sit on the fully-drawn frame long enough to read the line
                        setTimeout(() => {
                            drawDone.current = true;
                            tryFinish();
                        }, reduced ? 0 : HOLD_MS);
                    }}
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
                    transition={D({ duration: 4.0, ease: [0.4, 0, 0.2, 1] })}
                />
            </div>
        </motion.div>
    );
}
