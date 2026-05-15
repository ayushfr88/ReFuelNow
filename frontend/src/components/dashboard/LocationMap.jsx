import React, { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';

const LocationMap = ({ coordinates, address }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!coordinates) return null;

    const { latitude: lat, longitude: lng } = coordinates;
    const offset = 0.01;
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-offset},${lat-offset},${lng+offset},${lat+offset}&layer=mapnik&marker=${lat},${lng}`;

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">My Location</h2>
            {/* Small Map Widget */}
            <div 
                className="bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg transition-all group relative cursor-pointer overflow-hidden h-48 w-full md:w-1/2 lg:w-1/3"
                onClick={() => setIsExpanded(true)}
            >
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all rounded-2xl">
                    <div className="bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                        <Maximize2 size={24} className="text-primary" />
                    </div>
                </div>
                <iframe
                    title="User Location Small"
                    src={mapUrl}
                    className="w-full h-full pointer-events-none rounded-2xl"
                    style={{ border: 0 }}
                    loading="lazy"
                />
            </div>

            {/* Large Modal Map */}
            {isExpanded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={() => setIsExpanded(false)}>
                    <div 
                        className="bg-white rounded-3xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 sm:p-6 border-b border-neutral-100 flex justify-between items-center bg-white z-10">
                            <div>
                                <h3 className="font-bold text-neutral-900 text-xl md:text-2xl">My Location Focus</h3>
                                <p className="text-sm md:text-base text-neutral-500 mt-1">{address}</p>
                            </div>
                            <button onClick={() => setIsExpanded(false)} className="p-3 hover:bg-neutral-100 rounded-full transition-colors bg-neutral-50">
                                <X size={24} className="text-neutral-500" />
                            </button>
                        </div>
                        <div className="flex-1 w-full bg-neutral-100 relative">
                            <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center pointer-events-none">
                                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50 text-sm font-semibold text-neutral-700 pointer-events-auto">
                                    Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
                                </div>
                            </div>
                            <iframe
                                title="User Location Large"
                                src={mapUrl}
                                className="w-full h-full"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationMap;
