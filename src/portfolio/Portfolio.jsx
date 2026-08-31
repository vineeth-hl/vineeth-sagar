import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Preloader from '../components/Preloader/Preloader';
import usePreloaderReady from '../hooks/usePreloaderReady';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LaptopDive from '../components/LaptopDive';
import About from '../components/About';
import Skills from '../components/Skills';
import FeaturedProjects from '../components/FeaturedProjects';
import Achievements from '../components/Achievements';
import ActivityHeatmap from '../components/ActivityHeatmap';
import Contact from '../components/Contact';
import VisitorCounter from '../components/VisitorCounter';
import Footer from '../components/Footer';

const Portfolio = () => {
    const [loaded, setLoaded] = useState(false);
    const lenisRef = useRef(null);
    // true once the intro preloader has lifted (or immediately if there isn't one)
    const ready = usePreloaderReady();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2
        });
        lenisRef.current = lenis;
        // hold scroll while the preloader covers the page — Lenis drives scroll
        // programmatically from wheel/touch events, so `overflow: hidden` alone
        // doesn't stop it; without this the page scrolls behind the overlay and
        // the reveal lands mid-page instead of on the hero.
        lenis.stop();

        if (import.meta.env.DEV) window.__lenis = lenis;

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // release the scroll lock once the preloader is gone, always from the top
    useEffect(() => {
        if (!ready) return;
        const lenis = lenisRef.current;
        try {
            window.scrollTo(0, 0);
        } catch {
            /* ignore */
        }
        if (lenis) {
            lenis.scrollTo(0, { immediate: true, force: true });
            lenis.start();
        }
    }, [ready]);

    return (
        <div className="min-h-screen">
            <AnimatePresence>
                {!loaded && <Preloader key="preloader" onComplete={() => setLoaded(true)} />}
            </AnimatePresence>

            <Navbar />

            <main>
                <Hero />
                <LaptopDive />
                <About />
                <Skills />
                <FeaturedProjects />
                <Achievements />
                <ActivityHeatmap />
                <Contact />
                <VisitorCounter />
                <Footer />
            </main>
        </div>
    );
};

export default Portfolio;
