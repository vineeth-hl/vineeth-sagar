import React from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaUniversity } from 'react-icons/fa';

const achievements = [
    {
        id: 1,
        title: "3rd Place in National Level Hackathon",
        details: "Winning the national-level hackathon at KSSEM was a high-octane experience in rapid innovation and resilient teamwork. Developing a functional prototype within 24 hours validated my technical expertise under intense pressure. This victory among talented national competitors significantly boosted my professional confidence and collaborative skills.",
        institute: "KSSEM",
        image: "/assets/achievements/hackioarchiv.jpg",
    },
    {
        id: 2,
        title: "2nd Prize in Institute Level Hackathon",
        details: "Winning 2nd prize in our 16-hour institute hackathon was a rewarding challenge that sharpened my ability to build impactful solutions under tight deadlines. It allowed me to bridge the gap between creative concepts and working models through intense peer collaboration. This recognition within my college community further fueled my passion for rapid prototyping and competitive coding.",
        institute: "BMSIT&M",
        image: "/assets/achievements/BBarchiv.jpg",
    }
];

const Achievements = () => {
    return (
        <section id="achievements" className="py-24 px-6 md:px-12 bg-black relative overflow-hidden border-t border-white/5">
            {/* Background Texture & Blobs */}
            <motion.div
                animate={{ backgroundPosition: ["0rem 0rem", "4rem 4rem"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"
            />
            <motion.div
                animate={{ x: [0, 50, 0], y: [0, 50, 0], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 -left-20 w-80 h-80 bg-accent-purple/40 rounded-full blur-[100px] -z-10"
            />
            <motion.div
                animate={{ x: [0, -50, 0], y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] -z-10"
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
                        Achievements
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {achievements.map((achievement, index) => (
                        <AchievementCard key={achievement.id} achievement={achievement} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const AchievementCard = ({ achievement, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300 flex flex-col"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                <img
                    src={achievement.image}
                    alt={achievement.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badge Overlay */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 z-20">
                    <FaTrophy className="text-yellow-500" />
                    <span className="text-xs text-white font-medium">Winner</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3 text-yellow-500 text-sm font-mono tracking-wider">
                    <FaUniversity />
                    <span>{achievement.institute}</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-500 transition-colors">
                    {achievement.title}
                </h3>

                <p className="text-gray-400 text-base leading-relaxed">
                    {achievement.details}
                </p>
            </div>
        </motion.div>
    );
};

export default Achievements;
