import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Trash2, Mail, Phone, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

const DeliveryMenPage = () => {
    const navigate = useNavigate();
    const [deliveryMen, setDeliveryMen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDeliveryMen();
    }, []);

    const fetchDeliveryMen = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/seller/delivery-men', {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setDeliveryMen(data);
            }
        } catch (error) {
            console.error("Error fetching delivery men:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/seller/delivery-men', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchDeliveryMen();
                setShowAddModal(false);
                setFormData({ name: '', email: '', password: '', phone: '' });
            } else {
                const error = await response.json();
                alert(error.message || "Failed to add delivery man");
            }
        } catch (error) {
            console.error("Error adding delivery man:", error);
            alert("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <nav className="bg-white border-b border-neutral-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <Logo />
                <Button variant="outline" onClick={() => navigate('/seller-dashboard')} className="text-neutral-600">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Button>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">Delivery Staff</h1>
                        <p className="text-neutral-500 mt-1">Manage your delivery team members.</p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)} variant="primary" className="shadow-lg shadow-green-500/20">
                        <UserPlus size={20} className="mr-2" /> Add Delivery Man
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-green-600" size={40} />
                    </div>
                ) : deliveryMen.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-neutral-200">
                        <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">No Delivery Staff Yet</h3>
                        <p className="text-neutral-500 mb-6">Register your delivery men so you can assign orders to them.</p>
                        <Button onClick={() => setShowAddModal(true)} variant="outline">
                            Add Your First Delivery Man
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {deliveryMen.map((dm) => (
                            <div key={dm._id} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl">
                                            {dm.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 text-lg">{dm.name}</h3>
                                            <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                                                Delivery Man
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-neutral-600">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-neutral-400" />
                                            {dm.email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-neutral-400" />
                                            {dm.phone || 'No phone provided'}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-neutral-100 flex justify-end">
                                    <button className="text-neutral-400 hover:text-red-600 transition-colors text-sm flex items-center gap-1">
                                        <Trash2 size={14} /> Remove Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-neutral-900 mb-6">Register New Delivery Man</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                                    placeholder="+91 9876543210"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                                    {submitting ? 'Registering...' : 'Register Specialist'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryMenPage;
