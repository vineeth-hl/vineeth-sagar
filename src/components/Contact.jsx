import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaInstagram, FaPaperPlane, FaPhoneAlt, FaCheck } from 'react-icons/fa';

const TO_EMAIL = 'vineethsagarhl0@gmail.com';
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';

const Contact = () => {
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form));

        // No form backend configured -> hand off to the visitor's mail client.
        if (!WEB3FORMS_KEY) {
            const body = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
            window.location.href = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(
                data.subject || 'Portfolio contact'
            )}&body=${encodeURIComponent(body)}`;
            return;
        }

        setStatus('sending');
        setErrorMsg('');
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    from_name: data.name,
                    replyto: data.email,
                    subject: data.subject || `Portfolio message from ${data.name}`,
                    email: data.email,
                    message: data.message
                })
            });
            const json = await res.json();
            if (json.success) {
                setStatus('sent');
                form.reset();
            } else {
                setStatus('error');
                setErrorMsg(json.message || 'Something went wrong. Try email instead.');
            }
        } catch {
            setStatus('error');
            setErrorMsg('Network error. Try email instead.');
        }
    };

    const sending = status === 'sending';

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

                        {status === 'sent' ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                                    <FaCheck />
                                </div>
                                <p className="text-primary font-semibold">Message sent</p>
                                <p className="text-secondary text-sm">Thanks — I&apos;ll get back to you soon.</p>
                                <button
                                    type="button"
                                    onClick={() => setStatus('idle')}
                                    className="mt-2 text-xs font-medium uppercase tracking-wider text-accent-blue hover:underline"
                                >
                                    Send another
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <Field label="Your Name">
                                    <input type="text" name="name" required className={inputCls} placeholder="Jane Doe" />
                                </Field>
                                <Field label="Your Email">
                                    <input type="email" name="email" required className={inputCls} placeholder="jane@example.com" />
                                </Field>
                                <Field label="Subject">
                                    <input type="text" name="subject" className={inputCls} placeholder="Project discussion" />
                                </Field>
                                <Field label="Your Message">
                                    <textarea rows="4" name="message" required className={`${inputCls} resize-none`} placeholder="How can I help?" />
                                </Field>

                                {status === 'error' && (
                                    <p className="text-sm text-red-400">
                                        {errorMsg}{' '}
                                        <a href={`mailto:${TO_EMAIL}`} className="underline">
                                            email me directly
                                        </a>
                                        .
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full py-3 rounded-md bg-accent-blue text-white font-semibold text-sm tracking-wide hover:bg-[#1a7fe0] transition-colors flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {sending ? 'Sending…' : 'Send Message'}
                                    {!sending && (
                                        <FaPaperPlane className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    )}
                                </button>
                            </form>
                        )}
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
