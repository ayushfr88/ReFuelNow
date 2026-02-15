import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Check, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const AddStationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        stationName: '',
        address: '',
        dieselPrice: '',
        petrolPrice: '',
        latitude: '',
        longitude: ''
    });
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const detectLocation = () => {
        setLoadingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            // Reverse Geocoding with OpenStreetMap
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                setFormData(prev => ({
                    ...prev,
                    latitude,
                    longitude,
                    address: data.display_name
                }));
            } catch (error) {
                console.error("Error fetching address:", error);
                setLocationError("Found location but failed to get address.");
                setFormData(prev => ({
                    ...prev,
                    latitude,
                    longitude
                }));
            } finally {
                setLoadingLocation(false);
            }
        }, (error) => {
            console.error("Error getting location:", error);
            setLocationError("Unable to retrieve your location. Please allow location access.");
            setLoadingLocation(false);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Not authorized. Please login.');
            navigate('/login');
            return;
        }

        const stationData = {
            stationName: formData.stationName,
            address: formData.address,
            dieselPrice: parseFloat(formData.dieselPrice),
            petrolPrice: parseFloat(formData.petrolPrice),
            location: {
                type: 'Point',
                coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
            }
        };

        try {
            const response = await fetch('http://localhost:5000/api/stations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(stationData)
            });

            if (response.ok) {
                navigate('/seller-dashboard');
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to add station');
            }
        } catch (error) {
            console.error('Error adding station:', error);
            alert('Server error');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
                <button onClick={() => navigate('/seller-dashboard')} className="flex items-center text-neutral-500 hover:text-green-600 mb-6">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>

                <h1 className="text-2xl font-bold mb-6">Add New Fuel Station</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Station Name</label>
                        <input
                            type="text"
                            name="stationName"
                            value={formData.stationName}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Address & Location</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address or detect location"
                                className="flex-1 p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                                required
                            />
                            <Button type="button" onClick={detectLocation} variant="outline" disabled={loadingLocation}>
                                {loadingLocation ? 'Detecting...' : <><MapPin size={18} className="mr-2" /> Detect</>}
                            </Button>
                        </div>
                        {locationError && <p className="text-red-500 text-sm mt-1">{locationError}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Diesel Price (₹)</label>
                            <input
                                type="number"
                                name="dieselPrice"
                                value={formData.dieselPrice}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Petrol Price (₹)</label>
                            <input
                                type="number"
                                name="petrolPrice"
                                value={formData.petrolPrice}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-neutral-200 focus:border-green-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" variant="primary" className="w-full py-3">
                        Save Station
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AddStationPage;
