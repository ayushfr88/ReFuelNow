import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    const handleOrderClick = () => navigate('/login');
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2079&q=80"
                    alt="Fuel Delivery Truck"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-900/70 to-green-900/30"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            #1 Fuel Delivery Service
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                            Fuel Delivered. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Smarter. Faster. Safer.</span>
                        </h1>

                        <p className="text-xl text-neutral-200 mb-8 max-w-2xl leading-relaxed">
                            Experience the future of fuel logistics. We deliver high-quality diesel and petrol directly to your fleet, generator, or construction site—anytime, anywhere.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="primary" className="py-4 text-lg" onClick={handleOrderClick}>
                                Order Now <ArrowRight size={20} />
                            </Button>
                            <ScrollLink to="how-it-works-video" smooth={true} offset={-80} duration={800}>
                                <Button variant="outline" className="py-4 text-lg border-white text-white hover:bg-white/10 hover:border-white w-full sm:w-auto">
                                    <Play size={20} className="fill-current" /> Watch Demo
                                </Button>
                            </ScrollLink>
                        </div>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="mt-12 flex items-center gap-6 text-white/60 text-sm font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Standard Compliant
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            24/7 Support
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Eco-Friendly
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
