import React, { useEffect } from 'react';
import { X, ShoppingCart, Download, Upload, Repeat, CreditCard } from 'lucide-react';
import { AlertCircle, CheckCircle } from './Icons';
import { Doc } from '../../convex/_generated/dataModel';

interface TradeResultState {
  outcome: '';
  pnl: number;
  stake: number;
  profitPercentage: number;
}

interface TradeResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result?: TradeResultState | null;
  transaction?: Doc<"transactions"> | null;
}

const TransactionIconDisplay = ({ type, className }: { type: string, className?: string }) => {
  const iconMap: Record<string, React.ReactElement> = {
    'deposit': <Download className={className} />,
    'Deposit': <Download className={className} />,
    'withdrawal': <Upload className={className} />,
    'Withdrawal': <Upload className={className} />,
    'buy': <Repeat className={className} />,
    'sell': <Repeat className={className} />,
    'Contract': <ShoppingCart className={className} />,
    'vip_upgrade': <CreditCard className={className} />,
    'vip_bonus': <CreditCard className={className} />,
  };
  return iconMap[type] || <Repeat className={className} />;
};

const TradeResultModal: React.FC<TradeResultModalProps> = ({ isOpen, onClose, result, transaction }) => {
  useEffect(() => {
    if (isOpen && !transaction) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, transaction]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || (!result && !transaction)) return null;

  const isTradeResult = !!result || (transaction?.type === 'Contract' && !!transaction.contractDetails);

  const displayResult = result || (transaction && isTradeResult ? {
    outcome: '' as '',
    pnl: transaction.contractDetails!.profit ?? -transaction.amount,
    stake: transaction.amount,
    profitPercentage: transaction.contractDetails!.profitPercentage ?? -100,
  } : null);

  const isWin = displayResult ? displayResult.outcome === '' : false;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  const renderTransactionDetails = () => {
    if (!transaction) return null;

    const details: {label: string, value: any, color?: string, mono?: boolean, section?: boolean}[] = [
      { label: 'Date', value: formatDate(transaction.timestamp) },
    ];

    // Only show Type and Status for non-Contract transactions
    if (transaction.type !== 'Contract') {
      details.unshift({ label: 'Type', value: transaction.type });
      details.push({ label: 'Status', value: transaction.reviewStatus || transaction.status || 'Completed' });
    }

    if (transaction.type === 'Deposit' || transaction.type === 'Withdrawal') {
      details.push({ label: 'Amount', value: `${transaction.amount.toFixed(2)} ${transaction.asset}` });
      if(transaction.network) details.push({ label: 'Network', value: transaction.network });
    }

    if (transaction.type === 'buy' || transaction.type === 'sell') {
        details.push({ label: 'Amount', value: `${transaction.amount} ${transaction.symbol.toUpperCase()}` });
        if(transaction.price) details.push({ label: 'Price', value: `$${transaction.price.toFixed(2)}` });
        if(transaction.total) details.push({ label: 'Total', value: `$${transaction.total.toFixed(2)}` });
    }
    
    if (transaction.contractDetails) {
      details.push(
        { label: 'Pair', value: transaction.contractDetails.pair, section: true },
        { label: 'Direction', value: transaction.contractDetails.direction, color: transaction.contractDetails.direction === 'Buy' ? 'text-blue-400' : 'text-green-400' },
        { label: 'Duration', value: `${transaction.contractDetails.duration}s` },
        { label: 'Entry Price', value: `${transaction.contractDetails.entryPrice.toFixed(4)}`, mono: true },
        { label: 'Exit Price', value: `${transaction.contractDetails.exitPrice.toFixed(4)}`, mono: true },
      );
    }

    return (
      <>
        {details.map((d, i) => (
          <div key={i} className={`flex justify-between ${d.section ? 'pt-2 mt-2 border-t border-gray-600' : ''}`}>
            <span className="text-gray-400">{d.label}</span>
            <span className={`text-white ${d.mono ? 'font-mono' : ''} ${d.color || ''}`}>{d.value}</span>
          </div>
        ))}
      </>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg w-full max-w-sm shadow-2xl text-center p-6 space-y-4 relative transform transition-all duration-300 scale-100" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex justify-center mb-4">
          {isTradeResult ? (
            isWin ? <CheckCircle className="w-16 h-16 text-green-500" /> : <AlertCircle className="w-16 h-16 text-red-500" />
          ) : (
            transaction && <TransactionIconDisplay type={transaction.type} className="w-12 h-12 text-gray-400" />
          )}
        </div>
        
        <h2 className={`text-2xl font-bold ${isTradeResult ? (isWin ? 'text-green-500' : 'text-red-500') : 'text-white'}`}>
          {transaction ? (
            transaction.type === 'Contract' ?
              `${transaction.contractDetails?.pair?.replace('-', '/') || 'Trade'}` :
              'Transaction Details'
          ) : 'Trade'}
        </h2>

        {isTradeResult && displayResult && (
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Profit</p>
            <p className={`text-4xl font-bold ${displayResult.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {displayResult.pnl >= 0 ? '+' : ''}${Math.abs(displayResult.pnl).toFixed(2)}
            </p>
          </div>
        )}

        <div className="text-left space-y-2 text-sm">
          {transaction ? renderTransactionDetails() : (
            <>
              <div className="flex justify-between">
                <span className="text-gray-400">Stake</span>
                <span className="text-white">${displayResult?.stake.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Net Profit Rate</span>
                <span className={`${(displayResult?.profitPercentage ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(displayResult?.profitPercentage ?? 0) >= 0 ? '+' : ''}{displayResult?.profitPercentage.toFixed(1)}%
                </span>
              </div>
            </>
          )}
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg text-base hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          {transaction ? 'Close' : 'Continue Trading'}
        </button>

        {!transaction && (
          <p className="text-xs text-gray-500 mt-2">
            This modal will auto-close in 10 seconds
          </p>
        )}
      </div>
    </div>
  );
};

export default TradeResultModal;
