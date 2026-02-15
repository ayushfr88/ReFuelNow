import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock } from 'lucide-react';
import Button from './ui/Button';
import { Link, useNavigate } from 'react-router-dom';

const SignInModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store user data and token in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            console.log('Login successful:', data.user);
            onClose(); // Close modal on success

            if (data.user.role === 'customer') {
                navigate('/dashboard');
            } else if (data.user.role === 'seller') {
                navigate('/seller-dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl overflow-y-auto"
                    >
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-neutral-800">Welcome Back</h3>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1">
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-6">
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
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-neutral-700">Password</label>
                                            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                                        </div>
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

                                    <div className="flex items-center">
                                        <input type="checkbox" id="remember" className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary" />
                                        <label htmlFor="remember" className="ml-2 text-sm text-neutral-600">Remember me for 30 days</label>
                                    </div>

                                    <Button
                                        variant="primary"
                                        className="w-full py-3 text-lg shadow-xl shadow-green-500/20"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </Button>
                                </form>

                                <div className="relative my-8 text-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-neutral-200"></div>
                                    </div>
                                    <span className="relative bg-white/50 backdrop-blur-sm px-4 text-sm text-neutral-500">OR</span>
                                </div>

                                <button className="w-full py-3 border border-neutral-200 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:border-neutral-300 transition-all font-medium text-neutral-700 bg-white/50">
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                    Continue with Google
                                </button>
                            </div>

                            <div className="mt-8 text-center text-sm text-neutral-500">
                                Don't have an account? <Link to="/signup" onClick={onClose} className="text-primary font-bold hover:underline">Create Account</Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SignInModal;
