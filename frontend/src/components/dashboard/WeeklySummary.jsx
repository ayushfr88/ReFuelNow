import React from 'react';
import { ShoppingBag, Droplet, Truck, RotateCcw } from 'lucide-react';

const SummaryCard = ({ title, value, unit, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-neutral-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-neutral-900">
                    {value} <span className="text-sm font-normal text-neutral-400">{unit}</span>
                </h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                <Icon size={24} className={`text-${color.replace('bg-', '')}-600`} />
            </div>
        </div>
        <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
            <div className={`h-full ${color.replace('bg-', 'bg-')} bg-opacity-80 w-3/4 rounded-full`}></div>
        </div>
    </div>
);

const WeeklySummary = () => {
    const stats = [
        {
            title: "Total Orders",
            value: "12",
            unit: "orders",
            icon: ShoppingBag,
            color: "bg-blue-500"
        },
        {
            title: "Total Quantity",
            value: "450",
            unit: "gallons",
            icon: Droplet,
            color: "bg-green-500"
        },
        {
            title: "Unique Assets",
            value: "8",
            unit: "vehicles",
            icon: Truck,
            color: "bg-orange-500"
        },
        {
            title: "Total Refills",
            value: "24",
            unit: "times",
            icon: RotateCcw,
            color: "bg-purple-500"
        }
    ];

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-800">Weekly Summary</h2>
                <button className="text-sm text-primary font-medium hover:underline">View Full Report</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 mb-1">{stat.title}</p>
                                <h4 className="text-3xl font-bold text-neutral-900">{stat.value}</h4>
                                <span className="text-xs text-neutral-400">{stat.unit}</span>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.color.replace('500', '100')} text-${stat.color.replace('bg-', '').replace('-500', '')}-600`}>
                                <stat.icon size={22} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklySummary;
