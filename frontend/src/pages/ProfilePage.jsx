import React, { useState, useEffect } from 'react';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import { User, Mail, Phone, Shield, LogOut, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <DashboardNavbar address="Dashboard" permissionStatus="granted" />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link to="/dashboard" className="inline-flex items-center text-neutral-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                </Link>

                <div className="bg-white rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/50 overflow-hidden">
                    <div className="h-48 bg-gradient-to-r from-primary/10 to-accent/10 relative">
                        <div className="absolute -bottom-16 left-8 sm:left-12">
                            <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                                <div className="w-full h-full rounded-full bg-neutral-100 flex items-center justify-center text-primary text-4xl font-bold border-2 border-primary/20">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 sm:px-12 pb-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900">{user.name}</h1>
                                <p className="text-neutral-500 flex items-center gap-2 mt-1">
                                    <Shield size={16} className="text-green-500" />
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
                                </p>
                            </div>
                            <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                                <LogOut size={18} className="mr-2" />
                                Sign Out
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-neutral-900 border-b pb-2">Contact Information</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 mb-1">Full Name</label>
                                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                            <User size={20} className="text-neutral-400" />
                                            <span className="text-neutral-900 font-medium">{user.name}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 mb-1">Email Address</label>
                                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                            <Mail size={20} className="text-neutral-400" />
                                            <span className="text-neutral-900 font-medium">{user.email}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 mb-1">Phone Number</label>
                                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                            <Phone size={20} className="text-neutral-400" />
                                            <span className="text-neutral-500 italic">Not added</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-neutral-900 border-b pb-2">Account Settings</h3>
                                <p className="text-neutral-500 text-sm">Manage your password and security preferences here.</p>
                                <Button variant="outline" className="w-full justify-start">
                                    Change Password
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    Notification Preferences
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
