import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Bell, Package, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';

const DashboardNavbar = ({ address, onEnableLocation, permissionStatus }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    {/* Logo */}
                    <Logo />

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

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                                    <User size={18} />
                                </div>
                                <ChevronDown size={14} className={`text-neutral-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 overflow-hidden"
                                    >
                                        <div className="px-4 py-2 border-b border-neutral-100 mb-2">
                                            <p className="text-xs font-semibold text-neutral-400 uppercase">My Account</p>
                                        </div>

                                        <Link
                                            to="/dashboard/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User size={16} />
                                            My Profile
                                        </Link>

                                        <Link
                                            to="/dashboard/orders"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Package size={16} />
                                            My Orders
                                        </Link>

                                        <div className="border-t border-neutral-100 mt-2 pt-2">
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('user');
                                                    window.location.href = '/login';
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;
