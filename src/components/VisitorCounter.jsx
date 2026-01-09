import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const VisitorCounter = () => {
    return (
        <section className="py-40 flex justify-center bg-black relative overflow-hidden">
            {/* Scanner Effect */}
            <motion.div
                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm z-0 pointer-events-none"
            />

            {/* Background Grid Accent */}
            <motion.div
                animate={{ backgroundPosition: ["0rem 0rem", "4rem 4rem"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100 }}
                className="relative px-12 py-8 bg-[#0A0A0A] border border-white/10 rounded-lg shadow-[0_0_60px_-15px_rgba(168,85,247,0.3)] z-10"
            >
                {/* Hardware Accents */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent-cyan" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent-cyan" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent-cyan" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent-cyan" />

                <div className="flex flex-col items-center">
                    <div className="text-6xl md:text-7xl font-mono font-bold tracking-widest bg-gradient-to-r from-accent-cyan via-white to-accent-purple bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        <CountUp
                            end={1245}
                            duration={3}
                            separator=","
                            enableScrollSpy
                            scrollSpyOnce
                        />
                    </div>
                    <div className="mt-4 text-xs font-mono tracking-[0.3em] text-accent-purple uppercase">
                        System_Stat: Visitors
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default VisitorCounter;
