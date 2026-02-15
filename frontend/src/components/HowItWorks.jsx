import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Droplet, CalendarCheck } from 'lucide-react';

const StepCard = ({ icon: Icon, title, description, step }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-primary select-none group-hover:opacity-20 transition-opacity">
                {step}
            </div>
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-3">{title}</h3>
            <p className="text-neutral-600 leading-relaxed">{description}</p>
        </motion.div>
    );
};

const HowItWorks = () => {
    const steps = [
        {
            icon: MapPin,
            title: "Choose Location",
            description: "Enter your delivery location. We service construction sites, business parks, and remote areas."
        },
        {
            icon: Droplet,
            title: "Select Fuel & Quantity",
            description: "Choose between Diesel, Petrol, or AdBlue and specify the amount you need for your fleet."
        },
        {
            icon: CalendarCheck,
            title: "Schedule & Pay",
            description: "Pick a convenient time slot and pay securely. Track your delivery in real-time."
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-green-50/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                        Refueling Made Simple
                    </h2>
                    <p className="text-neutral-600 text-lg">
                        Order fuel in 3 easy steps and keep your operations running without interruption.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <StepCard
                            key={index}
                            {...step}
                            step={index + 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
