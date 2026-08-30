import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaDownload, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';

const getInitialTheme = () => {
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('light')) {
        return 'light';
    }
    return 'dark';
};

const Navbar = () => {
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            /* storage unavailable — ignore */
        }
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

    const handleDownload = () => {
        setIsDownloaded(true);
        setTimeout(() => setIsDownloaded(false), 3000);
    };

    const navLinks = ['About', 'Skills', 'Projects', 'Achievements', 'Contact'];

    const ThemeToggle = ({ className = '' }) => (
        <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className={`flex h-8 w-8 items-center justify-center rounded-md border border-line text-secondary hover:text-accent-gold hover:border-accent-gold transition-colors ${className}`}
        >
            {theme === 'dark' ? <FaSun size={13} /> : <FaMoon size={13} />}
        </button>
    );

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 3.0 }}
            className="fixed top-6 inset-x-0 mx-auto z-[100] w-[95%] max-w-2xl px-0 md:px-4"
        >
            <div className="relative flex items-center justify-center px-5 py-3 rounded-lg bg-background/80 backdrop-blur-md border border-line">

                {/* --- MOBILE VIEW: Name + toggle + Hamburger --- */}
                <div className="md:hidden flex items-center justify-between w-full">
                    <div className="text-base font-bold tracking-wide">
                        <span className="text-accent-blue">Vineeth</span>
                        <span className="text-primary ml-1.5">Sagar</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-secondary hover:text-primary transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>
                </div>

                {/* --- DESKTOP VIEW: Links + toggle + Resume --- */}
                <div className="hidden md:flex items-center justify-center gap-6 w-full">
                    <ul className="flex gap-6 text-sm font-medium text-secondary">
                        {navLinks.map((item) => (
                            <li key={item}>
                                <a
                                    href={`#${item.toLowerCase()}`}
                                    className="hover:text-primary transition-colors relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-blue transition-all group-hover:w-full" />
                                </a>
                            </li>
                        ))}
                    </ul>

                    <ThemeToggle />

                    <a href="/resume.pdf" download="Vineeth_Sagar_Resume.pdf" onClick={handleDownload}>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className={`relative overflow-hidden px-5 py-2 rounded-md font-semibold text-sm transition-colors duration-200 ${isDownloaded
                                ? 'bg-emerald-500 text-white'
                                : 'bg-accent-blue text-white hover:bg-[#1a7fe0]'
                                }`}
                        >
                            <AnimatePresence mode="wait">
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
                        className="md:hidden mt-2 rounded-lg bg-background border border-line overflow-hidden"
                    >
                        <ul className="flex flex-col p-4 gap-3 text-center">
                            {navLinks.map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="block text-secondary hover:text-primary text-base font-medium py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                            <li className="pt-2 border-t border-line">
                                <a
                                    href="/resume.pdf"
                                    download="Vineeth_Sagar_Resume.pdf"
                                    onClick={() => {
                                        handleDownload();
                                        setTimeout(() => setIsMobileMenuOpen(false), 500);
                                    }}
                                    className="flex items-center justify-center gap-2 text-accent-blue font-bold"
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
