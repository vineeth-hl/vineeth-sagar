import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-black py-8 px-6 md:px-12 border-t border-white/10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Left Side: Name & Copyright */}
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2">
                        <span className="text-pink-500">Vineeth</span> <span className="text-white">Sagar H L</span>
                    </h2>
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Vineeth Sagar H L. All rights reserved.
                    </p>
                </div>

                {/* Right Side: Social Icons */}
                <div className="flex gap-6">
                    <SocialLink href="https://github.com/Vineeth-Sagar" icon={<FaGithub />} />
                    <SocialLink href="https://www.linkedin.com/in/vineeth-sagar-h-l" icon={<FaLinkedin />} />
                    <SocialLink href="https://www.instagram.com/vineeth_sagar006" icon={<FaInstagram />} />
                    <SocialLink href="mailto:vineethsagarhl0@gmail.com" icon={<FaEnvelope />} />
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white text-xl transition-colors duration-300"
    >
        {icon}
    </a>
);

export default Footer;
