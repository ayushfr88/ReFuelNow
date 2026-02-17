import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Droplet } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
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
                    <div className="mb-8">
                        <Logo theme="dark" textSize="text-2xl" iconSize={24} />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Fuel Your Business Without the Hassle.</h1>
                    <p className="text-xl text-neutral-400">Join thousands of businesses managing their fuel logistics with our smart platform.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
                <Link to="/" className="absolute top-8 left-8 text-neutral-500 hover:text-primary transition-colors flex items-center gap-2 font-medium">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-neutral-800 mb-2">Welcome Back</h2>
                        <p className="text-neutral-500">Please enter your details to sign in.</p>
                    </div>

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
                        <span className="relative bg-white px-4 text-sm text-neutral-500">OR</span>
                    </div>

                    <button className="w-full py-3 border border-neutral-200 rounded-xl flex items-center justify-center gap-3 hover:bg-neutral-50 transition-all font-medium text-neutral-700 bg-white">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <div className="mt-8 text-center text-sm text-neutral-500">
                        Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
