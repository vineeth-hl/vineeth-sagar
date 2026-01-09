import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaDownload } from 'react-icons/fa';

const Navbar = () => {
    const [isDownloaded, setIsDownloaded] = useState(false);

    const handleDownload = () => {
        setIsDownloaded(true);
        setTimeout(() => setIsDownloaded(false), 3000); // Reset after 3s
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
        >
            <div className="flex items-center justify-between px-6 py-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                {/* Logo */}
                <a href="#" className="mr-8">
                    <img src="/assets/V_logo.png" alt="Logo" className="w-8 h-8 object-contain hover:scale-110 transition-transform" />
                </a>

                {/* Links */}
                <ul className="flex gap-6 text-sm font-medium text-gray-300">
                    {['About', 'Skills', 'Projects', 'Achievements', 'Contact'].map((item) => (
                        <li key={item}>
                            <a
                                href={`#${item.toLowerCase()}`}
                                className="hover:text-white transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-purple transition-all group-hover:w-full" />
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Resume Button */}
                <a
                    href="/resume.pdf"
                    download="Resume"
                    onClick={handleDownload}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative overflow-hidden px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${isDownloaded
                            ? 'bg-green-500 text-white'
                            : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                            }`}
                    >
                        <AnimatePresence mode='wait'>
                            {isDownloaded ? (
                                <motion.div
                                    key="success"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <FaCheck /> <span>Downloaded</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="download"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <FaDownload className="text-xs" /> <span>Resume</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </a>
            </div>
        </motion.nav>
    );
};

export default Navbar;
