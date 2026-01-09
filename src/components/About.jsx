import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaInstagram, FaDownload, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const About = () => {
    return (
        <section id="about" className="relative py-20 bg-black overflow-hidden">
            {/* Background Elements */}
            <motion.div
                animate={{ backgroundPosition: ["0rem 0rem", "4rem 4rem"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black z-0 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-purple/30 blur-[120px] rounded-full z-0" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight bg-gradient-to-r from-white via-accent-purple to-purple-500 bg-clip-text text-transparent"
                >
                    About Me
                </motion.h2>
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="w-24 h-1.5 bg-gradient-to-r from-accent-purple to-purple-500 mx-auto -mt-12 mb-16 rounded-full"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">

                    {/* LEFT COLUMN: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-full min-h-[500px] rounded-3xl overflow-hidden group border border-white/10"
                    >
                        <img
                            src="/assets/CLG-IMAGE.jpg"
                            alt="Vineeth Sagar H L"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Overlay: Available for Work */}
                        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 border border-white/10 shadow-lg">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-white text-sm font-medium tracking-wide">Available for work</span>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Bio & Details Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10"
                    >
                        {/* Bio Text */}
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
                            <p>
                                I am a BMSIT&M undergraduate specializing in AI and Machine Learning, with practical experience in training models and exploring IoT. My toolkit combines full-stack web development  with UI/UX design and intermediate problem-solving. Driven by a multidisciplinary approach, I am also deepening my expertise in Cybersecurity and Finance, aiming to build secure, data-driven solutions at the intersection of intelligence and investment strategy.
                            </p>
                            <p>
                                Beyond tech, I stay energized through traveling and karting, which keep my perspective broad and my competitive spirit sharp. When unwinding, I enjoy the creative storytelling of manga and novels. This balance of technical curiosity and personal exploration drives my commitment to learning and contributing to the next wave of global innovation.
                            </p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-10 pt-10 border-t border-white/10">
                            <div>
                                <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Name</h4>
                                <p className="text-white text-lg font-semibold">Vineeth Sagar H L</p>
                            </div>
                            <div>
                                <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Email</h4>
                                <a href="mailto:vineethsagarhl0@gmail.com" className="text-white text-lg font-semibold hover:text-accent-purple transition-colors">
                                    vineethsagarhl0@gmail.com
                                </a>
                            </div>
                            <div>
                                <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Location</h4>
                                <p className="text-white text-lg font-semibold">Bangalore, Karnataka</p>
                            </div>
                            <div>
                                <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Availability</h4>
                                <p className="text-green-400 text-lg font-semibold flex items-center gap-2">
                                    Open to opportunities
                                </p>
                            </div>
                        </div>

                        {/* Layout: Button & Socials */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                            {/* Download Button */}
                            <a
                                href="/resume.pdf"
                                download="Vineeth_Sagar_Resume.pdf"
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-sm tracking-wide overflow-hidden transition-all hover:bg-gray-200"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Download Resume <FaDownload />
                                </span>
                            </a>

                            {/* Social Icons */}
                            <div className="flex items-center gap-4">
                                <SocialLink href="https://www.linkedin.com/in/vineeth-sagar-h-l" icon={<FaLinkedin />} label="LinkedIn" />
                                <SocialLink href="https://github.com/Vineeth-Sagar" icon={<FaGithub />} label="GitHub" />
                                <SocialLink href="https://www.instagram.com/vineeth_sagar006" icon={<FaInstagram />} label="Instagram" />
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// Helper Component for Social Icons
const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white text-xl border border-white/10 transition-all hover:bg-accent-purple hover:border-accent-purple hover:scale-110"
        aria-label={label}
    >
        {icon}
    </a>
);

export default About;
