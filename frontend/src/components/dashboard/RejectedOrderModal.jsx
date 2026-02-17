import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

const RejectedOrderModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Order Rejected</h3>
                    <p className="text-neutral-500 mb-6">
                        Sorty, your order with <span className="font-semibold text-neutral-900">{order.stationId?.stationName}</span> has been rejected by the seller.
                    </p>

                    <Button
                        onClick={onClose}
                        variant="primary"
                        className="w-full bg-red-600 hover:bg-red-700 border-transparent text-white"
                    >
                        Okay, I understand
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RejectedOrderModal;
