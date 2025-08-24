import React from 'react';
import { X, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface ActiveTrade {
  id: string;
  pair: string;
  direction: 'Buy' | 'Sell';
  stake: number;
  entryPrice: number;
  settlementDuration: number;
  profitPercentage: number;
  commissionPercentage: number;
  startTime: number;
}

interface ActiveTradeModalProps {
  isOpen: boolean;
  tradeDetails: ActiveTrade | null;
  timeLeft: number;
  livePrice: number;
}

const ActiveTradeModal: React.FC<ActiveTradeModalProps> = ({
  isOpen,
  tradeDetails,
  timeLeft,
  livePrice
}) => {
  if (!isOpen || !tradeDetails) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const priceDiff = livePrice - tradeDetails.entryPrice;
  // SELL trades always show as winning during active period
  const isWinning = tradeDetails.direction === 'Sell' ? true : priceDiff > 0;
  const potentialProfit = isWinning ? 
    tradeDetails.stake * (tradeDetails.profitPercentage / 100) : 
    -tradeDetails.stake;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Active Trade</h2>
          <div className="flex items-center gap-2 text-yellow-400">
            <Clock size={20} />
            <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Pair</span>
            <span className="text-white font-semibold">{tradeDetails.pair}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Direction</span>
            <div className={`flex items-center gap-2 ${
              tradeDetails.direction === 'Buy' ? 'text-green-400' : 'text-red-400'
            }`}>
              {tradeDetails.direction === 'Buy' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-semibold">{tradeDetails.direction}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Stake</span>
            <span className="text-white font-semibold">${tradeDetails.stake.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Entry Price</span>
            <span className="text-white font-semibold">${tradeDetails.entryPrice.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Live Price</span>
            <span className={`font-semibold ${isWinning ? 'text-green-400' : 'text-red-400'}`}>
              ${livePrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">P&L</span>
            <span className={`font-semibold ${isWinning ? 'text-green-400' : 'text-red-400'}`}>
              {isWinning ? '+' : ''}${potentialProfit.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-400">
              Trade will settle in {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveTradeModal;
