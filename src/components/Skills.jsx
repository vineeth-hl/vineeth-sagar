import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaReact, FaJs, FaHtml5, FaCss3Alt, FaJava, FaPython,
    FaGithub, FaDocker, FaDatabase, FaGitAlt, FaFilm, FaCameraRetro, FaCode
} from 'react-icons/fa';
import {
    SiTensorflow, SiPytorch, SiScikitlearn, SiNumpy, SiPandas,
    SiNextdotjs
} from 'react-icons/si';

const tabs = [
    { id: 'languages', label: 'Languages' },
    { id: 'frameworks', label: 'Frameworks' },
    { id: 'tools', label: 'Tools' },
];

const techData = {
    languages: [
        { name: 'Java', icon: <FaJava />, color: '#007396' },
        { name: 'C', icon: <FaCode />, color: '#A8B9CC' }, // Fallback from SiC
        { name: 'Python', icon: <FaPython />, color: '#3776AB' },
        { name: 'HTML5', icon: <FaHtml5 />, color: '#E34F26' },
        { name: 'CSS3', icon: <FaCss3Alt />, color: '#1572B6' },
        { name: 'JavaScript', icon: <FaJs />, color: '#F7DF1E' },
        { name: 'MATLAB', icon: <FaCode />, color: '#e16737' }, // Fallback
    ],
    frameworks: [
        { name: 'TensorFlow', icon: <SiTensorflow />, color: '#FF6F00' },
        { name: 'PyTorch', icon: <SiPytorch />, color: '#EE4C2C' },
        { name: 'Scikit-learn', icon: <SiScikitlearn />, color: '#F7931E' },
        { name: 'NumPy', icon: <SiNumpy />, color: '#013243' },
        { name: 'Pandas', icon: <SiPandas />, color: '#150458' },
        { name: 'Next.js', icon: <SiNextdotjs />, color: '#ffffff' },
        { name: 'React', icon: <FaReact />, color: '#61DAFB' },
    ],
    tools: [
        {
            category: 'Development Tools',
            items: [
                { name: 'GitHub', icon: <FaGithub />, color: '#ffffff' },
                { name: 'Git', icon: <FaGitAlt />, color: '#F05032' },
                { name: 'Docker', icon: <FaDocker />, color: '#2496ED' },
                { name: 'VS Code', icon: <FaCode />, color: '#007ACC' }, // Fallback
                { name: 'n8n', icon: <FaCode />, color: '#FF6584' }, // Fallback
            ]
        },
        {
            category: 'Creative / Media',
            items: [
                { name: 'DaVinci Resolve', icon: <FaFilm />, color: '#ffffff' },
                { name: 'CapCut', icon: <FaFilm />, color: '#000000' },
                { name: 'VN', icon: <FaFilm />, color: '#ffffff' },
                { name: 'Lightroom', icon: <FaCameraRetro />, color: '#31A8FF' },
            ]
        },
        {
            category: 'Data',
            items: [
                { name: 'SQL', icon: <FaDatabase />, color: '#4479A1' },
            ]
        }
    ]
};

const Skills = () => {
    const [activeTab, setActiveTab] = useState('languages');

    return (
        <section id="skills" className="relative py-32 px-6 md:px-12 min-h-screen bg-black overflow-hidden">
            {/* Background Elements */}
            <motion.div
                animate={{ backgroundPosition: ["0rem 0rem", "4rem 4rem"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black z-0 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-purple/30 blur-[120px] rounded-full z-0" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-center mb-4 tracking-tight bg-gradient-to-r from-white via-accent-purple to-purple-500 bg-clip-text text-transparent"
                    >
                        TECH ARSENAL
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="h-1.5 w-24 bg-gradient-to-r from-accent-purple to-purple-500 mx-auto rounded-full"
                    />
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center gap-4 mb-16">
                    <div className="flex flex-wrap justify-center gap-2 p-1 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-50" />
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'tools' ? (
                            <ToolsView tools={techData.tools} />
                        ) : (
                            <GridView items={techData[activeTab]} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

const GridView = ({ items }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
            <SpotlightCard key={item.name} item={item} />
        ))}
    </div>
);

const ToolsView = ({ tools }) => (
    <div className="space-y-12">
        {tools.map((category, idx) => (
            category.items && category.items.length > 0 && (
                <div key={idx}>
                    <h3 className="text-xl font-bold mb-6 pl-4 border-l-4 border-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block">
                        {category.category}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {category.items.map((item) => (
                            <SpotlightCard key={item.name} item={item} />
                        ))}
                    </div>
                </div>
            )
        ))}
    </div>
);

const SpotlightCard = ({ item }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 h-full flex flex-col items-center justify-center gap-4 group min-h-[140px] hover:border-[var(--card-color)] transition-colors duration-500"
            style={{ '--card-color': item.color }}
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`
                }}
            />

            <div
                className="relative z-10 text-4xl text-gray-500 transition-all duration-300 group-hover:text-[var(--hover-color)] group-hover:drop-shadow-[0_0_20px_var(--hover-color)]"
                style={{ '--hover-color': item.color }}
            >
                {item.icon}
            </div>
            <h3
                className="relative z-10 text-lg font-bold tracking-wide text-gray-400 group-hover:text-[var(--text-color)] transition-colors duration-300 text-center"
                style={{ '--text-color': item.color }}
            >
                {item.name}
            </h3>
        </motion.div>
    );
};

export default Skills;
