import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Crosshair, CreditCard, Award } from 'lucide-react';

const FeatureBlock = ({ icon: Icon, title, description, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="p-8 border-l-4 border-transparent hover:border-primary bg-white hover:bg-neutral-50 transition-all duration-300"
        >
            <div className="mb-4 text-primary">
                <Icon size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-3">{title}</h3>
            <p className="text-neutral-600 leading-relaxed">{description}</p>
        </motion.div>
    );
};

const WhyChooseUs = () => {
    const features = [
        {
            icon: Award,
            title: "Certified Fuel Quality",
            description: "We source directly from refineries. Every drop is quality tested and guaranteed pure with zero adulteration."
        },
        {
            icon: Crosshair,
            title: "Real-Time Tracking",
            description: "Monitor your fuel delivery truck in real-time from dispatch to doorstep with our GPS-enabled fleet."
        },
        {
            icon: CreditCard,
            title: "Secure Digital Payments",
            description: "Hassle-free payments via UPI, Credit/Debit cards, or Net Banking with 256-bit encryption security."
        },
        {
            icon: ShieldCheck,
            title: "Compliant & Safe Delivery",
            description: "Our PESO-compliant smart refuellers follow strict safety protocols to ensure zero-spillage delivery."
        }
    ];

    return (
        <section className="py-24 bg-white border-t border-neutral-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm">Why Choose Us</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mt-2">
                        Redefining Fuel Delivery Standards
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
                    {features.map((feature, index) => (
                        <FeatureBlock key={index} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
