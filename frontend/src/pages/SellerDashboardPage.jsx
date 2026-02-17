import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Briefcase, Plus, MapPin, Fuel, TrendingUp, ShoppingBag, BarChart3, Edit2, Trash2, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

const SellerDashboardPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stations, setStations] = useState([]);
    const [earningsData, setEarningsData] = useState({
        totalEarnings: 0,
        totalOrders: 0,
        stationBreakdown: []
    });
    const [loading, setLoading] = useState(true);
    const [editingStation, setEditingStation] = useState(null);
    const [editForm, setEditForm] = useState({
        stationName: '',
        dieselPrice: '',
        petrolPrice: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role !== 'seller') {
                navigate('/dashboard');
            } else {
                setUser(parsedUser);
                fetchDashboardData(token);
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchDashboardData = async (token) => {
        try {
            const [stationsRes, earningsRes] = await Promise.all([
                fetch('http://localhost:5000/api/stations/seller', { headers: { 'x-auth-token': token } }),
                fetch('http://localhost:5000/api/seller/earnings', { headers: { 'x-auth-token': token } })
            ]);

            if (stationsRes.ok) {
                const stationsData = await stationsRes.json();
                setStations(stationsData);
            }

            if (earningsRes.ok) {
                const earningsData = await earningsRes.json();
                setEarningsData(earningsData);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    // Delete Station
    const handleDeleteStation = async (stationId) => {
        if (!window.confirm("Are you sure you want to delete this station? This action cannot be undone.")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/stations/${stationId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                // Remove from local state
                setStations(stations.filter(s => s._id !== stationId));
                // Reload dashboard data to update stats
                fetchDashboardData(token);
            } else {
                alert("Failed to delete station");
            }
        } catch (error) {
            console.error("Error deleting station:", error);
        }
    };

    // Open Edit Modal
    const openEditModal = (station) => {
        setEditingStation(station);
        setEditForm({
            stationName: station.stationName,
            dieselPrice: station.dieselPrice,
            petrolPrice: station.petrolPrice
        });
    };



    // Toggle Station Status
    const handleToggleStatus = async (station) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = station.status === 'inactive' ? 'active' : 'inactive';

            const response = await fetch(`http://localhost:5000/api/stations/${station._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                const updatedStation = await response.json();
                setStations(stations.map(s => s._id === updatedStation._id ? updatedStation : s));
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Handle Edit Submit
    const handleUpdateStation = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/stations/${editingStation._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                const updatedStation = await response.json();
                // Update local list
                setStations(stations.map(s => s._id === updatedStation._id ? updatedStation : s));
                setEditingStation(null);
            } else {
                alert("Failed to update station");
            }
        } catch (error) {
            console.error("Error updating station:", error);
        }
    };

    if (!user) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-neutral-50 relative">
            {/* Navbar */}
            <nav className="bg-white border-b border-neutral-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <Logo />
                <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-600 hidden sm:inline">Welcome, {user.name}</span>
                    <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
                        <LogOut size={16} className="mr-2" /> Sign Out
                    </Button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">

                {/* Earnings Summary Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Business Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Earnings Card */}
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 font-medium">Total Revenue</p>
                                <h3 className="text-2xl font-bold text-neutral-900">₹{earningsData.totalEarnings.toLocaleString()}</h3>
                            </div>
                        </div>

                        {/* Total Orders Card */}
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 font-medium">Completed Orders</p>
                                <h3 className="text-2xl font-bold text-neutral-900">{earningsData.totalOrders}</h3>
                            </div>
                        </div>

                        {/* Active Stations Card */}
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 font-medium">Active Stations</p>
                                <h3 className="text-2xl font-bold text-neutral-900">{stations.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stations Management Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">Your Stations</h2>
                        <p className="text-neutral-500 mt-1">Manage details and view station-specific performance.</p>
                    </div>
                    <Button onClick={() => navigate('/add-station')} variant="primary" className="shadow-lg shadow-green-500/20">
                        <Plus size={20} className="mr-2" /> Add Station
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-neutral-500">Loading dashboard...</div>
                ) : stations.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-neutral-200">
                        <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Fuel size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">No Stations Added</h3>
                        <p className="text-neutral-500 mb-6">Start by adding your first fuel station to receive orders.</p>
                        <Button onClick={() => navigate('/add-station')} variant="outline">
                            Add Your First Station
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Station Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stations.map(station => (
                                <div key={station._id} className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow p-6 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="bg-green-100 p-2 rounded-lg text-green-700">
                                            <Fuel size={24} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDeleteStation(station._id)}
                                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Station"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(station)}
                                                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${station.status === 'inactive'
                                                    ? 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                            >
                                                {station.status === 'inactive' ? 'Inactive' : 'Active'}
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-neutral-900 mb-1">{station.stationName}</h3>
                                    <p className="text-sm text-neutral-500 flex items-start gap-1 mb-4 h-10 overflow-hidden">
                                        <MapPin size={14} className="mt-0.5 shrink-0" />
                                        {station.address}
                                    </p>

                                    <div className="text-xs text-neutral-400 mb-4 space-y-1">
                                        <p>Station ID: <span className="font-mono">{station._id}</span></p>
                                        <p>Seller ID: <span className="font-mono">{station.sellerId}</span></p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                            <div className="text-xs text-neutral-500 mb-1">Diesel</div>
                                            <div className="font-bold text-neutral-900">₹{station.dieselPrice}</div>
                                        </div>
                                        <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                            <div className="text-xs text-neutral-500 mb-1">Petrol</div>
                                            <div className="font-bold text-neutral-900">₹{station.petrolPrice}</div>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full text-sm" onClick={() => openEditModal(station)}>
                                        <Edit2 size={14} className="mr-2" /> Update Prices
                                    </Button>

                                    <Button
                                        variant="primary"
                                        className="w-full mt-2 text-sm bg-blue-600 hover:bg-blue-700 border-transparent shadow-none relative"
                                        onClick={() => navigate(`/seller/station/${station._id}/orders`)}
                                    >
                                        <ShoppingBag size={14} className="mr-2" /> Manage Orders
                                        {station.pendingOrdersCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                                                {station.pendingOrdersCount}
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Detailed Breakdown Table */}
                        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
                                <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                                    <BarChart3 size={18} /> Station Performance
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-200">
                                        <tr>
                                            <th className="px-6 py-3">Station Name</th>
                                            <th className="px-6 py-3">Completed Orders</th>
                                            <th className="px-6 py-3">Total Earnings</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {earningsData.stationBreakdown.map((stat, index) => (
                                            <tr key={index} className="hover:bg-neutral-50">
                                                <td className="px-6 py-4 font-medium text-neutral-900">{stat.stationName}</td>
                                                <td className="px-6 py-4 text-neutral-600">{stat.ordersCount}</td>
                                                <td className="px-6 py-4 font-bold text-green-600">₹{stat.earnings.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">OK</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {earningsData.stationBreakdown.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-neutral-500">
                                                    No sales data available yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Edit Station Modal */}
            {editingStation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-neutral-900">Update Station</h3>
                            <button onClick={() => setEditingStation(null)} className="p-2 hover:bg-neutral-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateStation} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Station Name</label>
                                <input
                                    type="text"
                                    value={editForm.stationName}
                                    onChange={(e) => setEditForm({ ...editForm, stationName: e.target.value })}
                                    className="w-full p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Diesel Price (₹)</label>
                                    <input
                                        type="number"
                                        value={editForm.dieselPrice}
                                        onChange={(e) => setEditForm({ ...editForm, dieselPrice: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Petrol Price (₹)</label>
                                    <input
                                        type="number"
                                        value={editForm.petrolPrice}
                                        onChange={(e) => setEditForm({ ...editForm, petrolPrice: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingStation(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" className="flex-1">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboardPage;
