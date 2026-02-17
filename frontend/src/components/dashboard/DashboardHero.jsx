import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Fuel, RefreshCw, ArrowRight } from 'lucide-react';

const DashboardHero = ({ nearbyStations = [], onOrderClick, lastOrder }) => {

    const handleOrderNow = () => {
        if (nearbyStations.length > 0 && onOrderClick) {
            // Select the first station (nearest)
            onOrderClick(nearbyStations[0]);
        } else {
            // Optional: Scroll to list or show message if no stations
            document.getElementById('nearby-stations')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleRepeatOrder = () => {
        if (lastOrder && onOrderClick) {
            onOrderClick(lastOrder.stationId, {
                fuelType: lastOrder.fuelType,
                quantity: lastOrder.quantity
            });
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-neutral-100/50 border border-neutral-100 mb-12 flex flex-col md:flex-row gap-12 items-center overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-50/50 to-transparent pointer-events-none"></div>

            {/* Left Content */}
            <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Ready to Serve
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                    Simplifying <span className="text-primary">fuel delivery</span> for you.
                </h1>

                <p className="text-lg text-neutral-500 max-w-lg mx-auto md:mx-0">
                    Get premium fuel delivered directly to your location. Fast, reliable, and contact-free service.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button
                        onClick={handleOrderNow}
                        variant="primary"
                        className="shadow-lg shadow-green-500/20 py-4 px-8 text-lg"
                    >
                        <Fuel className="mr-2" size={20} />
                        Order Now
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleRepeatOrder}
                        disabled={!lastOrder}
                        className="border-2 py-4 px-8 text-lg hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className="mr-2" size={20} />
                        {lastOrder ? 'Repeat Last Order' : 'No Previous Order'}
                    </Button>
                </div>
            </div>

            {/* Right Card */}
            <div className="flex-1 w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative bg-neutral-900 rounded-2xl overflow-hidden aspect-video shadow-2xl"
                >
                    <img
                        src="https://images.unsplash.com/photo-1616401776146-236cee1ddc61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                        alt="Fuel Delivery"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 p-8 text-white">
                        <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                            <Fuel size={20} />
                            <span>Premium Diesel</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Priority Business Delivery</h3>
                        <p className="text-neutral-300 text-sm mb-4">Get bulk fuel delivered to your fleet within 2 hours.</p>

                        <button className="text-white font-medium hover:text-green-400 transition-colors flex items-center gap-2 group">
                            Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* Floating Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 border border-neutral-100 hidden md:flex"
                >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <Fuel size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-500 font-semibold uppercase">Current Price</p>
                        <p className="text-lg font-bold text-neutral-900">₹94.50<span className="text-xs text-neutral-400 font-normal">/L</span></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardHero;
