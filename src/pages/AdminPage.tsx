import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  CreditCard, 
  Download, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye,
  Filter,
  Search,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { Id } from '../../convex/_generated/dataModel';

type TabType = 'overview' | 'deposits' | 'withdrawals' | 'kyc' | 'users';

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Check if user is admin
  const currentUser = useQuery(api.users.getFullUser);
  const isAdmin = currentUser?.profile?.role === 'admin';

  // Admin queries
  const adminStats = useQuery(api.admin.getAdminStats, isAdmin ? {} : "skip");
  const pendingDeposits = useQuery(api.admin.getPendingDeposits, isAdmin ? {} : "skip");
  const pendingWithdrawals = useQuery(api.admin.getPendingWithdrawals, isAdmin ? {} : "skip");
  const pendingKyc = useQuery(api.admin.getPendingKyc, isAdmin ? {} : "skip");
  const allUsers = useQuery(api.admin.getAllUsers, isAdmin ? {} : "skip");

  // Admin mutations
  const approveTransaction = useMutation(api.admin.approveTransaction);
  const rejectTransaction = useMutation(api.admin.rejectTransaction);
  const approveKyc = useMutation(api.admin.approveKyc);
  const rejectKyc = useMutation(api.admin.rejectKyc);
  const updateUserRole = useMutation(api.admin.updateUserRole);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={64} className="mx-auto text-red-400 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-4">You don't have permission to access the admin panel.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleApproveTransaction = async (transactionId: Id<"transactions">) => {
    try {
      await approveTransaction({ transactionId });
      toast.success('Transaction approved successfully');
    } catch (error) {
      toast.error('Failed to approve transaction');
    }
  };

  const handleRejectTransaction = async (transactionId: Id<"transactions">, reason?: string) => {
    try {
      await rejectTransaction({ transactionId, reason });
      toast.success('Transaction rejected');
    } catch (error) {
      toast.error('Failed to reject transaction');
    }
  };

  const handleApproveKyc = async (kycId: Id<"kycSubmissions">) => {
    try {
      await approveKyc({ kycId });
      toast.success('KYC approved successfully');
    } catch (error) {
      toast.error('Failed to approve KYC');
    }
  };

  const handleRejectKyc = async (kycId: Id<"kycSubmissions">, reason?: string) => {
    try {
      await rejectKyc({ kycId, reason });
      toast.success('KYC rejected');
    } catch (error) {
      toast.error('Failed to reject KYC');
    }
  };

  const StatCard = ({ title, value, icon, color = 'text-white' }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: string;
  }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );

  const TransactionCard = ({ transaction, type, onApprove, onReject }: {
    transaction: any;
    type: 'deposit' | 'withdrawal';
    onApprove: () => void;
    onReject: () => void;
  }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {type === 'deposit' ? (
            <Download size={20} className="text-green-400" />
          ) : (
            <Upload size={20} className="text-red-400" />
          )}
          <div>
            <h3 className="font-semibold text-white capitalize">{type}</h3>
            <p className="text-sm text-gray-400">
              {transaction.amount} {transaction.asset || transaction.symbol}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">
            {new Date(transaction.timestamp).toLocaleDateString()}
          </p>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        </div>
      </div>

      {transaction.transactionHash && (
        <div className="mb-3">
          <p className="text-xs text-gray-400">Transaction Hash:</p>
          <p className="text-sm font-mono text-white break-all">
            {transaction.transactionHash}
          </p>
        </div>
      )}

      {transaction.network && (
        <div className="mb-3">
          <p className="text-xs text-gray-400">Network:</p>
          <p className="text-sm text-white">{transaction.network}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle2 size={16} />
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <XCircle size={16} />
          Reject
        </button>
      </div>
    </div>
  );

  const KycCard = ({ kyc, onApprove, onReject }: {
    kyc: any;
    onApprove: () => void;
    onReject: () => void;
  }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-blue-400" />
          <div>
            <h3 className="font-semibold text-white">{kyc.fullName}</h3>
            <p className="text-sm text-gray-400">{kyc.country}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">
            {new Date(kyc.submittedAt).toLocaleDateString()}
          </p>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Date of Birth:</span>
          <span className="text-white">{kyc.dateOfBirth}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Address:</span>
          <span className="text-white text-right">{kyc.address}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">ID Front</p>
          <img 
            src={kyc.idFrontBase64} 
            alt="ID Front" 
            className="w-full h-20 object-cover rounded border border-gray-600"
          />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">ID Back</p>
          <img 
            src={kyc.idBackBase64} 
            alt="ID Back" 
            className="w-full h-20 object-cover rounded border border-gray-600"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle2 size={16} />
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <XCircle size={16} />
          Reject
        </button>
      </div>
    </div>
  );

  const UserCard = ({ user, onUpdateRole }: {
    user: any;
    onUpdateRole: (userId: Id<"users">, role: string) => void;
  }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={user.image || `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-white">{user.name}</h3>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="text-right">
          <select
            value={user.profile?.role || 'user'}
            onChange={(e) => onUpdateRole(user._id, e.target.value)}
            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">KYC Status:</span>
          <span className={`ml-2 ${
            user.profile?.kycStatus === 'approved' ? 'text-green-400' :
            user.profile?.kycStatus === 'pending' ? 'text-yellow-400' :
            user.profile?.kycStatus === 'rejected' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {user.profile?.kycStatus || 'Unverified'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">VIP Level:</span>
          <span className="ml-2 text-white">{user.profile?.vipLevel || 0}</span>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={adminStats?.totalUsers || 0}
                icon={<Users size={24} />}
              />
              <StatCard
                title="Pending Deposits"
                value={adminStats?.pendingDeposits || 0}
                icon={<Download size={24} />}
                color="text-green-400"
              />
              <StatCard
                title="Pending Withdrawals"
                value={adminStats?.pendingWithdrawals || 0}
                icon={<Upload size={24} />}
                color="text-red-400"
              />
              <StatCard
                title="Pending KYC"
                value={adminStats?.pendingKyc || 0}
                icon={<ShieldCheck size={24} />}
                color="text-blue-400"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Activity size={16} className="text-blue-400" />
                    <span className="text-gray-300">System running normally</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp size={16} className="text-green-400" />
                    <span className="text-gray-300">Trading volume up 15%</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign size={16} className="text-yellow-400" />
                    <span className="text-gray-300">New deposits processed</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('deposits')}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                  >
                    Review Pending Deposits ({adminStats?.pendingDeposits || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('withdrawals')}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                  >
                    Review Pending Withdrawals ({adminStats?.pendingWithdrawals || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('kyc')}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                  >
                    Review Pending KYC ({adminStats?.pendingKyc || 0})
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'deposits':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Pending Deposits</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingDeposits?.map((deposit) => (
                <TransactionCard
                  key={deposit._id}
                  transaction={deposit}
                  type="deposit"
                  onApprove={() => handleApproveTransaction(deposit._id)}
                  onReject={() => handleRejectTransaction(deposit._id, 'Invalid transaction')}
                />
              ))}
            </div>

            {pendingDeposits?.length === 0 && (
              <div className="text-center py-12">
                <Download size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Pending Deposits</h3>
                <p className="text-gray-400">All deposits have been processed.</p>
              </div>
            )}
          </div>
        );

      case 'withdrawals':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Pending Withdrawals</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingWithdrawals?.map((withdrawal) => (
                <TransactionCard
                  key={withdrawal._id}
                  transaction={withdrawal}
                  type="withdrawal"
                  onApprove={() => handleApproveTransaction(withdrawal._id)}
                  onReject={() => handleRejectTransaction(withdrawal._id, 'Insufficient verification')}
                />
              ))}
            </div>

            {pendingWithdrawals?.length === 0 && (
              <div className="text-center py-12">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Pending Withdrawals</h3>
                <p className="text-gray-400">All withdrawals have been processed.</p>
              </div>
            )}
          </div>
        );

      case 'kyc':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Pending KYC Verifications</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingKyc?.map((kyc) => (
                <KycCard
                  key={kyc._id}
                  kyc={kyc}
                  onApprove={() => handleApproveKyc(kyc._id)}
                  onReject={() => handleRejectKyc(kyc._id, 'Documents unclear')}
                />
              ))}
            </div>

            {pendingKyc?.length === 0 && (
              <div className="text-center py-12">
                <ShieldCheck size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Pending KYC</h3>
                <p className="text-gray-400">All KYC submissions have been reviewed.</p>
              </div>
            )}
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allUsers?.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onUpdateRole={async (userId, role) => {
                    try {
                      await updateUserRole({ userId, role });
                      toast.success('User role updated successfully');
                    } catch (error) {
                      toast.error('Failed to update user role');
                    }
                  }}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Welcome,</span>
              <span className="text-sm font-semibold">{currentUser?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'deposits', label: 'Deposits', icon: Download },
              { id: 'withdrawals', label: 'Withdrawals', icon: Upload },
              { id: 'kyc', label: 'KYC', icon: ShieldCheck },
              { id: 'users', label: 'Users', icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminPage;
