import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NowPlaying from './NowPlaying/NowPlaying';

const INITIAL = 'VINEETH';
const FINAL = 'PORTFOLIO';

/* Timeline (seconds) */
const T_HOLD = 0.6;       // "VINEETH" stays before the crossfade
const T_TEXT_FADE = 0.9;  // "VINEETH" fades out while "PORTFOLIO" fades in
const T_SLIDE_START = 1.6;
const T_SLIDE_DUR = 2.4;  // slow, soft rise -> portrait settled at ~4.0s
const T_UI = 3.0;         // navbar + subtitle + button + now-playing (comes in while the portrait finishes its settle)

/**
 * Cinematic hero with a strictly-sequenced reveal:
 *   1. "VINEETH" holds, then cross-fades into "PORTFOLIO" in the same spot
 *      (one fades out as the other fades in).
 *   2. As the word settles, the dead-centre cut-out portrait slides up slowly
 *      from below the frame (translateY 105% -> 0, opacity 0 -> 1) over ~2.4s
 *      with a decelerating ease, overlapping the letters for 3D depth.
 *   3. Only once the portrait has settled do the navbar, subtitle and contact
 *      button fade in with a slight upward float.
 *
 * Stacking: radial glow (z-0) < text (z-10) < portrait (z-20) < UI (z-30).
 * Hero stays dark regardless of the site theme.
 */
const Hero = () => {
    const [word, setWord] = useState(INITIAL);

    useEffect(() => {
        const t = setTimeout(() => setWord(FINAL), T_HOLD * 1000);
        return () => clearTimeout(t);
    }, []);

    const uiItem = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-[#0D0D0D] tracking-tight">
            {/* Layer 1 — deep background radial glow */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 32%, transparent 58%)',
                }}
            />

            {/* Layer 2 — massive metallic word: VINEETH fades + zooms out while
                PORTFOLIO fades + zooms in, in the exact same spot. Each <h1> fills
                the layer and centres its own text (via flex, not transform), so
                framer-motion is free to animate scale. */}
            <div className="absolute inset-0 z-10">
                {/* initial={false} -> "VINEETH" is simply present at first; only the
                    swap to "PORTFOLIO" animates. */}
                <AnimatePresence initial={false}>
                    <motion.h1
                        key={word}
                        initial={{ opacity: 0, scale: 1.18 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.82 }}
                        transition={{ duration: T_TEXT_FADE, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute inset-0 flex items-center justify-center select-none whitespace-nowrap px-4 text-center font-black leading-none tracking-tighter text-[17vw] bg-gradient-to-b from-white via-[#cfcfcf] to-[#585858] bg-clip-text text-transparent"
                    >
                        {word}
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Layer 3 — foreground portrait: dead-centre, slides up as the word settles.
                x:'-50%' is set on the motion element itself so framer-motion doesn't
                drop the horizontal centring when it writes `transform` for the slide. */}
            <motion.div
                initial={{ x: '-50%', y: '105%', opacity: 0 }}
                animate={{ x: '-50%', y: '0%', opacity: 1 }}
                transition={{ delay: T_SLIDE_START, duration: T_SLIDE_DUR, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-1/2 z-20 pointer-events-none"
            >
                <img
                    src="/assets/hero/image_A.png"
                    alt="Vineeth Sagar H L"
                    draggable="false"
                    className="h-[62vh] md:h-[76vh] w-auto max-w-none select-none object-contain object-bottom [mask-image:linear-gradient(to_top,transparent_0%,#000_9%)]"
                />
            </motion.div>

            {/* Bottom scrim — grounds the portrait and makes the UI legible */}
            <div className="absolute inset-x-0 bottom-0 z-20 h-56 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/85 to-transparent pointer-events-none" />

            {/* Layer 4 — UI: subtitle + contact, in after the portrait settles */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { delayChildren: T_UI, staggerChildren: 0.16 } } }}
                className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-4 pb-9 md:pb-12"
            >
                <motion.p
                    variants={uiItem}
                    className="text-[11px] md:text-xs font-medium uppercase tracking-[0.4em] text-[#F7F7F7]/90 drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]"
                >
                    AI/ML &amp; Full-Stack Developer
                </motion.p>
                <motion.a
                    variants={uiItem}
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#F7F7F7] backdrop-blur-sm transition-colors hover:border-white/50 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
                >
                    Get in Touch <span aria-hidden>&rarr;</span>
                </motion.a>
            </motion.div>

            {/* Live "Now Playing" widget — bottom-left corner, tilts on hover,
                fades in just after the UI. Larger screens only (tilt + space). */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: T_UI + 0.35, duration: 0.6, ease: 'easeOut' }}
                className="absolute bottom-10 left-6 z-40 hidden lg:block"
            >
                <NowPlaying />
            </motion.div>
        </section>
    );
};

export default Hero;
