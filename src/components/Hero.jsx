import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { FaReact, FaCode, FaLaptopCode, FaRocket } from 'react-icons/fa';

const Hero = () => {
    const containerRef = useRef(null);

    // Scroll Parallax Logic
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const xText = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

    // --- MOUSE TRACKING ---
    // We track the mouse relative to the container for accurate masking.
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for the cursor/mask movement
    const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

    // Mask Size (Radius of the reveal hole)
    const maskSize = useSpring(0, { stiffness: 60, damping: 20 });

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Update values
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);

        // Ensure mask is open when moving
        maskSize.set(80);
    };

    const handleMouseLeave = () => {
        maskSize.set(0);
    };

    // --- MASK TEMPLATE ---
    // radial-gradient(circle [size] at [x] [y], transparent 80%, black 100%)
    // Transparent = Hole (shows underlying Batman)
    // Black = Opaque (shows Top Layer / Vineeth)
    const maskImage = useMotionTemplate`radial-gradient(circle ${maskSize}px at ${springX}px ${springY}px, transparent 80%, black 100%)`;

    // Float Animation Variants
    const partVariants = (custom) => ({
        hidden: { x: custom.x, y: custom.y, opacity: 0, scale: 0.5, rotate: custom.rotate },
        visible: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 } }
    });

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-black cursor-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* ==================== LAYER 2: BOTTOM (Batman) ==================== */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/batman.png"
                    alt="Batman Background"
                    className="w-full h-full object-cover opacity-80"
                />
                {/* Detail Overlay */}
                <div className="absolute inset-0 bg-accent-purple/10 mix-blend-overlay" />
            </div>


            {/* ==================== LAYER 1: TOP (Overlay) ==================== */}
            {/* This layer covers the screen and gets "scratched" away by the mask */}
            <motion.div
                className="absolute inset-0 z-10 bg-[#050505] flex flex-col items-center justify-center p-0 m-0"
                style={{
                    maskImage: maskImage,
                    WebkitMaskImage: maskImage
                }}
            >
                {/* 1. Background Text */}
                <motion.h1
                    style={{ y: yText, x: xText }}
                    className="absolute top-1/3 text-[12vw] leading-none font-black text-white/10 whitespace-nowrap z-0 select-none"
                >
                    CREATIVE DEVELOPER
                </motion.h1>

                {/* 2. Central Portrait Container */}
                <div className="relative z-10 w-[400px] h-[550px] md:h-[650px] translate-y-[180px]">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px] bg-accent-purple/40 blur-[120px] rounded-full -z-10" />

                    {/* Vineeth Image */}
                    <div className="absolute inset-0 z-20">
                        <img
                            src="/assets/vineeth.png"
                            alt="Vineeth"
                            className="absolute inset-0 w-full h-full object-contain object-top select-none"
                            style={{
                                maskImage: 'radial-gradient(70% 70% at 50% 30%, black 30%, transparent 100%)',
                                WebkitMaskImage: 'radial-gradient(70% 70% at 50% 30%, black 30%, transparent 100%)'
                            }}
                        />
                    </div>

                    {/* Floating Parts */}
                    <motion.div custom={{ x: -200, y: -200, rotate: -45 }} variants={partVariants} initial="hidden" animate="visible" className="absolute -top-10 -left-10 text-accent-purple text-5xl z-10"><FaReact /></motion.div>
                    <motion.div custom={{ x: 200, y: -100, rotate: 45 }} variants={partVariants} initial="hidden" animate="visible" className="absolute top-20 -right-16 text-accent-cyan text-4xl z-10"><FaCode /></motion.div>
                    <motion.div custom={{ x: -200, y: 200, rotate: -90 }} variants={partVariants} initial="hidden" animate="visible" className="absolute bottom-32 -left-12 text-white/20 text-6xl z-10"><FaLaptopCode /></motion.div>
                    <motion.div custom={{ x: 200, y: 200, rotate: 90 }} variants={partVariants} initial="hidden" animate="visible" className="absolute -bottom-5 right-0 text-accent-cyan/50 text-5xl z-30"><FaRocket /></motion.div>
                </div>
            </motion.div>

            {/* ==================== CUSTOM CURSOR ==================== */}
            <motion.div
                className="absolute pointer-events-none z-50 rounded-full border border-white/50 backdrop-blur-sm"
                style={{
                    left: springX,
                    top: springY,
                    width: 80,
                    height: 80,
                    x: '-50%',
                    y: '-50%',
                    opacity: 1
                }}
            />
        </section>
    );
};

export default Hero;
