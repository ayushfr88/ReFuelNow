import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, User, Droplet, Calendar, Filter } from 'lucide-react';
import Button from '../components/ui/Button';

const StationOrdersPage = () => {
    const { stationId } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stationName, setStationName] = useState('Station Orders');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchOrders(token);
    }, [stationId, navigate]);

    const fetchOrders = async (token) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/station/${stationId}`, {
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
                if (data.length > 0 && data[0].stationId && data[0].stationId.stationName) {
                    // Note: Order usually populates stationName but our query populated customerId.
                    // We might want to fetch station details separately if we need the name,
                    // or rely on orders finding it if we populate stationId too (which we didn't in this specific controller function yet).
                    // For now let's just use generic title or first order hint if available.
                }
            } else {
                console.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders(orders.map(o => o._id === updatedOrder._id ? updatedOrder : o));
            } else {
                alert("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'accepted': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'cancelled': return 'bg-neutral-100 text-neutral-600';
            default: return 'bg-neutral-100 text-neutral-600';
        }
    };

    if (loading) return <div className="p-8 text-center text-neutral-500">Loading orders...</div>;

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const pastOrders = orders.filter(o => o.status !== 'pending');

    return (
        <div className="min-h-screen bg-neutral-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/seller-dashboard')} className="p-2 hover:bg-white rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-neutral-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-neutral-900">Manage Orders</h1>
                </div>

                {/* Pending Orders Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                        <Clock size={20} className="text-yellow-500" /> Pending Requests ({pendingOrders.length})
                    </h2>

                    {pendingOrders.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center border border-neutral-200 text-neutral-500 italic">
                            No pending orders at the moment.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingOrders.map(order => (
                                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex flex-col sm:flex-row justify-between gap-6 border-l-4 border-l-yellow-400">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                                                ID: {order._id.slice(-6)}
                                            </span>
                                            <span className="text-xs text-neutral-400">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
                                                {order.customerId?.name || 'Unknown User'}
                                                <span className="text-sm font-normal text-neutral-500">({order.customerId?.phone || 'No phone'})</span>
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600">
                                                <div className="flex items-center gap-1 capitalize">
                                                    <Droplet size={14} /> {order.fuelType}
                                                </div>
                                                <div className="font-semibold text-neutral-900">
                                                    {order.quantity} Liters
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xl font-bold text-neutral-900">
                                            ₹{order.totalPrice.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 self-start sm:self-center w-full sm:w-auto">
                                        <Button
                                            onClick={() => handleStatusUpdate(order._id, 'rejected')}
                                            className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 bg-white"
                                        >
                                            <X size={18} className="mr-2" /> Reject
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(order._id, 'accepted')}
                                            variant="primary"
                                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 border-transparent"
                                        >
                                            <Check size={18} className="mr-2" /> Accept
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Past Orders Section */}
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-neutral-500" /> Order History
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        {pastOrders.length === 0 ? (
                            <div className="p-8 text-center text-neutral-500 italic">
                                No past order history.
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-100">
                                {pastOrders.map(order => (
                                    <div key={order._id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-50 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-xs text-neutral-400">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="font-medium text-neutral-900">
                                                {order.quantity}L {order.fuelType} • ₹{order.totalPrice}
                                            </div>
                                            <div className="text-sm text-neutral-500">
                                                Customer: {order.customerId?.name}
                                            </div>
                                        </div>

                                        {/* Optional: Add "Mark Completed" button for accepted orders */}
                                        {order.status === 'accepted' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleStatusUpdate(order._id, 'completed')}
                                                className="bg-neutral-900 text-white hover:bg-neutral-800"
                                            >
                                                Mark Done
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StationOrdersPage;
