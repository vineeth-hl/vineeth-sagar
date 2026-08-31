import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';
import SectionFX from './common/SectionFX';

const projects = [
    {
        id: 1,
        title: 'Zero-Day Attack Detection',
        category: 'Cybersecurity & AI',
        description:
            'Temporal graph + LSTM-AE pipeline (Python, Kubernetes) for real-time behavioral anomaly detection. Hit 95.6% precision at 150ms latency with SHAP explainability and MITRE ATT&CK mapping.',
        image: '/assets/project_images/Zero_day.webp',
        tech: ['TGNN', 'LSTM-AE', 'DeepLog', 'Kubernetes', 'Python'],
        links: { github: 'https://github.com/Tejashwini2406/zero-day', live: null },
    },
    {
        id: 2,
        title: 'AgriGain — Agentic AI',
        category: 'Agentic AI',
        description:
            'Agent-driven system (Python, FastAPI, n8n) with modular orchestrators over 400+ research papers and market data. Outputs ROI computation and waste-processing insights.',
        image: '/assets/project_images/bioblome.png',
        tech: ['Agentic AI', 'n8n', 'Python', 'FastAPI', 'Orchestrators'],
        links: { github: 'https://github.com/Chinmay9535/agrigainAgent', live: null },
    },
    {
        id: 3,
        title: 'NetCDF RAG Pipeline',
        category: 'RAG & LLMs',
        description:
            'RAG system (Python, vector DB) that reads scientific NetCDF datasets. Custom preprocessing plus structured-output LLM reasoning for high-accuracy spatial-temporal queries.',
        image: '/assets/project_images/float_chart.png',
        tech: ['RAG Systems', 'LLMs', 'Vector DB', 'Python', 'NetCDF'],
        links: { github: 'https://github.com/Vineeth-Sagar/floatchat_prototype', live: null },
    },
];

const FeaturedProjects = () => {
    return (
        <section id="projects" className="py-24 px-6 md:px-12 bg-background relative overflow-hidden border-t border-line">
            <SectionFX variant="aurora" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-accent-gold"
                    >
                        Featured Projects
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="h-0.5 w-16 bg-accent-blue mx-auto rounded-full"
                    />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="group bg-card border border-line rounded-lg overflow-hidden hover:border-accent-blue/50 transition-colors duration-300 flex flex-col"
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden border-b border-line">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale-[35%] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <p className="text-[11px] font-medium uppercase tracking-wider text-accent-blue mb-2">
                    {project.category}
                </p>
                <h3 className="text-lg font-bold text-primary mb-2 transition-colors group-hover:text-accent-blue">
                    {project.title}
                </h3>

                <p className="text-secondary text-sm leading-relaxed mb-5 flex-grow">
                    {project.description}
                </p>

                {/* Tech pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {project.tech.map((tech, i) => (
                        <span
                            key={i}
                            className="px-2.5 py-1 text-[11px] font-medium text-secondary bg-background rounded border border-line"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Links */}
                <div className="flex items-center justify-between pt-4 border-t border-line">
                    <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm"
                    >
                        <FaGithub className="text-lg" />
                        Code
                    </a>

                    {project.links.live && (
                        <a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-md text-sm font-medium hover:bg-[#1a7fe0] transition-colors"
                        >
                            View Project
                            <HiArrowTopRightOnSquare />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default FeaturedProjects;
