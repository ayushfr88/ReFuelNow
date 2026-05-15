import React, { useState, useEffect } from 'react';
import { Wallet, IndianRupee, ArrowLeft, TrendingUp, ShoppingBag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const SellerWalletPage = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const [earnings, setEarnings] = useState([]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // Fetch Balance
            const balanceRes = await fetch('http://localhost:5000/api/wallet', {
                headers: { 'x-auth-token': token }
            });
            const balanceData = await balanceRes.json();
            if (balanceRes.ok) {
                setBalance(balanceData.walletBalance);
            }

            // Fetch Earnings History
            const earningsRes = await fetch('http://localhost:5000/api/orders/seller-earnings', {
                headers: { 'x-auth-token': token }
            });
            if (earningsRes.ok) {
                const earningsData = await earningsRes.json();
                setEarnings(earningsData);
            }
        } catch (error) {
            console.error('Failed to fetch wallet data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <p className="text-neutral-500 font-medium">Loading Earnings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link to="/seller-dashboard" className="inline-flex items-center text-neutral-500 hover:text-primary mb-2 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Seller Dashboard
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 bg-green-50 rounded-bl-full -mr-8 -mt-8">
                        <TrendingUp size={120} className="text-primary/10" />
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Earnings & Wallet</h1>
                        <p className="text-neutral-500 mb-8">Manage your fuel delivery revenue and payouts.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-neutral-900 rounded-2xl p-8 text-white shadow-xl">
                                <p className="text-neutral-400 font-medium mb-2 uppercase tracking-wider text-xs">Total Earnings Balance</p>
                                <h2 className="text-5xl font-extrabold flex items-center gap-2">
                                    <IndianRupee size={40} className="text-primary" />
                                    {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </h2>
                                <div className="mt-6 flex items-center gap-2 text-green-400 text-sm font-semibold">
                                    <TrendingUp size={16} />
                                    <span>Increased from last delivery</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <p className="text-xs font-semibold text-neutral-500 uppercase">Payouts</p>
                                    <p className="font-bold text-xl text-neutral-900">₹0.00</p>
                                </div>
                                <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <p className="text-xs font-semibold text-neutral-500 uppercase">Completed</p>
                                    <p className="font-bold text-xl text-neutral-900">{earnings.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions Detail */}
                <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm">
                    <h3 className="text-xl font-bold text-neutral-900 mb-6">Recent Earnings History</h3>
                    
                    {earnings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IndianRupee size={24} className="text-neutral-300" />
                            </div>
                            <p className="text-neutral-500">No recent transactions. Your earnings will appear here after orders are delivered.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {earnings.map((item) => (
                                <div key={item._id} className="flex items-center justify-between p-4 rounded-xl border border-neutral-50 hover:bg-neutral-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                            <TrendingUp size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900 capitalize">{item.fuelType} Delivery</p>
                                            <p className="text-xs text-neutral-500">
                                                {item.customerId?.name} • {item.stationId?.stationName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">+ ₹{item.totalPrice.toLocaleString()}</p>
                                        <p className="text-[10px] text-neutral-400 capitalize">{new Date(item.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerWalletPage;
