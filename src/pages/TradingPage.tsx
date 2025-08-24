import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { useTrading } from '../contexts/TradingContext';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Order } from '../types';
import ActiveTradeModal from '../components/ActiveTradeModal';
import TradeResultModal from '../components/TradeResultModal';
import TradeOrderModal from '../components/TradeOrderModal';
import { ArrowLeft } from 'lucide-react';

// --- Local Components ---

const Header = ({ stats, pair, onBack }: { stats: any, pair: string, onBack: () => void }) => (
  <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-2 hover:bg-gray-700 rounded-lg -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white">{pair.replace('-', '/')}</h1>
      </div>
      <div className={`text-lg font-bold ${stats.isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {stats.lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
    <div className="grid grid-cols-3 gap-x-4 mt-2 text-xs text-gray-400">
      <div>
        <span className="mr-1">24h Chg</span>
        <span className={`${stats.isPositive ? 'text-green-400' : 'text-red-400'}`}>{stats.changePercent.toFixed(2)}%</span>
      </div>
      <p>24h High: {stats.high.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p>24h Low: {stats.low.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  </div>
);

const OrderBook = ({ bids, asks, trades, lastPrice, isPositive }: { bids: Order[], asks: Order[], trades: any[], lastPrice: number, isPositive: boolean }) => {
  const [activeTab, setActiveTab] = useState('orderBook');
  
  const renderOrderRows = (orders: Order[], isBids: boolean) => {
    const maxTotal = Math.max(...orders.map(o => o.total));
    return orders.slice(0, 10).map((order, i) => (
      <div key={i} className="grid grid-cols-3 gap-2 py-1.5 px-4 relative text-xs">
        <div 
          className={`absolute top-0 h-full ${isBids ? 'bg-green-400/10 right-0' : 'bg-red-400/10 left-0'}`} 
          style={{ width: `${(order.total / maxTotal) * 100}%` }}
        ></div>
        <p className={isBids ? 'text-green-400' : 'text-red-400'}>{order.price.toFixed(2)}</p>
        <p className="text-right text-white">{order.amount.toFixed(4)}</p>
        <p className="text-right text-white">{(order.price * order.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
      </div>
    ));
  };
  
  const renderTradeRows = (trades: any[]) => {
    return trades.slice(0, 20).map((trade) => (
      <div key={trade.id} className="grid grid-cols-3 gap-2 py-1.5 px-4 relative text-xs">
        <p className={trade.direction === 'Buy' ? 'text-green-400' : 'text-red-400'}>{trade.price.toFixed(2)}</p>
        <p className="text-right text-white">{trade.amount.toFixed(4)}</p>
        <p className="text-right text-gray-400">{trade.time}</p>
      </div>
    ));
  };

  return (
    <div className="text-xs border-t border-gray-700">
      <div className="grid grid-cols-2 text-center text-sm font-medium border-b border-gray-700">
        <button onClick={() => setActiveTab('orderBook')} className={`py-2 ${activeTab === 'orderBook' ? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-400'}`}>Order Book</button>
        <button onClick={() => setActiveTab('trades')} className={`py-2 ${activeTab === 'trades' ? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-400'}`}>Market Trades</button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 px-4 py-2 text-gray-400">
        <p>Price (USDT)</p>
        <p className="text-right">Amount (BTC)</p>
        <p className="text-right">{activeTab === 'orderBook' ? 'Total (USDT)' : 'Time'}</p>
      </div>

      {activeTab === 'orderBook' ? (
        <>
          <div>{renderOrderRows(asks.slice().reverse(), false)}</div>
          <div className={`py-2 my-1 text-center text-lg font-bold border-y border-gray-700 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {lastPrice.toFixed(2) || '...'}
          </div>
          <div>{renderOrderRows(bids, true)}</div>
        </>
      ) : (
        <div>{renderTradeRows(trades)}</div>
      )}
    </div>
  )
};

const TradePanel = ({ onOpenOrderModal }: { onOpenOrderModal: (direction: 'Buy' | 'Sell') => void }) => {
  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-2 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 z-20">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onOpenOrderModal('Buy')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-base transition-colors"
        >
          Buy / Long
        </button>
        <button
          onClick={() => onOpenOrderModal('Sell')}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-base transition-colors"
        >
          Sell / Short
        </button>
      </div>
    </div>
  );
};

const TradingScreen = () => {
  const { symbol = 'btc' } = useParams();
  const pair = `${symbol.toUpperCase()}-USDT`;
  const navigate = useNavigate();
  const { chartData, bids, asks, trades, placeOrder, headerStats, activeTrade, tradeResult, timeLeft, clearTradeResult, setActivePair } = useTrading();
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getFullUser, isAuthenticated ? {} : "skip");
  
  useEffect(() => {
    setActivePair(pair);
  }, [pair, setActivePair]);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [tradeDirection, setTradeDirection] = useState<'Buy' | 'Sell'>('Buy');

  const handleOpenOrderModal = (direction: 'Buy' | 'Sell') => {
    setTradeDirection(direction);
    setIsOrderModalOpen(true);
  };

  const handlePlaceOrder = async (details: any) => {
    await placeOrder({
      pair: pair,
      direction: details.type === 'buy' ? 'Buy' : 'Sell',
      stake: details.amount,
      duration: details.option.duration,
    });
    setIsOrderModalOpen(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen pb-40">
      <Header stats={headerStats} pair={pair} onBack={() => navigate(-1)} />
      
      <div className="h-64 md:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={headerStats.isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={headerStats.isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#ffffff'
              }} 
            />
            <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide={true} />
            <XAxis dataKey="name" hide={true} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={headerStats.isPositive ? '#10b981' : '#ef4444'} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <OrderBook bids={bids} asks={asks} trades={trades} lastPrice={headerStats.lastPrice} isPositive={headerStats.isPositive} />

      <TradePanel onOpenOrderModal={handleOpenOrderModal} />
      
      <TradeOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        tradeDirection={tradeDirection}
        pair={pair}
        price={headerStats.lastPrice}
        balance={user?.portfolio?.balances?.USDT || 0}
        onPlaceOrder={handlePlaceOrder}
      />

      <ActiveTradeModal
        isOpen={!!activeTrade}
        tradeDetails={activeTrade}
        timeLeft={timeLeft}
        livePrice={headerStats.lastPrice}
      />

      <TradeResultModal
        isOpen={!!tradeResult}
        onClose={clearTradeResult}
        result={tradeResult}
      />
    </div>
  );
};

export default TradingScreen;
