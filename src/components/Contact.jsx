import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaInstagram, FaPaperPlane, FaPhoneAlt } from 'react-icons/fa';

const Contact = () => {
    return (
        <section id="contact" className="relative py-32 px-6 md:px-12 min-h-screen bg-black overflow-hidden relative">
            {/* Background Elements */}
            <motion.div
                animate={{ backgroundPosition: ["0rem 0rem", "4rem 4rem"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black z-0 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-purple/30 blur-[120px] rounded-full z-0" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-center mb-4 tracking-tight bg-gradient-to-r from-white via-accent-purple to-purple-500 bg-clip-text text-transparent"
                    >
                        GET IN TOUCH
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="h-1.5 w-24 bg-gradient-to-r from-accent-purple to-purple-500 mx-auto rounded-full"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    {/* Left Column: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-zinc-900/50 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl h-full flex flex-col justify-between gap-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">Contact Information</h3>
                            <p className="text-gray-400 text-base leading-relaxed mb-6">
                                Connect with me through these platforms. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <ContactItem
                                icon={<FaPhoneAlt />}
                                label="Phone"
                                value="+91 7019687761"
                                href="tel:+917019687761"
                                color="text-green-400"
                            />
                            <ContactItem
                                icon={<FaEnvelope />}
                                label="Email"
                                value="vineethsagarhl0@gmail.com"
                                href="mailto:vineethsagarhl0@gmail.com"
                                color="text-red-400"
                            />
                            <ContactItem
                                icon={<FaLinkedin />}
                                label="LinkedIn"
                                value="Vineeth Sagar H L"
                                href="https://www.linkedin.com/in/vineeth-sagar-h-l"
                                color="text-blue-400"
                            />
                            <ContactItem
                                icon={<FaGithub />}
                                label="GitHub"
                                value="Vineeth-Sagar"
                                href="https://github.com/Vineeth-Sagar"
                                color="text-gray-200"
                            />
                            <ContactItem
                                icon={<FaInstagram />}
                                label="Instagram"
                                value="@vineeth_sagar006"
                                href="https://www.instagram.com/vineeth_sagar006"
                                color="text-pink-400"
                            />
                        </div>
                    </motion.div>

                    {/* Right Column: Message Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-zinc-900/50 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl h-full flex flex-col"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">Send Me a Message</h3>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all text-sm"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Your Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Subject</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all text-sm"
                                    placeholder="Discussion topic"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Your Message</label>
                                <textarea
                                    rows="4"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all resize-none text-sm"
                                    placeholder="How can I help you?"
                                />
                            </div>

                            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group">
                                Send Message
                                <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-xs" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const ContactItem = ({ icon, label, value, href, color }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 group hover:bg-white/5 p-3 rounded-xl transition-all"
    >
        <div className={`w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-xl border border-white/10 group-hover:scale-110 transition-transform ${color}`}>
            {icon}
        </div>
        <div>
            <h4 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1 group-hover:text-gray-300 transition-colors">{label}</h4>
            <p className="text-white text-base font-semibold group-hover:text-accent-purple transition-colors break-all">{value}</p>
        </div>
    </a>
);

export default Contact;
