import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaDownload, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleDownload = () => {
        setIsDownloaded(true);
        setTimeout(() => setIsDownloaded(false), 3000); // Reset after 3s
    };

    const navLinks = ['About', 'Skills', 'Projects', 'Achievements', 'Contact'];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-6 inset-x-0 mx-auto z-[100] w-[95%] max-w-2xl px-0 md:px-4"
        >
            <div className="relative flex items-center justify-center px-6 py-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">

                {/* --- MOBILE VIEW: Name + Hamburger --- */}
                <div className="md:hidden flex items-center justify-between w-full">
                    <div className="text-lg font-bold tracking-wide">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Vineeth</span>
                        <span className="text-white ml-2">Sagar</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white/80 hover:text-white transition-colors focus:outline-none"
                    >
                        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>

                {/* --- DESKTOP VIEW: Links + Resume --- */}
                <div className="hidden md:flex items-center justify-center gap-8 w-full">
                    {/* Links */}
                    <ul className="flex gap-6 text-sm font-medium text-gray-300">
                        {navLinks.map((item) => (
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
            </div>

            {/* --- MOBILE MENU DROPDOWN --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="md:hidden mt-2 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 overflow-hidden"
                    >
                        <ul className="flex flex-col p-4 gap-4 text-center">
                            {navLinks.map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="block text-gray-300 hover:text-white text-lg font-medium py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                            {/* Mobile Resume Button */}
                            <li className="pt-2 border-t border-white/10">
                                <a
                                    href="/resume.pdf"
                                    download="Resume"
                                    onClick={(e) => {
                                        handleDownload();
                                        // Wait a bit before closing so feedback is visible
                                        setTimeout(() => setIsMobileMenuOpen(false), 500);
                                    }}
                                    className="flex items-center justify-center gap-2 text-accent-cyan font-bold"
                                >
                                    <FaDownload /> Download Resume
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
