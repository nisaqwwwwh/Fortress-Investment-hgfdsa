import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TradeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeDirection: 'Buy' | 'Sell';
  pair: string;
  price: number;
  balance: number;
  onPlaceOrder: (details: {
    amount: number;
    type: 'buy' | 'sell';
    option: { duration: number; profitRate: number; commissionRate: number };
  }) => void;
}

const tradeOptions = [
  { duration: 100, profitRate: 0.08, commissionRate: 0.05 },
  { duration: 200, profitRate: 0.10, commissionRate: 0.05 },
  { duration: 300, profitRate: 0.20, commissionRate: 0.05 },
  { duration: 600, profitRate: 0.30, commissionRate: 0.05 },
];

const TradeOrderModal: React.FC<TradeOrderModalProps> = ({
  isOpen,
  onClose,
  tradeDirection,
  pair,
  price,
  balance,
  onPlaceOrder,
}) => {
  const [amount, setAmount] = useState<number | string>(10);
  const [selectedOption, setSelectedOption] = useState(tradeOptions[1]);
  const isBuy = tradeDirection === 'Buy';

  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    const numericAmount = Number(amount);
    if (numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (numericAmount > balance) {
      alert("Insufficient balance.");
      return;
    }
    onPlaceOrder({
      amount: numericAmount,
      type: isBuy ? 'buy' : 'sell',
      option: selectedOption,
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  
  const profit = Number(amount) * selectedOption.profitRate;
  const commission = Number(amount) * selectedOption.commissionRate;
  const totalCost = Number(amount) + commission;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className={`text-lg font-semibold ${isBuy ? 'text-green-400' : 'text-red-400'}`}>
            {isBuy ? 'Buy / Long' : 'Sell / Short'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex justify-between text-sm text-gray-300">
            <span>{pair}</span>
            <span>Current Price: ${price.toLocaleString()}</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Settlement Time</label>
            <div className="grid grid-cols-4 gap-2">
              {tradeOptions.map(opt => (
                <button
                  key={opt.duration}
                  onClick={() => setSelectedOption(opt)}
                  className={`p-2 rounded-lg text-center transition-colors border ${
                    selectedOption.duration === opt.duration 
                      ? 'bg-yellow-400 text-gray-900 border-yellow-400' 
                      : 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white'
                  }`}
                >
                  <p className="font-bold">{opt.duration}s</p>
                  <p className="text-xs">+{(opt.profitRate * 100).toFixed(0)}%</p>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Stake Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input 
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className="w-full p-3 pl-7 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Available: ${balance.toLocaleString()}</p>
          </div>

          <div className="space-y-2 text-sm bg-gray-700 p-3 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-400">Commission ({(selectedOption.commissionRate * 100).toFixed(0)}%)</span>
              <span className="text-white">${commission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Cost</span>
              <span className="font-semibold text-white">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Potential Profit</span>
              <span className="font-bold text-green-400">+${profit.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className={`w-full py-3 rounded-lg font-bold text-lg text-white transition-colors ${
              isBuy 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Confirm {tradeDirection}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeOrderModal;
