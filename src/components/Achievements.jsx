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
        <section id="achievements" className="py-24 px-6 md:px-12 bg-background relative border-t border-line">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-accent-gold"
                    >
                        Achievements
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
            className="group bg-card border border-line rounded-lg overflow-hidden hover:border-accent-blue/50 transition-colors duration-300 flex flex-col"
        >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden border-b border-line">
                <img
                    src={achievement.image}
                    alt={achievement.title}
                    className="w-full h-full object-cover grayscale-[35%] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                />

                {/* Badge Overlay */}
                <div className="absolute top-3 right-3 bg-background/90 px-3 py-1 rounded border border-line flex items-center gap-2 z-20">
                    <FaTrophy className="text-amber-400" />
                    <span className="text-xs text-primary font-medium">Winner</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-7 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3 text-accent-blue text-xs font-mono uppercase tracking-wider">
                    <FaUniversity />
                    <span>{achievement.institute}</span>
                </div>

                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent-blue transition-colors">
                    {achievement.title}
                </h3>

                <p className="text-secondary text-sm leading-relaxed">
                    {achievement.details}
                </p>
            </div>
        </motion.div>
    );
};

export default Achievements;
