import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

const BusinessSolutions = () => {
    return (
        <section className="py-24 bg-primary relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20 inline-block mb-6">
                        For Enterprise & Construction
                    </span>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Power Your Fleet with <br />
                        <span className="text-green-200">Smart Fuel Management</span>
                    </h2>

                    <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto">
                        Get customized fuel solutions, automated reporting, and priority support for your business needs. Save up to 20% on operational costs.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button variant="secondary" className="py-4 text-lg bg-white text-primary hover:bg-green-50">
                            Talk to Sales
                        </Button>
                        <Button variant="outline" className="py-4 text-lg border-white text-white hover:bg-white/10 hover:border-white">
                            View Case Studies
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BusinessSolutions;
