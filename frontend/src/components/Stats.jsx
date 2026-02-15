import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Truck, Users, MapPin, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, suffix = '+' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            // Simple counting animation
            let start = 0;
            const end = parseInt(value.replace(/,/g, ''));
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center p-6"
        >
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-primary">
                <Icon size={32} />
            </div>
            <h3 className="text-4xl font-bold text-neutral-800 mb-2">
                {count.toLocaleString()}{suffix}
            </h3>
            <p className="text-neutral-500 font-medium uppercase tracking-wider text-sm">{label}</p>
        </motion.div>
    );
};

const Stats = () => {
    const stats = [
        { icon: Truck, value: "10000", label: "Deliveries", suffix: "+" },
        { icon: Users, value: "500", label: "Business Clients", suffix: "+" },
        { icon: MapPin, value: "25", label: "Cities Covered", suffix: "+" },
        { icon: Clock, value: "99", label: "On-Time Delivery", suffix: "%" },
    ];

    return (
        <section className="py-20 bg-white border-b border-neutral-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
