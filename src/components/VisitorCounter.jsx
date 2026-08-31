import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const TARGET = 1245;

/* small SSR-safe count-up — animates from 0 to TARGET the first time it's seen */
const VisitorCounter = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [n, setN] = useState(0);

    useEffect(() => {
        if (!inView) return undefined;
        const start = performance.now();
        const dur = 2000;
        let raf;
        const tick = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(eased * TARGET));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView]);

    return (
        <section className="py-20 flex justify-center bg-background border-t border-line px-6">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm rounded-lg border border-line bg-card px-10 py-8 text-center"
            >
                <div className="text-5xl md:text-6xl font-extrabold font-mono tracking-tight text-primary tabular-nums">
                    {n.toLocaleString('en-US')}
                </div>
                <div className="mt-3 text-[11px] font-mono uppercase tracking-[0.3em] text-accent-blue">Visitors</div>
            </motion.div>
        </section>
    );
};

export default VisitorCounter;
