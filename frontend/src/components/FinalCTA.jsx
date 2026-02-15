import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
    const navigate = useNavigate();
    return (
        <section className="py-24 bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Ready to Refuel the <br />
                        <span className="text-green-200">Smart Way?</span>
                    </h2>

                    <p className="text-xl text-green-50 mb-10">
                        Join 500+ businesses who trust RefuelNow for their daily fuel needs.
                        Get started today and experience the difference.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button variant="secondary" onClick={() => navigate('/login')} className="py-4 px-8 text-lg bg-white text-green-700 hover:bg-green-50 shadow-xl shadow-green-900/20">
                            Order Now
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
