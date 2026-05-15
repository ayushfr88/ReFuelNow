import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, Phone, CheckCircle, Clock, LogOut, Package, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

const DeliveryManDashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/orders/delivery-tasks', {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/delivery-status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ deliveryStatus: newStatus })
            });

            if (response.ok) {
                fetchTasks();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!user) return <div className="p-8 text-center text-neutral-500">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-neutral-50">
            <nav className="bg-white border-b border-neutral-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <Logo />
                <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-600 font-medium">DM: {user.name}</span>
                    <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
                        <LogOut size={16} className="mr-2" /> Sign Out
                    </Button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-neutral-900">Delivery Tasks</h1>
                    <p className="text-neutral-500 mt-1">Manage your assigned fuel delivery orders.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-neutral-500 italic">Finding your tasks...</div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-neutral-200">
                        <div className="w-20 h-20 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">Rest Easy!</h3>
                        <p className="text-neutral-500">No delivery tasks assigned to you at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {tasks.map((task) => (
                            <div key={task._id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6 border-b border-neutral-100 flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                                task.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                                task.deliveryStatus === 'out_for_delivery' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {task.deliveryStatus.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-neutral-300 text-xs">|</span>
                                            <span className="text-xs text-neutral-500 font-mono">#{task._id.slice(-8)}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900">
                                            {task.quantity}{task.fuelType === 'ev' ? 'kw' : 'L'} {task.fuelType.toUpperCase()}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-neutral-500">Estimated Price</p>
                                        <p className="text-lg font-bold text-green-600">₹{task.totalPrice}</p>
                                    </div>
                                </div>

                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Customer Details */}
                                    <div>
                                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                            <User size={12} /> Customer Information
                                        </h4>
                                        <p className="font-bold text-neutral-900 mb-1">{task.customerId.name}</p>
                                        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                                            <Phone size={14} className="text-neutral-400" />
                                            {task.customerId.phone}
                                        </div>
                                        <div className="flex items-start gap-2 text-sm text-neutral-600">
                                            <MapPin size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                                            <span>{task.customerId.address || 'Address not provided'}</span>
                                        </div>
                                    </div>

                                    {/* Station Details */}
                                    <div>
                                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                            <ShoppingBag size={12} /> Pickup From
                                        </h4>
                                        <p className="font-bold text-neutral-900 mb-1">{task.stationId.stationName}</p>
                                        <div className="flex items-start gap-2 text-sm text-neutral-600">
                                            <MapPin size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                                            <span>{task.stationId.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex flex-wrap gap-4">
                                    {task.deliveryStatus === 'assigned' && (
                                        <Button 
                                            onClick={() => updateStatus(task._id, 'out_for_delivery')}
                                            className="bg-orange-600 hover:bg-orange-700 text-white border-transparent flex-1"
                                        >
                                            <Clock size={18} className="mr-2" /> Start Delivery
                                        </Button>
                                    )}
                                    {task.deliveryStatus === 'out_for_delivery' && (
                                        <Button 
                                            onClick={() => updateStatus(task._id, 'delivered')}
                                            className="bg-green-600 hover:bg-green-700 text-white border-transparent flex-1"
                                        >
                                            <CheckCircle size={18} className="mr-2" /> Mark as Delivered
                                        </Button>
                                    )}
                                    {task.deliveryStatus === 'delivered' && (
                                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg w-full justify-center">
                                            <CheckCircle size={20} /> Order Completed
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DeliveryManDashboard;
