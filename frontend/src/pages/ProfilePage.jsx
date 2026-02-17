import React, { useState, useEffect } from 'react';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import { User, Mail, Phone, Shield, ArrowLeft, X, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Password Form State
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setPhoneNumber(parsedUser.phone || '');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Please select an image under 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Image = reader.result;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/auth/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify({ profilePicture: base64Image })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to update profile picture');
                }

                const updatedUser = { ...user, profilePicture: data.profilePicture };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));

            } catch (err) {
                alert(err.message);
            }
        };
    };

    const handleSavePhone = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ phone: phoneNumber })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            // Update local state and localStorage
            const updatedUser = { ...user, phone: data.phone };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditingPhone(false);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        if (passwords.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update password');
            }

            setPasswordSuccess('Password updated successfully!');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setPasswordSuccess(null);
            }, 2000);

        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <DashboardNavbar address="Dashboard" permissionStatus="granted" />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link to="/dashboard" className="inline-flex items-center text-neutral-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                </Link>

                <div className="bg-white rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/50 overflow-hidden">
                    <div className="h-48 bg-gradient-to-r from-primary/10 to-accent/10 relative">
                        <div className="absolute -bottom-16 left-8 sm:left-12">
                            <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg relative group">
                                <div className="w-full h-full rounded-full bg-neutral-100 flex items-center justify-center text-primary text-4xl font-bold border-2 border-primary/20 overflow-hidden">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="text-white text-xs font-medium flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                        <span className="mt-1">Change</span>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 sm:px-12 pb-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900">{user.name}</h1>
                                <p className="text-neutral-500 flex items-center gap-2 mt-1">
                                    <Shield size={16} className="text-green-500" />
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
                                </p>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-neutral-900 border-b pb-2">Contact Information</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 mb-1">Full Name</label>
                                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                            <User size={20} className="text-neutral-400" />
                                            <span className="text-neutral-900 font-medium">{user.name}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 mb-1">Email Address</label>
                                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                            <Mail size={20} className="text-neutral-400" />
                                            <span className="text-neutral-900 font-medium">{user.email}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 mb-1">Phone Number</label>
                                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                            <Phone size={20} className="text-neutral-400" />
                                            {isEditingPhone ? (
                                                <div className="flex-1 flex gap-2">
                                                    <input
                                                        type="tel"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="flex-1 bg-white border border-neutral-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
                                                        placeholder="Enter phone number"
                                                    />
                                                    <button
                                                        onClick={handleSavePhone}
                                                        disabled={loading}
                                                        className="text-primary text-xs font-semibold hover:underline disabled:opacity-50"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsEditingPhone(false);
                                                            setPhoneNumber(user.phone || '');
                                                        }}
                                                        className="text-neutral-500 text-xs hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex justify-between items-center">
                                                    <span className={`${user.phone ? 'text-neutral-900 font-medium' : 'text-neutral-500 italic'}`}>
                                                        {user.phone || 'Not added'}
                                                    </span>
                                                    <button
                                                        onClick={() => setIsEditingPhone(true)}
                                                        className="text-primary text-xs font-semibold hover:underline"
                                                    >
                                                        {user.phone ? 'Edit' : 'Add'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-neutral-900 border-b pb-2">Account Settings</h3>
                                <p className="text-neutral-500 text-sm">Manage your password and security preferences here.</p>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => setIsPasswordModalOpen(true)}
                                >
                                    <Lock size={18} className="mr-2" />
                                    Change Password
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-neutral-900">Change Password</h2>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                <X size={20} className="text-neutral-500" />
                            </button>
                        </div>

                        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                            {passwordSuccess ? (
                                <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium">
                                    {passwordSuccess}
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    {passwordError && (
                                        <div className="text-red-500 text-sm">{passwordError}</div>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full py-3"
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
