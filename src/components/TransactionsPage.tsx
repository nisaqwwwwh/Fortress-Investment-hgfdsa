import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Repeat, Download, Upload, CreditCard, Loader2, ShoppingCart, XCircle } from 'lucide-react';
import TradeResultModal from './TradeResultModal';
import { Doc } from '../../convex/_generated/dataModel';

const TransactionIcon = ({ type }: { type: string }) => {
  const iconMap: Record<string, React.ReactElement> = {
    'deposit': <Download className="w-5 h-5 text-green-400" />,
    'Deposit': <Download className="w-5 h-5 text-green-400" />,
    'withdrawal': <Upload className="w-5 h-5 text-red-400" />,
    'Withdrawal': <Upload className="w-5 h-5 text-red-400" />,
    'buy': <Repeat className="w-5 h-5 text-blue-400" />,
    'sell': <Repeat className="w-5 h-5 text-blue-400" />,
    'Contract': <ShoppingCart className="w-5 h-5 text-purple-400" />,
    'vip_upgrade': <CreditCard className="w-5 h-5 text-yellow-400" />,
    'vip_bonus': <CreditCard className="w-5 h-5 text-yellow-400" />,
  };
  return iconMap[type] || <Repeat className="w-5 h-5 text-gray-400" />;
};

const StatusIcon = ({ status }: { status: string }) => {
  const statusMap: Record<string, React.ReactElement> = {
    'completed': <CheckCircle className="w-4 h-4 text-green-400" />,
    'Completed': <CheckCircle className="w-4 h-4 text-green-400" />,
    'approved': <CheckCircle className="w-4 h-4 text-green-400" />,
    'Approved': <CheckCircle className="w-4 h-4 text-green-400" />,
    'pending': <Clock className="w-4 h-4 text-yellow-400" />,
    'Pending': <Clock className="w-4 h-4 text-yellow-400" />,
    'rejected': <AlertCircle className="w-4 h-4 text-red-400" />,
    'Rejected': <AlertCircle className="w-4 h-4 text-red-400" />,
    'failed': <AlertCircle className="w-4 h-4 text-red-400" />,
    'Failed': <AlertCircle className="w-4 h-4 text-red-400" />,
  };
  return statusMap[status] || <Clock className="w-4 h-4 text-gray-400" />;
};

// New component for detailed contract/trade history rows
const ContractTransactionRow = ({ tx, onClick }: { tx: Doc<"transactions">, onClick: (tx: Doc<"transactions">) => void }) => {
  if (!tx.contractDetails) return null;

  const { pair, direction, outcome, profit, entryPrice, exitPrice, duration } = tx.contractDetails;
  const isWin = outcome === 'Win';

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      timeZone: 'America/New_York'
    });
  };

  return (
    <div 
      className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-700/50 transition-colors"
      onClick={() => onClick(tx)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isWin ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {isWin ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
        </div>
        <div className="flex-grow grid grid-cols-2 gap-x-2 text-sm">
          <div>
            <p className="font-semibold">{pair} <span className="text-xs text-gray-400">({duration}s)</span></p>
            <p className={`font-semibold ${direction === 'Buy' ? 'text-green-400' : 'text-red-400'}`}>{direction}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Entry / Exit</p>
            <p className="text-sm font-mono">{entryPrice.toFixed(2)} → {exitPrice.toFixed(2)}</p>
          </div>
        </div>
        <div className="text-right pl-2">
          <p className={`font-bold text-lg ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            {tx.settlementDate ? formatDate(tx.settlementDate) : formatDate(tx.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'Contract' | 'vip'>('All');
  const [selectedTransaction, setSelectedTransaction] = useState<Doc<"transactions"> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const transactions = useQuery(api.transactions.getUserTransactions, { 
    type: filter === 'All' ? 'all' : filter === 'vip' ? 'vip' : filter 
  });
  
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions;
  }, [transactions]);

  const filters: ('All' | 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'Contract' | 'vip')[] = ['All', 'buy', 'sell', 'deposit', 'withdrawal', 'Contract', 'vip'];

  const handleTransactionClick = (transaction: Doc<"transactions">) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const formatTransactionDetails = (tx: any) => {
    switch (tx.type) {
      case 'buy':
        return `Bought ${tx.amount} ${tx.symbol.toUpperCase()} at ${tx.price?.toFixed(2) || 'N/A'}`;
      case 'sell':
        return `Sold ${tx.amount} ${tx.symbol.toUpperCase()} at ${tx.price?.toFixed(2) || 'N/A'}`;
      case 'deposit':
      case 'Deposit':
        return `Deposited ${tx.amount} ${tx.asset || tx.symbol.toUpperCase()}`;
      case 'withdrawal':
      case 'Withdrawal':
        return `Withdrew ${tx.amount} ${tx.asset || tx.symbol.toUpperCase()}`;
      case 'Contract':
        if (tx.contractDetails) {
          return `${tx.contractDetails.direction} ${tx.contractDetails.pair} • ${tx.contractDetails.duration}s`;
        }
        return 'Binary Contract';
      case 'vip_upgrade':
        return `VIP Level ${tx.vipLevel} Upgrade`;
      case 'vip_bonus':
        return `VIP Bonus Payment`;
      default:
        return `${tx.type} transaction`;
    }
  };

  const getTransactionAmount = (tx: any) => {
    if (tx.type === 'buy') return -tx.total || -tx.amount;
    if (tx.type === 'sell') return tx.total || tx.amount;
    if (tx.type === 'deposit' || tx.type === 'Deposit') {
      const status = tx.reviewStatus || tx.status || 'Approved';
      return status === 'Approved' ? (tx.actualArrival || tx.amount) : 0;
    }
    if (tx.type === 'withdrawal' || tx.type === 'Withdrawal') return -tx.amount;
    if (tx.type === 'Contract') {
      if (tx.contractDetails) {
        return tx.contractDetails.profit;
      }
      return tx.payout ? tx.payout - tx.amount : -tx.amount;
    }
    if (tx.type === 'vip_bonus') return tx.amount;
    if (tx.type === 'vip_upgrade') return -tx.amount;
    return tx.amount;
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
      time: date.toLocaleTimeString('en-US', { timeZone: 'America/New_York' })
    };
  };

  if (transactions === undefined) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-yellow-400 mx-auto mb-4" size={32} />
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-700 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors -ml-2"
          title="Go back"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Go back</span>
        </button>
        <h1 className="text-xl font-semibold">Transaction History</h1>
      </div>

      {/* Filters */}
      <div className="p-4">
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg p-1 overflow-x-auto">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
                filter === f 
                  ? 'bg-yellow-400 text-gray-900' 
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              {f === 'vip' ? 'VIP' : f === 'Contract' ? 'Contracts' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-4 space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => 
            filter === 'Contract' && tx.contractDetails ? (
              <ContractTransactionRow key={tx._id} tx={tx} onClick={handleTransactionClick} />
            ) : (
              <div 
                key={tx._id} 
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                onClick={() => handleTransactionClick(tx)}
              >
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <TransactionIcon type={tx.type} />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">{tx.type === 'Contract' ? 'Binary Contract' : tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</p>
                  <p className="text-xs text-gray-400">{formatTransactionDetails(tx)}</p>
                  <p className="text-xs text-gray-400">
                    {formatDateTime(tx.timestamp).date} {formatDateTime(tx.timestamp).time}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    getTransactionAmount(tx) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {getTransactionAmount(tx) >= 0 ? '+' : ''}${Math.abs(getTransactionAmount(tx)).toFixed(2)}
                    <span className="text-xs font-normal text-gray-400 ml-1">
                      {tx.asset || (tx.symbol ? tx.symbol.toUpperCase() : 'USDT')}
                    </span>
                  </p>
                  <div className="flex items-center justify-end gap-1.5 text-xs text-gray-400">
                    <StatusIcon status={tx.reviewStatus || tx.status || 'completed'} />
                    <span>{tx.reviewStatus || tx.status || 'Completed'}</span>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <div className="text-center py-20">
            <div className="mb-4">
              <Repeat size={48} className="mx-auto text-gray-600" />
            </div>
            <p className="text-lg font-semibold mb-2">No Transactions Found</p>
            <p className="text-sm text-gray-400">
              {filter === 'All' 
                ? 'Your transaction history will appear here.' 
                : `No ${filter} transactions found.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <TradeResultModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionsPage;
