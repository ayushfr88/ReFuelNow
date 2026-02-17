import React, { useEffect, useState } from 'react';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import { Package, Calendar, Clock, MapPin, Fuel, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/orders', {
                headers: { 'x-auth-token': token }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <DashboardNavbar address="Dashboard" permissionStatus="granted" />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/dashboard" className="p-2 bg-white rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors">
                        <ArrowLeft size={20} className="text-neutral-600" />
                    </Link>
                    <h1 className="text-3xl font-bold text-neutral-900">My Orders</h1>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-neutral-500">Loading your orders...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                            <Package size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">No orders yet</h3>
                        <p className="text-neutral-500 mb-6">You haven't placed any fuel orders yet.</p>
                        <Link to="/dashboard" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
                            Order Fuel Now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-neutral-100 pb-6">
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                                                <span className="font-semibold text-neutral-900">Order #{order._id.slice(-6).toUpperCase()}</span>
                                                <span>•</span>
                                                <span>{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${order.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                            order.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.status === 'accepted' ? 'Your fuel is on the way' :
                                                        order.status === 'rejected' ? 'Request Rejected' :
                                                            order.status === 'pending' ? 'Request Sent' :
                                                                order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-neutral-500">Total Cost</p>
                                            <p className="text-2xl font-bold text-neutral-900">₹{order.totalPrice.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-neutral-50 rounded-xl">
                                                <MapPin size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-500">Station</p>
                                                <p className="font-semibold text-neutral-900">{order.stationId?.stationName || 'Unknown Station'}</p>
                                                <p className="text-sm text-neutral-500">{order.stationId?.address || 'Address not available'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-neutral-50 rounded-xl">
                                                <Fuel size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-500">Fuel Details</p>
                                                <p className="font-semibold text-neutral-900 capitalize">{order.fuelType}</p>
                                                <p className="text-sm text-neutral-500">{order.quantity} Litres</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyOrdersPage;
