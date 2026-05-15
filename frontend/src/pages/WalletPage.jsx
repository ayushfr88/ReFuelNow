import React, { useState, useEffect } from 'react';
import { Wallet, IndianRupee, Plus, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const WalletPage = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchBalance = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:5000/api/wallet', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (res.ok) {
                setBalance(data.walletBalance);
            }
        } catch (error) {
            console.error('Failed to fetch wallet balance', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleAddMoney = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        
        if (!amount || isNaN(amount) || amount <= 0) {
            setMessage({ text: 'Please enter a valid amount', type: 'error' });
            return;
        }

        setIsAdding(true);
        const token = localStorage.getItem('token');

        try {
            const resScript = await loadRazorpayScript();
            if (!resScript) {
                setMessage({ text: 'Razorpay SDK failed to load. Are you online?', type: 'error' });
                setIsAdding(false);
                return;
            }

            const res = await fetch('http://localhost:5000/api/wallet/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ amount: parseFloat(amount) })
            });

            const data = await res.json();

            if (!res.ok) {
                setIsAdding(false);
                return setMessage({ text: data.message || 'Failed to create order', type: 'error' });
            }

            const options = {
                key: 'rzp_test_SZQKnawb3sNc4B', // Standard test key
                amount: data.amount,
                currency: data.currency,
                name: 'RefuelNow Wallet Add',
                description: 'Add money to wallet',
                order_id: data.orderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch('http://localhost:5000/api/wallet/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-token': token
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyRes.ok) {
                            setBalance(verifyData.walletBalance);
                            setMessage({ text: 'Money added successfully!', type: 'success' });
                            setAmount('');
                        } else {
                            setMessage({ text: verifyData.message || 'Failed to add money', type: 'error' });
                        }
                    } catch (error) {
                         setMessage({ text: 'Verificaton error. Contact Support.', type: 'error' });
                    } finally {
                        setIsAdding(false);
                    }
                },
                prefill: {
                    name: 'RefuelNow User',
                    email: 'user@refuelnow.com',
                },
                theme: {
                    color: '#22c55e'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                setMessage({ text: 'Payment Failed: ' + response.error.description, type: 'error' });
                setIsAdding(false);
            });
            paymentObject.open();

        } catch (error) {
            setMessage({ text: 'Server error, please try again later.', type: 'error' });
            setIsAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <p className="text-neutral-500 font-medium">Loading Wallet...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Link to="/dashboard" className="inline-flex items-center text-neutral-500 hover:text-primary mb-2 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-bl-full -mr-8 -mt-8">
                        <Wallet size={120} className="text-primary/10" />
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
                            <Wallet size={28} className="text-primary" />
                            My Refuel Wallet
                        </h1>

                        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white shadow-lg mb-8">
                            <p className="text-neutral-400 font-medium mb-2 uppercase tracking-wider text-sm">Available Balance</p>
                            <h2 className="text-5xl font-extrabold flex items-center gap-2">
                                <IndianRupee size={40} className="text-primary" />
                                {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h2>
                        </div>

                        <form onSubmit={handleAddMoney} className="space-y-6">
                            <h3 className="text-lg font-bold text-neutral-800">Add Funds</h3>
                            
                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    <AlertCircle size={20} />
                                    <span className="font-medium text-sm">{message.text}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Amount (₹)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <IndianRupee size={20} className="text-neutral-400" />
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-12 p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-lg"
                                        min="1"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mb-6">
                                {[500, 1000, 2000, 5000].map(val => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(val.toString())}
                                        className="flex-1 py-2 rounded-lg border border-neutral-200 bg-white hover:border-primary hover:text-primary transition-colors text-sm font-semibold text-neutral-600"
                                    >
                                        +₹{val}
                                    </button>
                                ))}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full py-4 text-lg" 
                                disabled={isAdding || !amount}
                            >
                                {isAdding ? 'Processing...' : 'Add Money to Wallet'}
                            </Button>
                        </form>
                    </div>
                </div>
                
                <p className="text-center text-sm text-neutral-400 mt-8">
                    Secure checkout powered by RefuelNow. Funds can be used exclusively for platform services.
                </p>
            </div>
        </div>
    );
};

export default WalletPage;
