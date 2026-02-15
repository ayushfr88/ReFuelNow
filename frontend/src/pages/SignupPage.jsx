import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Briefcase, ArrowLeft, Droplet, ArrowRight, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer' // default role
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            {/* Left Side - Visuals */}
            <div className="hidden md:flex w-1/2 bg-neutral-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 z-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1590502593747-42a996133562?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Fuel Truck"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-green-900/50 mix-blend-multiply"></div>
                </div>

                <div className="relative z-10 text-white max-w-lg">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white">
                            <Droplet size={24} fill="currentColor" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            Refuel<span className="text-green-400">Now</span>
                        </span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Join the Fuel Revolution.</h1>
                    <p className="text-xl text-neutral-400">Create an account to verify fuel requests or manage your fleet efficiently.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative overflow-y-auto">
                <Link to="/" className="absolute top-8 left-8 text-neutral-500 hover:text-primary transition-colors flex items-center gap-2 font-medium">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <div className="w-full max-w-md my-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-neutral-800 mb-2">Create Account</h2>
                        <p className="text-neutral-500">Join RefuelNow today.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-800 mb-2">Account Created!</h3>
                            <p className="text-neutral-500 mb-6">Redirecting you to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@company.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">I am a...</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => handleRoleSelect('customer')}
                                        className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${formData.role === 'customer' ? 'border-primary bg-green-50 text-primary ring-2 ring-primary/20' : 'border-neutral-200 hover:border-primary/50 text-neutral-600'}`}
                                    >
                                        <User size={24} />
                                        <span className="font-medium text-sm">Customer</span>
                                    </div>
                                    <div
                                        onClick={() => handleRoleSelect('seller')}
                                        className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${formData.role === 'seller' ? 'border-primary bg-green-50 text-primary ring-2 ring-primary/20' : 'border-neutral-200 hover:border-primary/50 text-neutral-600'}`}
                                    >
                                        <Briefcase size={24} />
                                        <span className="font-medium text-sm">Fuel Seller</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-3 text-lg shadow-xl shadow-green-500/20"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-8 text-center text-sm text-neutral-500">
                            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
