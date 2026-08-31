import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/*
 * Real visitor count via Abacus (abacus.jasoncameron.dev) — a free, keyless,
 * CORS-friendly hit counter. Increments once per browser session; a page
 * refresh in the same tab just re-reads the total. Falls back to the last
 * cached value, and renders nothing if it can never reach the service (better
 * than showing a fake number).
 */

const NS = 'vineethsagar-portfolio';
const KEY = 'visits';
const url = (kind) => `https://abacus.jasoncameron.dev/${kind}/${NS}/${KEY}`;

const readLS = (k) => {
    try {
        return window.localStorage.getItem(k);
    } catch {
        return null;
    }
};
const writeLS = (k, v) => {
    try {
        window.localStorage.setItem(k, v);
    } catch {
        /* ignore */
    }
};

const VisitorCounter = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [count, setCount] = useState(() => {
        const c = Number(readLS('visitorCount'));
        return Number.isFinite(c) && c > 0 ? c : null;
    });
    const [display, setDisplay] = useState(0);

    // fetch the real total once
    useEffect(() => {
        let alive = true;
        let counted = false;
        try {
            counted = window.sessionStorage.getItem('vc-counted') === '1';
        } catch {
            /* ignore */
        }

        fetch(url(counted ? 'get' : 'hit'))
            .then((r) => r.json())
            .then((d) => {
                if (!alive || typeof d?.value !== 'number') return;
                setCount(d.value);
                writeLS('visitorCount', String(d.value));
                try {
                    window.sessionStorage.setItem('vc-counted', '1');
                } catch {
                    /* ignore */
                }
            })
            .catch(() => {
                /* keep the cached value, if any */
            });
        return () => {
            alive = false;
        };
    }, []);

    // count-up once it's both in view and we have a real number
    useEffect(() => {
        if (!inView || count == null) return undefined;
        const start = performance.now();
        const dur = 1600;
        let raf;
        const tick = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * count));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, count]);

    if (count == null) return null;

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
                    {display.toLocaleString('en-US')}
                </div>
                <div className="mt-3 text-[11px] font-mono uppercase tracking-[0.3em] text-accent-blue">Visitors</div>
            </motion.div>
        </section>
    );
};

export default VisitorCounter;
