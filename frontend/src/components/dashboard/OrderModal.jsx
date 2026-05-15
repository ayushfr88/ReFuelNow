import React, { useState, useEffect } from 'react';
import { X, Fuel, ArrowRight, Zap } from 'lucide-react';
import Button from '../ui/Button';

const OrderModal = ({ isOpen, onClose, station, initialValues }) => {
    const [fuelType, setFuelType] = useState('diesel');
    const [quantity, setQuantity] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [useWallet, setUseWallet] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);

    const fetchWallet = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch('http://localhost:5000/api/wallet', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                setWalletBalance(data.walletBalance || 0);
            }
        } catch (e) {
            console.error('Error fetching wallet balance');
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchWallet();
            // Reset state when modal opens
            if (initialValues) {
                setFuelType(initialValues.fuelType);
                setQuantity(initialValues.quantity);
            } else {
                setFuelType(station?.type === 'ev' ? 'ev' : 'diesel');
                setQuantity('');
            }
            setTotalPrice(0);
            setUseWallet(false);
            setError(null);
            setSuccess(false);
        }
    }, [isOpen, initialValues]);

    useEffect(() => {
        if (!station || !quantity) {
            setTotalPrice(0);
            return;
        }

        const price = fuelType === 'ev' 
            ? station.evPricePerKwh 
            : (fuelType === 'diesel' ? station.dieselPrice : station.petrolPrice);
        setTotalPrice(price * parseFloat(quantity));
    }, [fuelType, quantity, station]);

    if (!isOpen || !station) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            console.log("Placing order with payload:", {
                stationId: station._id,
                fuelType,
                quantity: parseFloat(quantity),
                useWallet
            });

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    stationId: station._id,
                    fuelType,
                    quantity: parseFloat(quantity),
                    useWallet
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to place order');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900">Place Order</h2>
                        <p className="text-sm text-neutral-500">{station.stationName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                        <X size={20} className="text-neutral-500" />
                    </button>
                </div>

                {success ? (
                    <div className="p-12 text-center">
                        <div className={`w-16 h-16 ${station?.type === 'ev' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            {station?.type === 'ev' ? <Zap size={32} /> : <Fuel size={32} />}
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">Order Confirmed!</h3>
                        <p className="text-neutral-500">
                            {station?.type === 'ev' ? 'Your EV station reservation is confirmed.' : 'Your fuel is on the way.'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Fuel Type Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-neutral-700">
                                {station?.type === 'ev' ? 'Service Type' : 'Select Fuel Type'}
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {station?.type === 'ev' ? (
                                    <button
                                        type="button"
                                        className="p-4 rounded-xl border-2 transition-all text-left border-purple-500 bg-purple-50 col-span-2"
                                    >
                                        <div className="font-bold text-neutral-900">EV Charging</div>
                                        <div className="text-sm text-neutral-500">₹{station.evPricePerKwh}/kw</div>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setFuelType('diesel')}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${fuelType === 'diesel' ? 'border-green-500 bg-green-50' : 'border-neutral-200 hover:border-green-200'}`}
                                        >
                                            <div className="font-bold text-neutral-900">Diesel</div>
                                            <div className="text-sm text-neutral-500">₹{station.dieselPrice}/L</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFuelType('petrol')}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${fuelType === 'petrol' ? 'border-green-500 bg-green-50' : 'border-neutral-200 hover:border-green-200'}`}
                                        >
                                            <div className="font-bold text-neutral-900">Petrol</div>
                                            <div className="text-sm text-neutral-500">₹{station.petrolPrice}/L</div>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Quantity Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-neutral-700">
                                {station?.type === 'ev' ? 'Quantity (kw)' : 'Quantity (Litres)'}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    step="0.1"
                                    required
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Enter quantity"
                                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
                                    {station?.type === 'ev' ? 'kw' : 'L'}
                                </div>
                            </div>
                        </div>

                        {/* Total Price Display */}
                        <div className="bg-neutral-900 rounded-xl p-6 text-white flex justify-between items-center mb-4">
                            <span className="text-neutral-400 font-medium">Total Price</span>
                            <span className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</span>
                        </div>

                        {/* Wallet Payment Option */}
                        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-neutral-800 flex items-center gap-2">
                                    Wallet Balance
                                </span>
                                <span className="font-bold">₹{walletBalance.toFixed(2)}</span>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={useWallet} 
                                    onChange={(e) => setUseWallet(e.target.checked)}
                                    className="w-4 h-4 text-green-600 bg-white border-neutral-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                                />
                                <span className="text-sm text-neutral-600">Pay using wallet</span>
                            </label>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 text-lg shadow-lg shadow-green-500/20"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Confirm Order'} <ArrowRight className="ml-2" size={20} />
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OrderModal;
