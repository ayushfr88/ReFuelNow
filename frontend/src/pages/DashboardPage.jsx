import React, { useEffect, useState } from 'react';
import { MapPin, Bell, Search, Filter, Fuel, Clock, Navigation } from 'lucide-react';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import WeeklySummary from '../components/dashboard/WeeklySummary';
import DashboardHero from '../components/dashboard/DashboardHero';

const DashboardPage = () => {
    const [address, setAddress] = useState('Detecting location...');
    const [permissionStatus, setPermissionStatus] = useState('prompt');
    const [coordinates, setCoordinates] = useState(null);
    const [nearbyStations, setNearbyStations] = useState([]);
    const [loadingStations, setLoadingStations] = useState(false);

    useEffect(() => {
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
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                setAddress(data.display_name || 'Address not found');
            } catch (error) {
                console.error("Error fetching address:", error);
                setAddress('Unable to fetch address');
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
    }, []);

    const fetchNearbyStations = async (lat, lng) => {
        setLoadingStations(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/stations/nearby?lat=${lat}&lng=${lng}`, {
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

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            <DashboardNavbar address={address} permissionStatus={permissionStatus} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                <DashboardHero />
                <WeeklySummary />

                {/* Nearby Stations Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-neutral-900">Nearby Fuel Stations</h2>
                        <button className="text-sm font-semibold text-green-600 hover:text-green-700">View All</button>
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
                                            {/* Distance would be calculated in backend or here */}
                                            ~2.5 km
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

                                    <button className="w-full py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                                        Order Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
