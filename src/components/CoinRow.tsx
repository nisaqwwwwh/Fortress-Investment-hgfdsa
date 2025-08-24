import React from 'react';
import type { CryptoCoin } from '../types';

interface CoinRowProps {
  coin: CryptoCoin;
  navigate: (path: string) => void;
}

const CoinRow: React.FC<CoinRowProps> = ({ coin, navigate }) => {
  const handleClick = () => {
    navigate(`/trading/${coin.symbol.toLowerCase()}`);
  };

  const priceChangeColor = coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div 
      className="grid grid-cols-12 items-center p-4 hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-700 last:border-b-0"
      onClick={handleClick}
    >
      <div className="col-span-4 flex items-center gap-3">
        <img 
          src={coin.image} 
          alt={coin.name}
          className="w-8 h-8 rounded-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://api.dicebear.com/8.x/initials/svg?seed=${coin.symbol}`;
          }}
        />
        <div>
          <div className="font-semibold text-white">{coin.symbol.toUpperCase()}</div>
          <div className="text-sm text-gray-400">{coin.name}</div>
        </div>
      </div>
      
      <div className="col-span-4 text-right">
        <div className="text-white font-medium">
          ${coin.current_price.toFixed(4)}
        </div>
      </div>
      
      <div className="col-span-4 text-right">
        <div className={`font-medium ${priceChangeColor}`}>
          {coin.price_change_percentage_24h >= 0 ? '+' : ''}
          {coin.price_change_percentage_24h.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default CoinRow;
