import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { HiArrowTopRightOnSquare } from "react-icons/hi2";

const projects = [
    {
        id: 1,
        title: "Zero-Day Attack Detection",
        category: "Cybersecurity & AI",
        description: "Built an ML pipeline for zero-day attack detection in Kubernetes environments achieving 95.6% precision and 150ms latency. It integrates temporal graph construction with SHAP-based explainability and MITRE ATT&CK mapping for real-time behavioral anomaly detection.",
        image: "/assets/project_images/Zero_day.webp",
        tech: ["TGNN", "LSTM-AE", "DeepLog", "Kubernetes", "Python"],
        links: { github: "https://github.com/Tejashwini2406/zero-day", live: null }
    },
    {
        id: 2,
        title: "AgriGain — Agentic AI",
        category: "Agentic AI",
        description: "Developed an agent-driven AI system that processes 400+ research papers and market data to provide ROI computation and waste processing insights. The architecture features modular orchestrators, reasoning pipelines, and deployment-ready modular design.",
        image: "/assets/project_images/bioblome.png",
        tech: ["Agentic AI", "n8n", "Python", "FastAPI", "Orchestrators"],
        links: { github: "https://github.com/Chinmay9535/agrigainAgent", live: null }
    },
    {
        id: 3,
        title: "NetCDF RAG Pipeline",
        category: "RAG & LLMs",
        description: "Engineered a RAG system specifically designed to interpret and retrieve information from scientific NetCDF (.nc) spatial-temporal datasets. The pipeline incorporates custom preprocessing, vector search, and structured-output LLM reasoning for high-accuracy scientific queries.",
        image: "/assets/project_images/float_chart.png",
        tech: ["RAG Systems", "LLMs", "Vector DB", "Python", "NetCDF"],
        links: { github: "https://github.com/Vineeth-Sagar/floatchat_prototype", live: null }
    }
];

const FeaturedProjects = () => {
    return (
        <section id="projects" className="py-24 px-6 md:px-12 bg-black relative overflow-hidden">
            {/* Background Texture & Blobs */}
            <motion.div
                animate={{ backgroundPosition: ["0rem 0rem", "4rem 4rem"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"
            />

            {/* Animated Blobs */}
            <motion.div
                animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 left-10 w-96 h-96 bg-accent-purple/40 rounded-full blur-[100px] -z-10"
            />
            <motion.div
                animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] -z-10"
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-center mb-4 tracking-tight bg-gradient-to-r from-white via-accent-purple to-purple-500 bg-clip-text text-transparent"
                    >
                        Featured Projects
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="h-1.5 w-24 bg-gradient-to-r from-accent-purple to-purple-500 mx-auto rounded-full"
                    />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-accent-purple/30 transition-all duration-300 flex flex-col"
        >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-purple transition-colors">
                    {project.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                    {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, i) => (
                        <span key={i} className="px-3 py-1 text-xs font-medium text-gray-300 bg-white/5 rounded-full border border-white/5">
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        <FaGithub className="text-lg" />
                        Code
                    </a>

                    {project.links.live && (
                        <a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-purple to-pink-600 text-white rounded-lg text-sm font-medium hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
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
