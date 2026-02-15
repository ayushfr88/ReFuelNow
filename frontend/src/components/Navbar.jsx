import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLoginClick = () => navigate('/login');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Solutions', href: '#', hasDropdown: true },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Company', href: '#company' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white">
                        <Droplet size={20} fill="currentColor" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-neutral-800">
                        Refuel<span className="text-primary">Now</span>
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <div key={link.name} className="relative group">
                            <a
                                href={link.href}
                                className="text-neutral-600 hover:text-primary font-medium text-sm transition-colors flex items-center gap-1"
                            >
                                {link.name}
                                {link.hasDropdown && <ChevronDown size={14} />}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Button variant="primary" className="px-5 py-2" onClick={handleLoginClick}>Order Fuel</Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-neutral-700 p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-neutral-100 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4 flex flex-col">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-neutral-700 font-medium py-2 border-b border-neutral-50 last:border-0"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-4 flex flex-col gap-3">
                                <Button variant="primary" className="w-full justify-center" onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleLoginClick();
                                }}>Order Fuel</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
