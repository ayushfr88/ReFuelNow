import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-primary hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30 hover:scale-105",
        secondary: "bg-accent hover:bg-green-500 text-white shadow-md hover:shadow-green-400/30 hover:scale-105",
        outline: "border-2 border-neutral-200 text-neutral-700 hover:border-primary hover:text-primary hover:bg-green-50",
        ghost: "text-neutral-600 hover:text-primary hover:bg-green-50/50",
        gradient: "bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-green-500/40 hover:scale-105",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
