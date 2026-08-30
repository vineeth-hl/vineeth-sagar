import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LaptopDive from './components/LaptopDive';
import About from './components/About';
import Skills from './components/Skills';
import FeaturedProjects from './components/FeaturedProjects';
import Achievements from './components/Achievements';
import ActivityHeatmap from './components/ActivityHeatmap';
import Contact from './components/Contact';
import VisitorCounter from './components/VisitorCounter';
import Footer from './components/Footer';

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    if (import.meta.env.DEV) window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      // Cleanup if needed
      lenis.destroy();
    }
  }, []);

  return (
    <div className="min-h-screen">
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

export default App;
