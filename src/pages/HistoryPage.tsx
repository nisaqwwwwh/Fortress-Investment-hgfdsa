import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import TradeResultModal from '../components/TradeResultModal';
import { Doc } from '../../convex/_generated/dataModel';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTrade, setSelectedTrade] = useState<Doc<"binaryTrades"> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const tradeHistory = useQuery(api.binaryTrading.getTradeHistory, { limit: 100 });
  
  const handleTradeClick = (trade: Doc<"binaryTrades">) => {
    setSelectedTrade(trade);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrade(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      timeZone: 'America/New_York',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTradeProfit = (trade: Doc<"binaryTrades">) => {
    if (trade.status === 'active') return 0;
    
    if (trade.result === 'win') {
      // Calculate net profit after commission
      const grossProfit = trade.potentialProfit || 0;
      const commission = trade.commissionAmount || (trade.amount * 0.01);
      return grossProfit - commission;
    } else {
      // Loss is the full stake amount
      return -trade.amount;
    }
  };

  const getProfitPercentage = (trade: Doc<"binaryTrades">) => {
    if (trade.status === 'active') return 0;
    
    const profit = getTradeProfit(trade);
    return (profit / trade.amount) * 100;
  };

  const convertTradeToTransaction = (trade: Doc<"binaryTrades">): Doc<"transactions"> => {
    return {
      _id: trade._id as any, // Type assertion for the modal
      _creationTime: trade._creationTime,
      userId: trade.userId,
      coinId: trade.coinId,
      symbol: trade.symbol,
      type: "Contract" as const,
      amount: trade.amount,
      price: trade.finalPrice,
      total: trade.payout || 0,
      timestamp: trade.actualSettlementTime || trade.settlementTime || trade.startTime,
      status: "completed",
      reviewStatus: "Approved",
      entryPrice: trade.entryPrice,
      finalPrice: trade.finalPrice,
      payout: trade.netPayout || trade.payout,
      settlementDate: trade.actualSettlementTime || trade.settlementTime,
      contractDetails: {
        pair: `${trade.symbol.toUpperCase()}-USDT`,
        direction: trade.direction === 'buy' ? 'Buy' : 'Sell',
        duration: trade.duration,
        outcome: '',
        profit: getTradeProfit(trade),
        profitPercentage: getProfitPercentage(trade),
        entryPrice: trade.entryPrice,
        exitPrice: trade.finalPrice || trade.entryPrice,
      },
    };
  };

  if (tradeHistory === undefined) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-yellow-400 mx-auto mb-4" size={32} />
          <p>Loading trade history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-700 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors -ml-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Trade History</h1>
      </div>

      {/* Trade List */}
      <div className="p-4 space-y-3">
        {tradeHistory && tradeHistory.length > 0 ? (
          tradeHistory.map(trade => {
            const profit = getTradeProfit(trade);
            const profitPercentage = getProfitPercentage(trade);
            const isProfit = profit >= 0;
            const isActive = trade.status === 'active';
            
            return (
              <div 
                key={trade._id} 
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                onClick={() => handleTradeClick(trade)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {/* Pair and Trade Type */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-lg">
                        {trade.symbol.toUpperCase()}/USDT
                      </span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        trade.direction === 'sell' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {trade.direction === 'sell' ? 'Sell' : 'Buy'}({trade.amount.toFixed(2)})
                      </span>
                    </div>
                    
                    {/* Price Range */}
                    <div className="text-sm text-gray-400 mb-2">
                      <span className="font-mono">
                        {trade.entryPrice.toFixed(4)} - {trade.finalPrice ? trade.finalPrice.toFixed(4) : '...'}
                      </span>
                      {!isActive && (
                        <span className={`ml-2 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                          {isProfit ? '↗' : '↘'} {Math.abs(profitPercentage).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    
                    {/* Date */}
                    <div className="text-xs text-gray-500">
                      {formatDate(trade.startTime)}
                      {trade.settlementTime && trade.settlementTime !== trade.startTime && (
                        <span> - {formatDate(trade.settlementTime)}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Profit/Status */}
                  <div className="text-right">
                    {isActive ? (
                      <div className="text-yellow-400 font-bold text-lg">
                        Active
                      </div>
                    ) : (
                      <div className={`font-bold text-xl ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        {isProfit ? '+' : ''}{profit.toFixed(2)}
                      </div>
                    )}
                    {isActive && (
                      <div className="text-xs text-gray-400 mt-1">
                        {trade.duration}s
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            <p className="text-lg font-semibold mb-2">No Trade History</p>
            <p className="text-sm text-gray-400">
              Your completed trades will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Trade Details Modal */}
      {selectedTrade && (
        <TradeResultModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          transaction={convertTradeToTransaction(selectedTrade)}
        />
      )}
    </div>
  );
};

export default HistoryPage;
