import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Smartphone } from 'lucide-react';
import Button from './ui/Button';

const AppPreview = () => {
    const features = [
        "Real-time order tracking",
        "Digital invoices & receipts",
        "Schedule recurring deliveries",
        "Multi-location management"
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-green-50 to-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">

                    {/* Phone Mockup (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 relative flex justify-center"
                    >
                        <div className="relative z-10 w-72 h-[580px] bg-neutral-900 rounded-[3rem] border-8 border-neutral-800 shadow-2xl overflow-hidden">
                            {/* Screen Content */}
                            <div className="w-full h-full bg-white relative">
                                {/* Top Bar */}
                                <div className="h-14 bg-primary text-white flex items-center justify-between px-4 pt-4">
                                    <span className="text-xs font-medium">9:41</span>
                                    <div className="flex gap-1">
                                        <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                                        <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                                    </div>
                                </div>

                                {/* App UI Placeholder */}
                                <div className="p-4 space-y-4 bg-neutral-50 h-full">
                                    <div className="h-32 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-medium">
                                        Map View
                                    </div>
                                    <div className="h-20 bg-white rounded-xl shadow-sm p-3">
                                        <div className="w-1/2 h-3 bg-neutral-100 rounded mb-2"></div>
                                        <div className="w-3/4 h-3 bg-neutral-100 rounded"></div>
                                    </div>
                                    <div className="h-20 bg-white rounded-xl shadow-sm p-3">
                                        <div className="w-1/2 h-3 bg-neutral-100 rounded mb-2"></div>
                                        <div className="w-3/4 h-3 bg-neutral-100 rounded"></div>
                                    </div>
                                    <div className="h-12 bg-primary rounded-lg mt-4 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-green-500/20">
                                        Track Order
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-3xl -z-10"></div>
                    </motion.div>

                    {/* Text Content (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
                            <Smartphone size={16} /> Mobile App
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-6 leading-tight">
                            Manage Fuel From <br className="hidden md:block" />
                            <span className="text-primary">Anywhere, Anytime.</span>
                        </h2>
                        <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                            Take full control of your fuel logistics with our powerful mobile app. Order fuel, track deliveries, and manage payments all from your pocket.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3 text-neutral-700">
                                    <CheckCircle size={20} className="text-accent" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="secondary" className="px-6 py-3">
                                App Store
                            </Button>
                            <Button variant="outline" className="px-6 py-3">
                                Google Play
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AppPreview;
