import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaInstagram, FaPaperPlane, FaPhoneAlt } from 'react-icons/fa';

const Contact = () => {
    return (
        <section id="contact" className="relative py-28 px-6 md:px-12 bg-background border-t border-line">
            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-accent-gold"
                    >
                        Get in Touch
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="h-0.5 w-16 bg-accent-blue mx-auto rounded-full"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Left: Contact info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-card border border-line p-6 md:p-8 rounded-lg h-full flex flex-col gap-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-primary mb-3">Contact Information</h3>
                            <p className="text-secondary text-sm leading-relaxed">
                                Open to internships, collaborations and interesting problems. The fastest way to reach me
                                is email.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <ContactItem icon={<FaEnvelope />} label="Email" value="vineethsagarhl0@gmail.com" href="mailto:vineethsagarhl0@gmail.com" />
                            <ContactItem icon={<FaPhoneAlt />} label="Phone" value="+91 70196 87761" href="tel:+917019687761" />
                            <ContactItem icon={<FaLinkedin />} label="LinkedIn" value="Vineeth Sagar H L" href="https://www.linkedin.com/in/vineeth-sagar-h-l" />
                            <ContactItem icon={<FaGithub />} label="GitHub" value="Vineeth-Sagar" href="https://github.com/Vineeth-Sagar" />
                            <ContactItem icon={<FaInstagram />} label="Instagram" value="@vineeth_sagar006" href="https://www.instagram.com/vineeth_sagar006" />
                        </div>
                    </motion.div>

                    {/* Right: Message form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-card border border-line p-6 md:p-8 rounded-lg h-full flex flex-col"
                    >
                        <h3 className="text-xl font-bold text-primary mb-6">Send a Message</h3>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <Field label="Your Name">
                                <input type="text" name="name" className={inputCls} placeholder="Jane Doe" />
                            </Field>
                            <Field label="Your Email">
                                <input type="email" name="email" className={inputCls} placeholder="jane@example.com" />
                            </Field>
                            <Field label="Subject">
                                <input type="text" name="subject" className={inputCls} placeholder="Project discussion" />
                            </Field>
                            <Field label="Your Message">
                                <textarea rows="4" name="message" className={`${inputCls} resize-none`} placeholder="How can I help?" />
                            </Field>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-md bg-accent-blue text-white font-semibold text-sm tracking-wide hover:bg-[#1a7fe0] transition-colors flex items-center justify-center gap-2 group"
                            >
                                Send Message
                                <FaPaperPlane className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const inputCls =
    'w-full bg-background border border-line rounded-md px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-accent-blue transition-colors text-sm';

const Field = ({ label, children }) => (
    <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-secondary uppercase tracking-wider">{label}</label>
        {children}
    </div>
);

const ContactItem = ({ icon, label, value, href }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 group p-3 rounded-md border border-transparent hover:border-line hover:bg-background transition-colors"
    >
        <div className="w-10 h-10 rounded-md bg-background flex items-center justify-center text-base border border-line text-secondary group-hover:text-accent-blue transition-colors">
            {icon}
        </div>
        <div>
            <h4 className="text-secondary text-[11px] font-medium uppercase tracking-wider mb-0.5">{label}</h4>
            <p className="text-primary text-sm font-semibold group-hover:text-accent-blue transition-colors break-all">{value}</p>
        </div>
    </a>
);

export default Contact;
