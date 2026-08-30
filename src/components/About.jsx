import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaInstagram, FaDownload } from 'react-icons/fa';
import LanyardCard from './Lanyard/LanyardCard';

const METRICS = [
    { value: '6+', label: 'Projects Shipped' },
    { value: '2', label: 'Hackathon Wins' },
    { value: 'AI / ML', label: 'Core Focus' },
];

const About = () => {
    return (
        <section id="about" className="relative py-24 bg-background overflow-hidden">
            {/* carries the dark laptop-dive straight into About (fade, not a hard cut);
                in dark mode this is invisible, in light mode it eases the handoff */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[70vh] bg-gradient-to-b from-[#0D0D0D] to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Section label */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-accent-gold"
                >
                    About
                </motion.h2>
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="w-16 h-0.5 bg-accent-blue mx-auto mb-16 rounded-full"
                />

                <div className="rounded-2xl border border-line bg-card p-6 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">

                        {/* LEFT COLUMN: identity + bio + details */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Lead with the name */}
                            <h3 className="text-3xl md:text-4xl font-extrabold text-primary leading-none">
                                Vineeth Sagar H L
                            </h3>
                            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-accent-blue">
                                AI / ML Engineer &middot; Full-Stack Developer
                            </p>

                            {/* Bio */}
                            <div className="mt-6 space-y-4 text-secondary leading-relaxed text-base">
                                <p>
                                    BMSIT&amp;M undergraduate specializing in AI and Machine Learning, with hands-on
                                    experience training models and shipping full-stack products. Currently going deeper
                                    on cybersecurity and applied finance &mdash; building secure, data-driven systems.
                                </p>
                            </div>

                            {/* Metrics row */}
                            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-6">
                                {METRICS.map((m) => (
                                    <div key={m.label}>
                                        <p className="text-xl md:text-2xl font-extrabold text-primary">{m.value}</p>
                                        <p className="mt-1 text-[11px] uppercase tracking-wider text-secondary">{m.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Contact details */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                <Detail label="Email">
                                    <a
                                        href="mailto:vineethsagarhl0@gmail.com"
                                        className="text-primary text-sm font-semibold hover:text-accent-blue transition-colors break-all"
                                    >
                                        vineethsagarhl0@gmail.com
                                    </a>
                                </Detail>
                                <Detail label="Location">
                                    <p className="text-primary text-sm font-semibold">Bangalore, Karnataka</p>
                                </Detail>
                                <Detail label="Availability">
                                    <p className="text-primary text-sm font-semibold flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                        Open to opportunities
                                    </p>
                                </Detail>
                            </div>

                            {/* Resume + socials */}
                            <div className="mt-8 flex flex-col sm:flex-row items-center gap-5 justify-between">
                                <a
                                    href="/resume.pdf"
                                    download="Vineeth_Sagar_Resume.pdf"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue text-white rounded-md font-semibold text-sm tracking-wide transition-colors hover:bg-[#1a7fe0]"
                                >
                                    Download Resume <FaDownload />
                                </a>

                                <div className="flex items-center gap-3">
                                    <SocialLink href="https://www.linkedin.com/in/vineeth-sagar-h-l" icon={<FaLinkedin />} label="LinkedIn" />
                                    <SocialLink href="https://github.com/Vineeth-Sagar" icon={<FaGithub />} label="GitHub" />
                                    <SocialLink href="https://www.instagram.com/vineeth_sagar006" icon={<FaInstagram />} label="Instagram" />
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT COLUMN: 3D physics ID badge on a lanyard */}
                        <div className="h-[520px] md:h-[600px] w-full">
                            <LanyardCard photo="/assets/CLG-IMAGE.jpg" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Detail = ({ label, children }) => (
    <div>
        <h4 className="text-secondary text-[11px] font-medium uppercase tracking-wider mb-1">{label}</h4>
        {children}
    </div>
);

const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-md flex items-center justify-center text-secondary text-lg border border-line transition-colors hover:text-primary hover:border-accent-blue"
        aria-label={label}
    >
        {icon}
    </a>
);

export default About;
