import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Droplet, Phone, Mail, MapPin } from 'lucide-react';
import Logo from './ui/Logo';

const Footer = () => {
    return (
        <footer className="bg-neutral-900 text-neutral-400 py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Info */}
                    <div>
                        <div className="mb-6">
                            <Logo theme="dark" />
                        </div>
                        <p className="mb-6 leading-relaxed">
                            India's most trusted on-demand fuel delivery service. Smart, Safe, and Reliable refueling for your business.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    {/* Solutions Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Solutions</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-primary transition-colors">Fleet Refueling</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Generator Refueling</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Construction Sites</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Fuel Monitoring</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-primary shrink-0 mt-1" />
                                <span>123 Innovation Park, Tech City,<br />Bangalore, Karnataka 560100</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-primary shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-primary shrink-0" />
                                <span>support@refuelnow.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-neutral-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2024 RefuelNow Technologies Pvt Ltd. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
