import React from 'react';
import { Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = ({ className = "", iconSize = 20, textSize = "text-xl", theme = "light" }) => {
    const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
    const highlightColor = theme === 'dark' ? 'text-green-400' : 'text-green-600';

    return (
        <Link to="/" className={`flex items-center gap-2 cursor-pointer ${className}`}>
            <div className={`w-8 h-8 bg-gradient-to-br from-green-600 to-green-400 rounded-lg flex items-center justify-center text-white ${theme === 'light' ? 'shadow-sm shadow-green-200' : ''}`}>
                <Droplet size={iconSize} fill="currentColor" strokeWidth={2.5} />
            </div>
            <span className={`${textSize} font-bold tracking-tight ${textColor}`}>
                Refuel<span className={highlightColor}>Now</span>
            </span>
        </Link>
    );
};

export default Logo;
