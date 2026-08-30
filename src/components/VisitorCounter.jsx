import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const VisitorCounter = () => {
    return (
        <section className="py-20 flex justify-center bg-background border-t border-line px-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm rounded-lg border border-line bg-card px-10 py-8 text-center"
            >
                <div className="text-5xl md:text-6xl font-extrabold font-mono tracking-tight text-primary">
                    <CountUp end={1245} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
                </div>
                <div className="mt-3 text-[11px] font-mono uppercase tracking-[0.3em] text-accent-blue">
                    Visitors
                </div>
            </motion.div>
        </section>
    );
};

export default VisitorCounter;
