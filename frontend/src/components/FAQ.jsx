import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-neutral-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-6 text-left focus:outline-none"
            >
                <span className="text-lg font-semibold text-neutral-800">{question}</span>
                <span className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'bg-neutral-50 text-neutral-500'}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-neutral-600 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "Is doorstep fuel delivery legal?",
            answer: "Yes, absolutely. RefuelNow is fully compliant with the Petroleum and Explosives Safety Organization (PESO) regulations. Our mobile refuellers are certified and follow strict safety protocols."
        },
        {
            question: "How is fuel quality ensured?",
            answer: "We source fuel directly from certified oil company terminals. Our smart trucks are equipped with tamper-proof digital meters and quality testing kits to ensure you get 100% pure quantity and quality."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept all major digital payment modes including Credit/Debit Cards, Net Banking, UPI, and Wallet payments. For corporate clients, we also offer credit terms subject to approval."
        },
        {
            question: "Can I schedule recurring deliveries?",
            answer: "Yes! Our platform allows you to set up automated recurring orders based on your consumption patterns, so you never have to worry about running dry again."
        }
    ];

    return (
        <section id="faq" className="py-24 bg-neutral-50/50">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-neutral-600">
                        Everything you need to know about our service.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
