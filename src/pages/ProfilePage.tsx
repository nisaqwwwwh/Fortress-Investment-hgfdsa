import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Bell, Lock, CreditCard, Download, Repeat, ArrowLeft, Users, LogOut, AlertCircle, Loader, Camera, ShieldCheck, CheckCircle2, Clock, XCircle, Copy, Info, BookOpen, Headset, Plus, Edit3, Trash2, Star, Crown, Zap } from 'lucide-react';
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { SignInForm } from '../SignInForm';
import { Id } from '../../convex/_generated/dataModel';
import { KYCStatus, ConvexUser, UserProfile, Notification, KYCSubmission, DepositSubmission, WithdrawalSubmission, WithdrawalAddress } from '../types';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from 'sonner';

// --- Reusable Components & Helpers ---

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const FormInput = ({ id, label, type = 'text', value, onChange, placeholder = '', required = true, nameProp }: {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
    required?: boolean;
    nameProp?: string;
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-400">{label}</label>
        <input
            type={type}
            id={id}
            name={nameProp || id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white focus-ring"
        />
    </div>
);

const CountrySelect = ({ id, value, onChange }: { id: string; value: string; onChange: React.ChangeEventHandler<HTMLSelectElement> }) => {
    const countries = [ "Brazil", "United States", "Canada", "United Kingdom", "Germany", "France", "Japan", "Australia", "India", "Mexico", "Argentina", "South Korea" ];
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-400">Country</label>
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white focus-ring"
            >
                <option value="">Select a country</option>
                {countries.map(country => <option key={country} value={country}>{country}</option>)}
            </select>
        </div>
    );
};

const KycStatusBadge = ({ status, onClick }: { status: KYCStatus; onClick?: () => void }) => {
    const statusInfoMap = {
        verified: { Icon: CheckCircle2, text: 'Verified', className: 'bg-green-600/20 text-green-400' },
        approved: { Icon: CheckCircle2, text: 'Verified', className: 'bg-green-600/20 text-green-400' },
        pending: { Icon: Clock, text: 'Pending Review', className: 'bg-yellow-600/20 text-yellow-400' },
        unverified: { Icon: AlertCircle, text: 'Unverified', className: 'bg-gray-600/20 text-gray-400' },
        rejected: { Icon: XCircle, text: 'Rejected', className: 'bg-red-600/20 text-red-400' },
    };
    const statusInfo = statusInfoMap[status] || statusInfoMap.unverified;

    const Tag = onClick ? 'button' : 'span';

    return (
        <Tag
            onClick={onClick}
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${statusInfo.className} ${onClick ? 'hover:opacity-80 transition-opacity btn-hover touch-target' : ''}`}
        >
            <statusInfo.Icon size={14} className="mr-1.5" />
            {statusInfo.text}
        </Tag>
    );
};

const VIPBadge = ({ level, expiry, onClick }: { level: number; expiry?: number; onClick?: () => void }) => {
    const isActive = expiry && expiry > Date.now();
    const vipLevels = {
        1: { name: 'Level 1', color: 'bg-orange-600/20 text-orange-400', icon: Star },
        2: { name: 'Level 2', color: 'bg-gray-400/20 text-gray-300', icon: Zap },
        3: { name: 'Level 3', color: 'bg-yellow-500/20 text-yellow-400', icon: Crown },
        4: { name: 'Level 4', color: 'bg-purple-500/20 text-purple-400', icon: Crown },
        5: { name: 'Level 5', color: 'bg-cyan-500/20 text-cyan-400', icon: Crown },
        6: { name: 'Level 6', color: 'bg-emerald-500/20 text-emerald-400', icon: Crown },
        7: { name: 'Level 7', color: 'bg-gradient-to-r from-yellow-400/20 to-purple-500/20 text-yellow-400', icon: Crown },
    };
    
    const vipInfo = vipLevels[level as keyof typeof vipLevels];
    if (!vipInfo) return null;

    const Tag = onClick ? 'button' : 'span';

    return (
        <Tag
            onClick={onClick}
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${vipInfo.color} ${onClick ? 'hover:opacity-80 transition-opacity btn-hover touch-target' : ''} ${!isActive ? 'opacity-50' : ''}`}
        >
            <vipInfo.icon size={14} className="mr-1.5" />
            {vipInfo.name} VIP {!isActive && '(Expired)'}
        </Tag>
    );
};

const ProfileCard = ({ user, onKycClick, onVipClick }: { user: ConvexUser; onKycClick: () => void; onVipClick: () => void; }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [copied, setCopied] = React.useState(false);

    const handlePhotoClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                // await updateUserPhoto(file);
                console.log("Photo update not implemented yet");
            } catch (error) {
                console.error("Failed to upload photo", error);
            }
        }
    };
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const vipLevel = user.profile?.vipLevel || 0;
    const vipExpiry = user.profile?.vipExpiry;

    return (
        <div className="p-4 bg-gray-800 rounded-2xl shadow-sm space-y-4 page-transition">
            <div className="flex items-center space-x-4">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                <div className="relative group flex-shrink-0 cursor-pointer btn-hover touch-target" onClick={handlePhotoClick}>
                    <img
                        src={user.image || `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`}
                        alt="User"
                        className="w-20 h-20 rounded-full border-4 border-gray-600 bg-gray-700 p-1 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={24} />
                    </div>
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        {user.name}
                    </h1>
                    <p className="text-sm text-gray-400">{user.email}</p>
                     <div className="mt-2 flex flex-wrap gap-2">
                        <KycStatusBadge status={user.profile?.kycStatus ?? 'unverified'} onClick={onKycClick} />
                        {vipLevel > 0 ? (
                            <VIPBadge level={vipLevel} expiry={vipExpiry} onClick={onVipClick} />
                        ) : (
                            <button
                                onClick={onVipClick}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-gray-600/20 text-gray-400 hover:opacity-80 transition-opacity btn-hover touch-target"
                            >
                                <Crown size={14} className="mr-1.5" />
                                VIP Status
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
             <div className="space-y-3 pt-4 border-t border-gray-700 text-sm">
                <div className="flex justify-between items-center">
                     <span className="font-medium text-gray-400">User ID</span>
                     <div className="flex items-center gap-2 text-white font-mono">
                        <span>{user._id.substring(3)}</span>
                        <button onClick={() => handleCopy(user._id)} className="text-gray-400 hover:text-yellow-400 btn-hover touch-target" title="Copy ID">
                            {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>
                 <div className="flex justify-between items-center">
                     <span className="font-medium text-gray-400">Total Assets</span>
                     <span className="font-semibold text-lg text-white">
                         ${(user.portfolio?.balances.USDT ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         <span className="text-sm font-medium text-gray-400 ml-1">USDT</span>
                     </span>
                </div>
            </div>
        </div>
    );
};

const MenuItem = ({ icon, label, onClick, badge }: { icon: React.ReactNode; label: string; onClick: () => void; badge?: number; }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm btn-hover touch-target">
        <div className="flex items-center space-x-4">
            {icon}
            <span className="font-medium text-white">{label}</span>
        </div>
        <div className="flex items-center space-x-3">
            {badge !== undefined && badge > 0 && (
                <span className="bg-yellow-400 text-gray-900 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">{badge}</span>
            )}
            <ChevronRight size={20} className="text-gray-400" />
        </div>
    </button>
);

const ViewContainer = ({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) => (
    <div className="animate-fade-in page-transition">
        <header className="flex items-center mb-6 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 py-2 -mx-4 px-4">
            <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-700 text-white btn-hover touch-target focus-ring">
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
        </header>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

// --- Sub-Views ---

const ProfileView = ({ user, setView, onLogout, isAdmin }: { user: ConvexUser, setView: (view: string) => void, onLogout: () => void, isAdmin: boolean }) => {
    const navigate = useNavigate();
    const unreadCount = user.notifications?.filter((n: Notification) => !n.read).length ?? 0;

    const handleLogout = async () => {
        try {
            await onLogout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <ProfileCard 
                user={user} 
                onKycClick={() => setView('kyc')} 
                onVipClick={() => navigate('/vip')}
            />

            {isAdmin && (
                 <div className="pt-4">
                    <MenuItem icon={<ShieldCheck size={20} className="text-yellow-400"/>} label="Admin Panel" onClick={() => navigate('/admin')} />
                </div>
            )}

            <div className="space-y-2">
                <MenuItem icon={<Crown size={20} className="text-yellow-400" />} label="VIP Membership" onClick={() => navigate('/vip')} />
                <MenuItem icon={<CreditCard size={20} className="text-gray-400" />} label="Deposit" onClick={() => setView('deposit')} />
                <MenuItem icon={<Download size={20} className="text-gray-400" />} label="Withdraw" onClick={() => setView('withdraw')} />
                <MenuItem icon={<Lock size={20} className="text-gray-400" />} label="Bind Address" onClick={() => setView('bind-address')} />
                <MenuItem icon={<Repeat size={20} className="text-gray-400" />} label="Order Management" onClick={() => navigate('/history')} />
            </div>
            <div className="space-y-2">
                <MenuItem icon={<ShieldCheck size={20} className="text-gray-400" />} label="Identity Verification" onClick={() => setView('kyc')} />
                <MenuItem icon={<Bell size={20} className="text-gray-400" />} label="Notifications" onClick={() => setView('notifications')} badge={unreadCount} />
                <MenuItem icon={<Lock size={20} className="text-gray-400" />} label="Security Settings" onClick={() => navigate('/security')} />
            </div>
            <div className="space-y-2">
                 <MenuItem icon={<BookOpen size={20} className="text-gray-400" />} label="Investment Guide" onClick={() => navigate('/investment-guide')} />
                 <MenuItem icon={<Info size={20} className="text-gray-400" />} label="About NISA Investment Advisors" onClick={() => navigate('/about')} />
                 <MenuItem icon={<Headset size={20} className="text-gray-400" />} label="Customer Service" onClick={() => window.open('https://t.me/your-support-link', '_blank', 'noopener,noreferrer')} />
                 <MenuItem icon={<Users size={20} className="text-gray-400" />} label="Refer Friends" onClick={() => navigate('/referral')} />
                 <MenuItem icon={<LogOut size={20} className="text-red-400"/>} label="Log Out" onClick={handleLogout} />
            </div>
        </div>
    );
};

const BindAddressView = ({ onBack }: { onBack: () => void }) => {
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [editingAddress, setEditingAddress] = React.useState<WithdrawalAddress | null>(null);
    
    const withdrawalAddresses = useQuery(api.users.getWithdrawalAddresses);
    const addAddress = useMutation(api.users.addWithdrawalAddress);
    const updateAddress = useMutation(api.users.updateWithdrawalAddress);
    const deleteAddress = useMutation(api.users.deleteWithdrawalAddress);

    const [formData, setFormData] = React.useState({
        label: '',
        address: '',
        network: 'TRC20' as 'TRC20' | 'ERC20' | 'BTC',
        asset: 'USDT',
        isDefault: false,
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const networks = {
        TRC20: { name: 'TRC20 (USDT)', asset: 'USDT', placeholder: 'T...' },
        ERC20: { name: 'ERC20 (USDT)', asset: 'USDT', placeholder: '0x...' },
        BTC: { name: 'Bitcoin', asset: 'BTC', placeholder: 'bc1... or 1... or 3...' },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (editingAddress) {
                await updateAddress({
                    addressId: editingAddress._id as Id<"withdrawalAddresses">,
                    label: formData.label,
                    isDefault: formData.isDefault,
                });
                toast.success('Address updated successfully');
            } else {
                await addAddress({
                    label: formData.label,
                    address: formData.address,
                    network: formData.network,
                    asset: formData.asset,
                    isDefault: formData.isDefault,
                });
                toast.success('Address added successfully');
            }
            
            setFormData({
                label: '',
                address: '',
                network: 'TRC20',
                asset: 'USDT',
                isDefault: false,
            });
            setShowAddForm(false);
            setEditingAddress(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            toast.error(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (address: WithdrawalAddress) => {
        setEditingAddress(address);
        setFormData({
            label: address.label,
            address: address.address,
            network: address.network,
            asset: address.asset,
            isDefault: address.isDefault,
        });
        setShowAddForm(true);
    };

    const handleDelete = async (addressId: Id<"withdrawalAddresses">) => {
        if (confirm('Are you sure you want to delete this address?')) {
            try {
                await deleteAddress({ addressId });
                toast.success('Address deleted successfully');
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Failed to delete address');
            }
        }
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingAddress(null);
        setFormData({
            label: '',
            address: '',
            network: 'TRC20',
            asset: 'USDT',
            isDefault: false,
        });
        setError('');
    };

    return (
        <ViewContainer title="Bind Withdrawal Address" onBack={onBack}>
            {!showAddForm && (
                <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500 transition-colors btn-hover touch-target focus-ring"
                >
                    <Plus size={20} />
                    Add New Address
                </button>
            )}

            {showAddForm && (
                <div className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-white btn-hover touch-target focus-ring"
                        >
                            <XCircle size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormInput
                            id="label"
                            label="Address Label"
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            placeholder="e.g., My Main Wallet"
                        />

                        {!editingAddress && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Network</label>
                                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-700 p-1">
                                        {Object.entries(networks).map(([key, network]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setFormData({ 
                                                    ...formData, 
                                                    network: key as 'TRC20' | 'ERC20' | 'BTC',
                                                    asset: network.asset 
                                                })}
                                                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors btn-hover touch-target focus-ring ${
                                                    formData.network === key 
                                                        ? 'bg-gray-800 text-white shadow-sm' 
                                                        : 'text-gray-400 hover:bg-gray-800/50'
                                                }`}
                                            >
                                                {network.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <FormInput
                                    id="address"
                                    label={`${formData.network} Address`}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder={networks[formData.network].placeholder}
                                />
                            </>
                        )}

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                            />
                            <label htmlFor="isDefault" className="text-sm text-gray-300">
                                Set as default address
                            </label>
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 bg-red-400/10 p-2 rounded">{error}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 flex justify-center py-3 px-4 bg-yellow-400 text-gray-900 rounded-md font-semibold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 btn-hover touch-target"
                            >
                                {isLoading ? <Loader className="animate-spin" size={20} /> : (editingAddress ? 'Update' : 'Add Address')}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-600 btn-hover touch-target focus-ring"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Saved Addresses</h3>
                
                {withdrawalAddresses === undefined ? (
                    <div className="flex justify-center py-8">
                        <Loader className="animate-spin" size={24} />
                    </div>
                ) : withdrawalAddresses.length === 0 ? (
                    <div className="text-center py-8 bg-gray-800 rounded-lg">
                        <Lock size={48} className="mx-auto text-gray-400 mb-4" />
                        <h4 className="text-lg font-semibold text-white mb-2">No Addresses Added</h4>
                        <p className="text-gray-400">Add your first withdrawal address to get started</p>
                    </div>
                ) : (
                    withdrawalAddresses.map((address) => (
                        <div key={address._id} className="p-4 bg-gray-800 rounded-lg">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-white">{address.label}</h4>
                                        {address.isDefault && (
                                            <Star size={16} className="text-yellow-400 fill-current" />
                                        )}
                                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                                            {address.network}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-mono break-all mb-2">
                                        {address.address}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Added {new Date(address.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded btn-hover touch-target focus-ring"
                                        title="Edit"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address._id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded btn-hover touch-target focus-ring"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </ViewContainer>
    );
};

const KycView = ({ user, onBack }: { user: ConvexUser, onBack: () => void }) => {
    const submitKyc = useMutation(api.users.submitKyc);

    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        fullName: user.profile?.fullName || user.name || '',
        dateOfBirth: user.profile?.dateOfBirth || '',
        country: user.profile?.country || '',
        address: user.profile?.address || '',
    });
    const [idFront, setIdFront] = React.useState<File | null>(null);
    const [idBack, setIdBack] = React.useState<File | null>(null);
    const [error, setError] = React.useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setter(file);
        } else {
            e.target.value = '';
            setter(null);
            alert("Please select a valid image file.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!idFront || !idBack) {
            setError('Please upload images of the front and back of your ID.');
            return;
        }
        try {
            setIsLoading(true);
            const idFrontBase64 = await toBase64(idFront);
            const idBackBase64 = await toBase64(idBack);
            
            const kycData: KYCSubmission = {
                ...formData,
                idFrontBase64,
                idBackBase64,
            };
            
            await submitKyc(kycData);
            onBack();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (user.profile?.kycStatus === 'verified' || user.profile?.kycStatus === 'approved') {
        return (
            <ViewContainer title="Identity Verification" onBack={onBack}>
                <div className="text-center p-8 bg-gray-800 rounded-lg">
                    <CheckCircle2 size={64} className="mx-auto text-green-400" />
                    <h3 className="mt-4 text-xl font-bold text-white">You're Verified!</h3>
                    <p className="mt-2 text-gray-400">Your identity has been successfully verified. You have full access to all features.</p>
                </div>
            </ViewContainer>
        );
    }
    
    if (user.profile?.kycStatus === 'pending') {
        return (
             <ViewContainer title="Identity Verification" onBack={onBack}>
                <div className="text-center p-8 bg-gray-800 rounded-lg">
                    <Clock size={64} className="mx-auto text-yellow-400" />
                    <h3 className="mt-4 text-xl font-bold text-white">Verification Pending</h3>
                    <p className="mt-2 text-gray-400">Your documents are under review. This usually takes 1-3 business days. We'll notify you once it's complete.</p>
                </div>
            </ViewContainer>
        );
    }

    return (
        <ViewContainer title="Identity Verification" onBack={onBack}>
            <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Please provide your legal information as it appears on your government-issued ID.</p>
                
                {user.profile?.kycStatus === 'rejected' && (
                    <div className="p-3 bg-red-600/20 text-red-400 rounded-lg">
                        Your previous submission was rejected. Please review your information and try again.
                    </div>
                )}

                <FormInput id="fullName" label="Full Legal Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Your full legal name" />
                <FormInput id="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                <CountrySelect id="country" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                <FormInput id="address" label="Residential Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Crypto Lane" />

                <div>
                    <label className="block text-sm font-medium text-gray-400">ID Front</label>
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, setIdFront)} className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30 w-full text-gray-400 focus-ring" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">ID Back</label>
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, setIdBack)} className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30 w-full text-gray-400 focus-ring" />
                </div>
                
                {error && <p className="text-sm text-red-400">{error}</p>}
                
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 btn-hover touch-target">
                    {isLoading ? <Loader className="animate-spin" /> : 'Submit for Verification'}
                </button>
            </form>
        </ViewContainer>
    );
};

const DepositView = ({ onBack }: { onBack: () => void; }) => {
    const submitDeposit = useMutation(api.transactions.createDepositRequest);
    const [isLoading, setIsLoading] = React.useState(false);
    const [network, setNetwork] = React.useState<'TRC20' | 'ERC20' | 'BTC'>('TRC20');
    const [amount, setAmount] = React.useState('');
    const [txProof, setTxProof] = React.useState<File | null>(null);
    const [txProofPreview, setTxProofPreview] = React.useState<string | null>(null);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [copied, setCopied] = React.useState(false);

    const networks = {
        'TRC20': { name: 'TRC20 (USDT)', address: "TYourTRC20AddressHere123456789", asset: 'USDT' },
        'ERC20': { name: 'ERC20 (USDT)', address: "0xYourERC20AddressHere123456789", asset: 'USDT' },
        'BTC': { name: 'Bitcoin', address: "bc1qYourBTCAddressHere123456789", asset: 'BTC' },
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setTxProof(file);
            setTxProofPreview(URL.createObjectURL(file));
        } else {
            if(file) alert("Please select a valid image file.");
            e.target.value = '';
            setTxProof(null);
            setTxProofPreview(null);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (!txProof) {
            setError('Please upload a transaction proof screenshot.');
            return;
        }

        try {
            setIsLoading(true);
            const proofBase64 = await toBase64(txProof);
            
            const depositData = {
              amount: parseFloat(amount),
              asset: networks[network].asset,
              network,
              transactionHash: `mock_${Date.now()}`, // Mock transaction hash
              proofStorageId: undefined, // We'll handle file upload later
            };
            
            await submitDeposit(depositData);
            setSuccess('Deposit submitted successfully! It will be reviewed by our team and processed within 24 hours.');
            setAmount('');
            setTxProof(null);
            setTxProofPreview(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Deposit submission failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(networks[network].address)}`;

    return (
        <ViewContainer title="Deposit Funds" onBack={onBack}>
            <div className="space-y-6 p-4 bg-gray-800 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Select Network</label>
                    <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-gray-700 p-1">
                        {Object.keys(networks).map((net) => (
                            <button
                                key={net}
                                onClick={() => setNetwork(net as 'TRC20' | 'ERC20' | 'BTC')}
                                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors btn-hover touch-target focus-ring ${network === net ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-800/50'}`}
                            >
                                {networks[net as keyof typeof networks].name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 border border-dashed border-gray-600 rounded-lg text-center">
                    <p className="text-xs text-gray-400 mb-4">Send only {networks[network].asset} to this address. Deposits are manually reviewed and processed within 24 hours.</p>
                    
                    <div className="flex justify-center my-4">
                        <img src={qrCodeUrl} alt={`${networks[network].name} QR Code`} className="rounded-lg border-4 border-gray-600 p-1 bg-white"/>
                    </div>
                    
                    <div className="bg-gray-700 p-3 rounded-md">
                        <p className="text-sm font-mono break-all text-white">{networks[network].address}</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(networks[network].address)}
                      className="mt-4 flex items-center justify-center gap-2 mx-auto text-xs font-semibold text-yellow-400 hover:underline btn-hover touch-target focus-ring"
                    >
                      {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
                      {copied ? 'Address Copied!' : 'Copy Address'}
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                     <FormInput
                        id="amount"
                        label={`Amount (${networks[network].asset})`}
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0.00"
                    />
                     <div>
                        <label className="block text-sm font-medium text-gray-400">Transaction Proof</label>
                        <p className="text-xs text-gray-400 mb-2">Upload a screenshot of your transaction confirmation.</p>
                         <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30 w-full text-gray-400 focus-ring" 
                        />
                         {txProofPreview && (
                            <div className="mt-4">
                               <img src={txProofPreview} alt="Transaction proof preview" className="rounded-lg max-h-48 w-auto mx-auto border border-gray-600"/>
                            </div>
                         )}
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}
                    {success && <p className="text-sm text-green-400">{success}</p>}

                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 btn-hover touch-target">
                        {isLoading ? <Loader className="animate-spin" /> : 'Submit Deposit'}
                    </button>
                </form>

            </div>
        </ViewContainer>
    );
};

const WithdrawView = ({ user, onBack }: { user: ConvexUser; onBack: () => void; }) => {
    const submitWithdrawal = useMutation(api.transactions.createWithdrawalRequest);
    const withdrawalAddresses = useQuery(api.users.getWithdrawalAddresses);
    const [isLoading, setIsLoading] = React.useState(false);
    const [amount, setAmount] = React.useState('');
    const [selectedAddressId, setSelectedAddressId] = React.useState('');
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedAddressId) {
            setError('Please select a withdrawal address');
            return;
        }

        const selectedAddress = withdrawalAddresses?.find(addr => addr._id === selectedAddressId);
        if (!selectedAddress) {
            setError('Invalid address selected');
            return;
        }

        try {
            setIsLoading(true);
            
            const withdrawalData = {
              amount: parseFloat(amount),
              asset: selectedAddress.asset,
              withdrawalMethod: 'crypto',
              usdtArrivalAddress: selectedAddress.address,
            };
            
            await submitWithdrawal(withdrawalData);
            setSuccess(`Withdrawal request for ${amount} ${selectedAddress.asset} submitted. Funds have been deducted and will be processed within 24 hours.`);
            setAmount(''); 
            setSelectedAddressId('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Withdrawal failed.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!user || user.profile?.kycStatus !== 'verified') {
       return (
            <ViewContainer title="Withdraw Funds" onBack={onBack}>
                <div className="p-4 bg-yellow-600/20 text-yellow-400 rounded-lg">
                    <AlertCircle className="inline mr-2" />
                    Please verify your identity before making a withdrawal.
                </div>
            </ViewContainer>
        );
    }

    if (!withdrawalAddresses || withdrawalAddresses.length === 0) {
        return (
            <ViewContainer title="Withdraw Funds" onBack={onBack}>
                <div className="p-4 bg-blue-600/20 text-blue-400 rounded-lg">
                    <Info className="inline mr-2" />
                    Please add a withdrawal address first in the "Bind Address" section.
                </div>
            </ViewContainer>
        );
    }
    
    return (
        <ViewContainer title="Withdraw Funds" onBack={onBack}>
            <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 rounded-lg">
                <div className="p-3 bg-blue-600/20 text-blue-400 rounded-lg text-sm mb-4">
                    <Info className="inline mr-2" size={16} />
                    Withdrawals are manually reviewed and processed within 24 hours for security.
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Select Withdrawal Address</label>
                    <select
                        value={selectedAddressId}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus-ring"
                    >
                        <option value="">Choose an address</option>
                        {withdrawalAddresses.map((address) => (
                            <option key={address._id} value={address._id}>
                                {address.label} ({address.network}) - {address.address.substring(0, 10)}...
                                {address.isDefault && ' (Default)'}
                            </option>
                        ))}
                    </select>
                </div>

                <FormInput 
                    id="amount" 
                    label={`Amount (${withdrawalAddresses.find(addr => addr._id === selectedAddressId)?.asset || 'USDT'})`} 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    placeholder="0.00" 
                />
                
                {error && <p className="text-sm text-red-400">{error}</p>}
                {success && <p className="text-sm text-green-400">{success}</p>}
                
                 <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 btn-hover touch-target">
                    {isLoading ? <Loader className="animate-spin" /> : 'Submit Withdrawal'}
                </button>
            </form>
        </ViewContainer>
    );
};

const NotificationsView = ({ user, onBack }: { user: ConvexUser; onBack: () => void; }) => {
    const markAsRead = useMutation(api.notifications.markAsRead);
    const markAllAsRead = useMutation(api.notifications.markAllAsRead);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleMarkAllRead = async () => {
        if (user.notifications?.some((n: Notification) => !n.read)) {
            try {
                setIsLoading(true);
                await markAllAsRead({});
            } catch (error) {
                console.error('Failed to mark all as read:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    const handleMarkOneRead = async (notificationId: Id<"notifications">) => {
        const notification = user.notifications?.find((n: Notification) => n._id === notificationId);
        if (notification && !notification.read) {
            try {
                await markAsRead({ notificationId });
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        }
    }

    const sortedNotifications = [...(user.notifications ?? [])].sort((a, b) => (b._creationTime || b.timestamp) - (a._creationTime || a.timestamp));
    
    const notificationIcons: Record<Notification['type'], React.ReactNode> = {
        info: <Bell size={24} className="text-blue-400" />,
        success: <CheckCircle2 size={24} className="text-green-400" />,
        warning: <AlertCircle size={24} className="text-yellow-400" />,
        error: <XCircle size={24} className="text-red-400" />,
        transaction: <Repeat size={24} className="text-blue-400" />,
        security: <ShieldCheck size={24} className="text-yellow-400" />,
        system: <Bell size={24} className="text-yellow-400" />,
    };

    return (
        <ViewContainer title="Notifications" onBack={onBack}>
            <div className="mb-4 flex justify-end">
                <button 
                    onClick={handleMarkAllRead}
                    disabled={isLoading || !user.notifications?.some((n: Notification) => !n.read)}
                    className="flex items-center px-3 py-1.5 bg-gray-700 text-gray-300 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed btn-hover touch-target focus-ring"
                >
                    <CheckCircle2 size={16} className="mr-2"/>
                    Mark all as read
                </button>
            </div>
            <div className="space-y-3">
                {sortedNotifications.length > 0 ? (
                    sortedNotifications.map((notification: Notification) => (
                        <div 
                            key={notification._id} 
                            onClick={() => handleMarkOneRead(notification._id as Id<"notifications">)}
                            className={`relative p-4 bg-gray-800 rounded-lg flex items-start space-x-4 border-l-4 transition-colors ${!notification.read ? 'border-yellow-400 cursor-pointer hover:bg-gray-700 btn-hover touch-target' : 'border-transparent'}`}
                        >
                            {!notification.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>}
                            <div className="flex-shrink-0 pt-1">
                                {notificationIcons[notification.type]}
                            </div>
                            <div className="flex-grow">
                                <p className={`font-bold ${!notification.read ? 'text-white' : 'text-gray-400'}`}>{notification.title}</p>
                                <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-300' : 'text-gray-400'}`}>{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(notification._creationTime || notification.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 bg-gray-800 rounded-lg">
                        <Bell size={48} className="mx-auto text-gray-400" />
                        <h3 className="mt-4 text-xl font-bold text-white">You're all caught up!</h3>
                        <p className="mt-2 text-gray-400">You have no new notifications.</p>
                    </div>
                )}
            </div>
        </ViewContainer>
    );
};

// --- Main Component ---

const ProfileScreen = () => {
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
    const { signOut } = useAuthActions();
    const user = useQuery(api.users.getFullUser, isAuthenticated ? {} : "skip");
    const isLoading = authLoading || (isAuthenticated && user === undefined);
    const location = useLocation();
    const navigate = useNavigate();
    const [view, setView] = React.useState('main');

    // --- Back Button Handling Logic ---
    React.useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (view !== 'main') {
                event.preventDefault();
                setView('main');
            } else {
                navigate(-1);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [view, navigate]);

    const changeView = (newView: string) => {
        if (view === 'main' && newView !== 'main') {
            window.history.pushState({ view: newView }, '', location.pathname);
        }
        setView(newView);
    };

    const goBack = () => {
        window.history.back();
    };

    React.useEffect(() => {
        if (location.state?.view) {
            changeView(location.state.view);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-4">
                <SignInForm />
            </div>
        );
    }

    const renderView = () => {
        switch (view) {
            case 'kyc':
                return <KycView user={user} onBack={goBack} />;
            case 'deposit':
                return <DepositView onBack={goBack} />;
            case 'withdraw':
                return <WithdrawView user={user} onBack={goBack} />;
            case 'bind-address':
                return <BindAddressView onBack={goBack} />;
            case 'notifications':
                return <NotificationsView user={user} onBack={goBack} />;
            case 'main':
            default:
                return <ProfileView user={user} setView={changeView} onLogout={signOut} isAdmin={user.profile?.role === 'admin'} />;
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto min-h-screen">
            {renderView()}
        </div>
    );
};

export default ProfileScreen;
