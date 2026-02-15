import React from 'react';
import { motion } from 'framer-motion';
import { Fuel, Truck, Zap, HardHat, AlertTriangle, ArrowRight } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm hover:shadow-xl hover:border-green-100 transition-all duration-300 group"
        >
            <div className="w-12 h-12 bg-neutral-50 rounded-lg flex items-center justify-center mb-4 text-neutral-600 group-hover:bg-green-50 group-hover:text-primary transition-colors">
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-neutral-600 text-sm mb-4 line-clamp-3">{description}</p>
            <a href="#" className="inline-flex items-center text-sm font-semibold text-primary/80 hover:text-primary gap-1 group/link">
                Learn more <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </a>
        </motion.div>
    );
};

const Services = () => {
    const services = [
        {
            icon: Truck,
            title: "Diesel Delivery",
            description: "High-quality diesel delivered directly to your equipment or generator."
        },
        {
            icon: Fuel,
            title: "Petrol Delivery",
            description: "Regular and premium petrol delivery for corporate fleets and private vehicles."
        },
        {
            icon: Truck,
            title: "Fleet Refueling",
            description: "Schedule recurring fill-ups for your entire logistics fleet during downtime."
        },
        {
            icon: Zap,
            title: "Generator Refueling",
            description: "Keep your backup power running with automated generator refueling services."
        },
        {
            icon: HardHat,
            title: "Construction Supply",
            description: "On-site fuel delivery for cranes, excavators, and heavy machinery."
        },
        {
            icon: AlertTriangle,
            title: "Emergency Delivery",
            description: "24/7 express delivery for critical fuel shortages and operational emergencies."
        }
    ];

    return (
        <section id="services" className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Our Services</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800">
                            Comprehensive Fuel Solutions
                        </h2>
                    </div>
                    <button className="text-neutral-600 font-medium hover:text-primary transition-colors flex items-center gap-2">
                        View All Services <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
