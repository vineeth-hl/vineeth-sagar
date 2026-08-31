import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaReact, FaJs, FaHtml5, FaCss3Alt, FaJava, FaPython,
    FaGithub, FaDocker, FaDatabase, FaGitAlt, FaFilm, FaCameraRetro, FaCode
} from 'react-icons/fa';
import SectionFX from './common/SectionFX';
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
        <section id="skills" className="relative py-28 px-6 md:px-12 bg-background overflow-hidden border-t border-line">
            <SectionFX variant="orbs" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-accent-gold"
                    >
                        Tech Arsenal
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="h-0.5 w-16 bg-accent-blue mx-auto rounded-full"
                    />
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center gap-4 mb-16">
                    <div className="flex flex-wrap justify-center gap-1 p-1 bg-card rounded-md border border-line">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-2 rounded text-sm font-semibold transition-colors duration-200 ${activeTab === tab.id ? 'text-white' : 'text-secondary hover:text-primary'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-accent-blue rounded"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
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
                    <h3 className="text-lg font-bold mb-6 pl-3 border-l-2 border-accent-blue text-primary inline-block">
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
            className="relative overflow-hidden rounded-lg border border-line bg-card p-6 h-full flex flex-col items-center justify-center gap-4 group min-h-[140px] hover:border-[var(--card-color)] transition-colors duration-300"
            style={{ '--card-color': item.color }}
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgb(var(--accent) / 0.10), transparent 40%)`
                }}
            />

            <div
                className="relative z-10 text-4xl text-secondary transition-colors duration-300 group-hover:text-[var(--hover-color)]"
                style={{ '--hover-color': item.color }}
            >
                {item.icon}
            </div>
            <h3
                className="relative z-10 text-base font-semibold tracking-wide text-secondary group-hover:text-primary transition-colors duration-300 text-center"
            >
                {item.name}
            </h3>
        </motion.div>
    );
};

export default Skills;
