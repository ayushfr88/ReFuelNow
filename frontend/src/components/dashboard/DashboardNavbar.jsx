import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardNavbar = ({ address, onEnableLocation, permissionStatus }) => {
    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white">
                            <span className="font-bold text-lg">R</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-neutral-900">
                            Refuel<span className="text-primary">Now</span>
                        </span>
                    </Link>

                    {/* Location Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="w-full bg-neutral-100 rounded-full px-4 py-2 flex items-center gap-3 border border-transparent hover:border-neutral-200 transition-all">
                            <MapPin size={18} className={permissionStatus === 'denied' ? 'text-red-500' : 'text-primary'} />

                            {permissionStatus === 'granted' ? (
                                <span className="text-sm font-medium text-neutral-700 truncate">
                                    {address || "Detecting location..."}
                                </span>
                            ) : permissionStatus === 'denied' ? (
                                <button
                                    onClick={onEnableLocation}
                                    className="text-sm font-medium text-red-600 hover:underline flex-1 text-left"
                                >
                                    Location access required. Enable Location
                                </button>
                            ) : (
                                <span className="text-sm text-neutral-500">Requesting location...</span>
                            )}
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors hidden sm:block">
                            Home
                        </Link>

                        <button className="p-2 text-neutral-500 hover:text-primary transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <Link to="/dashboard/profile">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                                <User size={20} className="text-neutral-600" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;
