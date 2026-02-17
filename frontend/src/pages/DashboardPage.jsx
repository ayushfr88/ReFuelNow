import React, { useEffect, useState } from 'react';
import { MapPin, Bell, Search, Filter, Fuel, Clock, Navigation } from 'lucide-react';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import WeeklySummary from '../components/dashboard/WeeklySummary';
import DashboardHero from '../components/dashboard/DashboardHero';
import OrderModal from '../components/dashboard/OrderModal';
import RejectedOrderModal from '../components/dashboard/RejectedOrderModal';

const DashboardPage = () => {
    const [address, setAddress] = useState('Detecting location...');
    const [permissionStatus, setPermissionStatus] = useState('prompt');
    const [coordinates, setCoordinates] = useState(null);
    const [nearbyStations, setNearbyStations] = useState([]);
    const [loadingStations, setLoadingStations] = useState(false);
    const [selectedStation, setSelectedStation] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [searchRadius, setSearchRadius] = useState(5); // Default 5km
    const [lastOrder, setLastOrder] = useState(null);
    const [orderInitialValues, setOrderInitialValues] = useState(null);

    const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
    const [rejectedOrder, setRejectedOrder] = useState(null);

    useEffect(() => {
        fetchLastOrder();

        // Poll for order updates every 5 seconds
        const intervalId = setInterval(() => {
            fetchLastOrder(true);
        }, 5000);

        if (!navigator.geolocation) {
            setAddress('Geolocation not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            setPermissionStatus('granted');
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });

            // Reverse Geocoding
            try {
                console.log(`Fetching address for lat: ${latitude}, lng: ${longitude}`);
                // Use our backend proxy to avoid CORS issues
                const response = await fetch(`http://localhost:5000/api/utility/geocode?lat=${latitude}&lng=${longitude}`);

                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}`);
                }

                const data = await response.json();
                console.log('Geocoding response:', data);

                if (data.display_name) {
                    setAddress(data.display_name);
                } else if (data.error) {
                    setAddress('Location not found');
                    console.error('Geocoding API error:', data.error);
                } else {
                    setAddress('Address not found');
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                setAddress('Address unavailable');
            }

            // Fetch Nearby Stations
            fetchNearbyStations(latitude, longitude);

        }, (error) => {
            console.error("Error getting location:", error);
            if (error.code === error.PERMISSION_DENIED) {
                setPermissionStatus('denied');
                setAddress('Location access required');
            } else {
                setAddress('Unable to retrieve location');
            }
        });

        return () => clearInterval(intervalId);
    }, []);

    const fetchLastOrder = async (isPolling = false) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5000/api/orders', {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const newOrderData = data[0];

                    if (isPolling) {
                        setLastOrder(prevOrder => {
                            // Check if status changed to rejected
                            if (prevOrder && prevOrder._id === newOrderData._id &&
                                prevOrder.status !== 'rejected' && newOrderData.status === 'rejected') {
                                setRejectedOrder(newOrderData);
                                setIsRejectedModalOpen(true);
                            }
                            return newOrderData;
                        });
                    } else {
                        setLastOrder(newOrderData);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching last order:", error);
        }
    };



    const fetchNearbyStations = async (lat, lng, dist = 5) => {
        setLoadingStations(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/stations/nearby?lat=${lat}&lng=${lng}&dist=${dist}`, {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setNearbyStations(data);
            }
        } catch (error) {
            console.error("Error fetching nearby stations:", error);
        } finally {
            setLoadingStations(false);
        }
    };

    const handleOrderClick = (station, initialValues = null) => {
        setSelectedStation(station);
        setOrderInitialValues(initialValues);
        setIsOrderModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            <DashboardNavbar address={address} permissionStatus={permissionStatus} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                <DashboardHero
                    nearbyStations={nearbyStations}
                    onOrderClick={handleOrderClick}
                    lastOrder={lastOrder}
                />
                <WeeklySummary />

                {/* Nearby Stations Section */}
                <div id="nearby-stations">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-neutral-900">Nearby Fuel Stations</h2>

                        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-neutral-200 shadow-sm">
                            <span className="text-sm font-medium text-neutral-600 pl-2">Distance:</span>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={searchRadius}
                                    onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                                    className="w-32 accent-neutral-900 cursor-pointer"
                                />
                                <span className="text-sm font-bold text-neutral-900 w-12">{searchRadius} km</span>
                            </div>
                            <button
                                onClick={() => coordinates && fetchNearbyStations(coordinates.latitude, coordinates.longitude, searchRadius)}
                                className="bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    {loadingStations ? (
                        <div className="text-center py-12 text-neutral-500">Finding nearest stations...</div>
                    ) : nearbyStations.length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 text-center border border-neutral-200">
                            <p className="text-neutral-500">No fuel stations found within 5km.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {nearbyStations.map(station => (
                                <div key={station._id} className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                            <Fuel size={20} />
                                        </div>
                                        <span className="text-xs font-medium bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                                            {typeof station.distance === 'number' ? `${station.distance.toFixed(1)} km` : 'N/A'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 mb-1">{station.stationName}</h3>
                                    <p className="text-sm text-neutral-500 line-clamp-2 h-10 mb-4">{station.address}</p>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-neutral-50 p-2 rounded-lg text-center">
                                            <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Diesel</div>
                                            <div className="font-bold text-neutral-900">₹{station.dieselPrice}</div>
                                        </div>
                                        <div className="bg-neutral-50 p-2 rounded-lg text-center">
                                            <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Petrol</div>
                                            <div className="font-bold text-neutral-900">₹{station.petrolPrice}</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleOrderClick(station)}
                                        className="w-full py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Order Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => {
                    setIsOrderModalOpen(false);
                    setOrderInitialValues(null);
                }}
                station={selectedStation}
                initialValues={orderInitialValues}
            />

            <RejectedOrderModal
                isOpen={isRejectedModalOpen}
                onClose={() => setIsRejectedModalOpen(false)}
                order={rejectedOrder}
            />
        </div>
    );
};

export default DashboardPage;
