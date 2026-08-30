import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const LaptopScene = lazy(() => import('./LaptopScene'));

const EASE_OUT = [0, 0, 0.2, 1];
// scroll progress at which the camera dive has fully landed inside the screen;
// the zoom-fade DOM hand-off is triggered as a one-shot the instant we cross it.
const DIVE_END = 0.86;

/**
 * Scroll-driven "dive into the laptop" transition between the hero and About.
 *
 * A 240vh scroll track pins a viewport-sized WebGL stage (Three.js via
 * @react-three/fiber). As you scroll:
 *   1. a dead-shut 3D laptop (lid rotation.x = 0) hinges open to exactly -90deg
 *      under a moody top-down spotlight;
 *   2. its screen powers on to a soft glow (subtle bloom);
 *   3. the camera plunges dead-centre toward the screen until its bounds are
 *      pushed past the viewport edges. The screen material itself DARKENS to
 *      #0D0D0D as the camera arrives, so it fills the window with the exact
 *      page background — no white flash;
 *   4. the instant the dive lands, an identity panel does a timed zoom-fade:
 *      scale(0.9) -> 1 and opacity 0 -> 1 over 1.5s ease-out, like the
 *      portfolio UI booting on that screen. It hands straight off to About.
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

    // safety backstop: a #0D0D0D wash fully in place before the dive lands, so
    // even if a sliver of the 3D scene is still lit at the edges the hand-off
    // never flashes anything behind the panel.
    const voidOpacity = useTransform(scrollYProgress, [0.62, 0.82], [0, 1]);

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

                {/* screen light collapses to the dark void */}
                <motion.div
                    style={{ opacity: voidOpacity }}
                    className="pointer-events-none absolute inset-0 z-[44] bg-[#0D0D0D]"
                />

                {/* Zoom-fade DOM hand-off — fires as a one-shot the moment the
                    camera dive finishes. Rest state is scale(0.9)/opacity 0
                    (content sitting "deeper" inside the monitor); on trigger it
                    grows to scale(1)/opacity 1 over 1.5s ease-out and takes
                    pointer events, as if the UI is booting up on the screen the
                    camera just breached. Reversible on scroll-up. */}
                <motion.div
                    initial={false}
                    animate={diveDone ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.5, ease: EASE_OUT }}
                    className={`absolute inset-0 z-[46] flex flex-col items-center justify-center gap-3 px-6 text-center ${
                        diveDone ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                >
                    <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#5b8cff]">profile loaded</p>
                    <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white md:text-5xl">
                        Vineeth Sagar H L
                    </h2>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/55 md:text-sm">
                        AI / ML &amp; Full-Stack Developer
                    </p>
                    <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-white/30">scroll to continue</p>
                </motion.div>
            </div>
        </section>
    );
};

export default LaptopDive;
