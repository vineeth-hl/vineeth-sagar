import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const LaptopScene = lazy(() => import('./LaptopScene'));

const EASE_OUT = [0, 0, 0.2, 1];
// scroll progress at which the camera dive has landed inside the (now bright)
// screen; the zoom-fade DOM hand-off fires as a one-shot the instant we cross it.
const DIVE_END = 0.8;

/**
 * Scroll-driven "dive into the laptop" transition between the hero and About.
 *
 * A 240vh scroll track pins a viewport-sized WebGL stage (Three.js via
 * @react-three/fiber). As you scroll:
 *   1. a dead-shut 3D laptop (lid rotation.x = 0) hinges open to exactly -90deg;
 *   2. its screen powers on BRIGHT — a glowing blue/cyan monitor with a strong
 *      bloom and a pool of light sweeping the keyboard;
 *   3. the camera plunges dead-centre until the glowing screen fills the
 *      viewport and stays lit;
 *   4. the identity panel boots straight onto that lit screen — a timed
 *      zoom-fade (scale 0.9 -> 1, opacity 0 -> 1 over 1.5s ease-out), with a
 *      soft centre vignette just for text legibility;
 *   5. over the final sliver of scroll the lit screen settles to #0D0D0D so it
 *      meets the dark About section without a jump; the panel text carries
 *      straight into About's heading.
 *
 * Scroll progress is mirrored into a ref the R3F frame loop reads every frame,
 * so the camera + hinge scrub exactly to scroll and stay in sync with Lenis.
 */
const LaptopDive = () => {
    const ref = useRef(null);
    const progressRef = useRef(0);
    const [inView, setInView] = useState(false);
    const [reduced, setReduced] = useState(false);
    const [diveDone, setDiveDone] = useState(false);

    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        progressRef.current = v;
        setDiveDone(v >= DIVE_END);
    });

    useEffect(() => {
        const p = scrollYProgress.get();
        progressRef.current = p;
        setDiveDone(p >= DIVE_END);
        setReduced(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
        const t = setTimeout(() => import('./LaptopScene'), 2500); // warm the 3D chunk
        return () => clearTimeout(t);
    }, [scrollYProgress]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
            rootMargin: '25% 0px 25% 0px',
        });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // soft centre vignette — dims only the middle of the glowing screen so the
    // white panel text stays readable; the screen still blazes at the edges.
    const textScrimOpacity = useTransform(scrollYProgress, [0.72, 0.84], [0, 1]);
    // final settle: the lit screen fades to #0D0D0D over the last sliver of the
    // track so the hand-off into the dark About section has no bright->dark jump.
    const settleOpacity = useTransform(scrollYProgress, [0.93, 1], [0, 1]);

    if (reduced) {
        return <section className="h-px w-full bg-background" aria-hidden />;
    }

    return (
        <section ref={ref} className="relative h-[240vh] bg-[#0D0D0D]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {inView && (
                    <Suspense fallback={<div className="absolute inset-0 bg-[#0D0D0D]" />}>
                        <LaptopScene progress={progressRef} />
                    </Suspense>
                )}

                {/* legibility vignette over the lit screen */}
                <motion.div
                    style={{
                        opacity: textScrimOpacity,
                        background:
                            'radial-gradient(ellipse 72% 58% at 50% 46%, rgba(2,6,20,0.60) 0%, rgba(2,6,20,0.26) 46%, rgba(2,6,20,0) 74%)',
                    }}
                    className="pointer-events-none absolute inset-0 z-[44]"
                />

                {/* final settle to the page background for the About hand-off */}
                <motion.div
                    style={{ opacity: settleOpacity }}
                    className="pointer-events-none absolute inset-0 z-[45] bg-[#0D0D0D]"
                />

                {/* Zoom-fade DOM hand-off — fires as a one-shot the moment the
                    camera dive finishes. Rest state is scale(0.9)/opacity 0
                    (content sitting "deeper" inside the monitor); on trigger it
                    grows to scale(1)/opacity 1 over 1.5s ease-out and takes
                    pointer events, booting up on the lit screen. Reversible. */}
                <motion.div
                    initial={false}
                    animate={diveDone ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.5, ease: EASE_OUT }}
                    className={`absolute inset-0 z-[46] flex flex-col items-center justify-center gap-3 px-6 text-center ${
                        diveDone ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                >
                    <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#d6e8ff] drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
                        profile loaded
                    </p>
                    <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)] md:text-5xl">
                        Vineeth Sagar H L
                    </h2>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/85 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] md:text-sm">
                        AI / ML &amp; Full-Stack Developer
                    </p>
                    <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-white/55 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                        scroll to continue
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default LaptopDive;
