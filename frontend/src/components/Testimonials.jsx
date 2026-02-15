import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Rajesh Kumar",
        role: "Fleet Manager",
        company: "LogiTrans India",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        text: "RefuelNow has completely transformed how we manage our fleet. The on-time delivery and digital tracking have saved us countless man-hours and prevented fuel theft."
    },
    {
        id: 2,
        name: "Sarah Williams",
        role: "Site Supervisor",
        company: "BuildTech Constructions",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        text: "We used to struggle with refueling our heavy machinery on remote sites. Now, RefuelNow delivers directly to our excavators, ensuring zero downtime."
    },
    {
        id: 3,
        name: "Amit Patel",
        role: "Operations Director",
        company: "GreenCity Generators",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        text: "The automated scheduling feature is a lifesaver. Our backup generators are always topped up, and the fuel quality is consistently excellent."
    }
];

const Testimonials = () => {
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm">Testimonials</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mt-2">
                        Trusted by Industry Leaders
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="overflow-hidden p-4">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="bg-neutral-50 rounded-2xl p-8 md:p-12 shadow-sm border border-neutral-100 text-center"
                            >
                                <div className="flex justify-center mb-6 text-primary/20">
                                    <Quote size={48} fill="currentColor" />
                                </div>

                                <p className="text-xl md:text-2xl text-neutral-700 font-medium italic mb-8 leading-relaxed">
                                    "{testimonials[current].text}"
                                </p>

                                <div className="flex flex-col items-center">
                                    <img
                                        src={testimonials[current].image}
                                        alt={testimonials[current].name}
                                        className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-white shadow-md"
                                    />
                                    <h4 className="text-lg font-bold text-neutral-900">{testimonials[current].name}</h4>
                                    <p className="text-neutral-500 text-sm">
                                        {testimonials[current].role}, {testimonials[current].company}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prev}
                        className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 p-3 rounded-full bg-white shadow-md hover:bg-neutral-50 text-neutral-600 hover:text-primary transition-colors border border-neutral-100"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <button
                        onClick={next}
                        className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 p-3 rounded-full bg-white shadow-md hover:bg-neutral-50 text-neutral-600 hover:text-primary transition-colors border border-neutral-100"
                    >
                        <ArrowRight size={20} />
                    </button>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === current ? 'bg-primary w-6' : 'bg-neutral-300 hover:bg-neutral-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
