import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

// Import types from the types file
import type { Order, Trade, ChartData, HeaderStats, ActiveTrade } from '../types';

// Define TradeResultState to match what TradeResultModal expects
interface TradeResultState {
  outcome: '';
  pnl: number;
  stake: number;
  profitPercentage: number;
}

interface TradingContextType {
  // Market data
  chartData: ChartData[];
  bids: Order[];
  asks: Order[];
  trades: Trade[];
  headerStats: HeaderStats;
  
  // Trading functionality
  activeTrades: ActiveTrade[];
  activeTrade: ActiveTrade | null;
  tradeResult: TradeResultState | null;
  timeLeft: number;
  isTrading: boolean;
  
  // Actions
  placeTrade: (tradeData: {
    pair: string;
    direction: 'Buy' | 'Sell';
    stake: number;
    duration: number;
  }) => Promise<void>;
  placeOrder: (orderData: {
    pair: string;
    direction: 'Buy' | 'Sell';
    stake: number;
    duration: number;
  }) => Promise<void>;
  completeTrade: (tradeId: string) => Promise<TradeResultState>;
  clearTradeResult: () => void;
  setActivePair: (pair: string) => void;
  getTradeHistory: () => any[];
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useConvexAuth();
  const [activePair, setActivePair] = useState('BTC-USDT');
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null);
  const [tradeResult, setTradeResult] = useState<TradeResultState | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTrading, setIsTrading] = useState(false);
  const [lastProcessedTradeId, setLastProcessedTradeId] = useState<string | null>(null);

  // Convex mutations
  const createBinaryTrade = useMutation(api.binaryTrading.createBinaryTrade);
  const markTradeResultSeen = useMutation(api.binaryTrading.markTradeResultSeen);
  
  // Convex queries
  const activeTrades = useQuery(api.binaryTrading.getActiveTrades, isAuthenticated ? {} : "skip") || [];
  const tradeHistory = useQuery(api.binaryTrading.getTradeHistory, isAuthenticated ? {} : "skip") || [];
  const recentTradeResults = useQuery(api.binaryTrading.getRecentTradeResults, isAuthenticated ? {} : "skip") || [];
  const cryptoCoins = useQuery(api.crypto.getTopCoins, { limit: 100 }) || [];

  // Generate mock market data based on active pair
  const generateMockData = useCallback(() => {
    const symbol = activePair.split('-')[0].toLowerCase();
    const coin = cryptoCoins.find(c => c.symbol === symbol);
    const basePrice = coin?.current_price || 50000;
    
    // Generate mock chart data
    const chartData: ChartData[] = Array.from({ length: 24 }, (_, i) => ({
      name: `${i}:00`,
      price: basePrice + (Math.random() - 0.5) * basePrice * 0.1,
    }));

    // Generate mock order book
    const bids: Order[] = Array.from({ length: 10 }, (_, i) => ({
      price: basePrice - (i + 1) * 10,
      amount: Math.random() * 5,
      total: 0,
    })).map(order => ({ ...order, total: order.price * order.amount }));

    const asks: Order[] = Array.from({ length: 10 }, (_, i) => ({
      price: basePrice + (i + 1) * 10,
      amount: Math.random() * 5,
      total: 0,
    })).map(order => ({ ...order, total: order.price * order.amount }));

    // Generate mock recent trades
    const trades: Trade[] = Array.from({ length: 20 }, (_, i) => ({
      id: `trade-${i}`,
      price: basePrice + (Math.random() - 0.5) * 100,
      amount: Math.random() * 2,
      direction: Math.random() > 0.5 ? 'Buy' : 'Sell',
      time: new Date(Date.now() - i * 60000).toLocaleTimeString(),
    }));

    const headerStats: HeaderStats = {
      lastPrice: basePrice,
      changePercent: coin?.price_change_percentage_24h || 0,
      high: basePrice * 1.05,
      low: basePrice * 0.95,
      isPositive: (coin?.price_change_percentage_24h || 0) >= 0,
    };

    return { chartData, bids, asks, trades, headerStats };
  }, [activePair, cryptoCoins]);

  const mockData = generateMockData();

  // Handle active trade timer
  useEffect(() => {
    if (activeTrade) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, (activeTrade.startTime + activeTrade.settlementDuration * 1000) - Date.now());
        setTimeLeft(Math.floor(remaining / 1000));
        
        if (remaining <= 0) {
          setActiveTrade(null);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeTrade]);

  // Check for recent trade results with improved logic
  useEffect(() => {
    if (recentTradeResults.length > 0) {
      const latestResult = recentTradeResults[0];
      
      // Only process if this is a new trade result
      if (latestResult._id !== lastProcessedTradeId) {
        const success = latestResult.result === 'win';
        const commissionAmount = latestResult.commissionAmount || (latestResult.amount * 0.01);
        
        let profit = 0;
        if (success) {
          // Net profit = potential profit - commission
          const grossProfit = latestResult.potentialProfit || 0;
          profit = grossProfit - commissionAmount;
        } else {
          // Loss = stake amount (commission already deducted)
          profit = -latestResult.amount;
        }
        
        setTradeResult({
          outcome: '',
          pnl: profit,
          stake: latestResult.amount,
          profitPercentage: success ? 
            (profit / latestResult.amount) * 100 : 
            -100,
        });

        setLastProcessedTradeId(latestResult._id);

        // Mark as seen after a short delay to ensure modal is shown
        setTimeout(() => {
          markTradeResultSeen({ tradeId: latestResult._id }).catch(console.error);
        }, 1000);

        // Show toast notification
        if (success) {
          toast.success(`Trade Won! +$${profit.toFixed(2)}`);
        } else {
          toast.error(`Trade Lost: $${profit.toFixed(2)}`);
        }
      }
    }
  }, [recentTradeResults, markTradeResultSeen, lastProcessedTradeId]);

  // Update active trade from backend data
  useEffect(() => {
    if (activeTrades.length > 0 && !activeTrade) {
      const latestTrade = activeTrades[0];
      const activeTrade: ActiveTrade = {
        id: latestTrade._id,
        pair: `${latestTrade.symbol.toUpperCase()}-USDT`,
        direction: latestTrade.direction === 'buy' ? 'Buy' : 'Sell',
        stake: latestTrade.amount,
        entryPrice: latestTrade.entryPrice,
        settlementDuration: latestTrade.duration,
        profitPercentage: latestTrade.profitRate * 100,
        commissionPercentage: 1,
        startTime: latestTrade.startTime,
      };
      setActiveTrade(activeTrade);
    } else if (activeTrades.length === 0 && activeTrade) {
      // Clear active trade if no active trades in backend
      setActiveTrade(null);
    }
  }, [activeTrades, activeTrade]);

  const placeTrade = useCallback(async (tradeData: {
    pair: string;
    direction: 'Buy' | 'Sell';
    stake: number;
    duration: number;
  }) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to place trades');
    }

    setIsTrading(true);
    try {
      const symbol = tradeData.pair.split('-')[0].toLowerCase();
      const coin = cryptoCoins.find(c => c.symbol === symbol);
      
      if (!coin) {
        throw new Error('Coin not found');
      }

      // Determine profit rate based on direction and duration
      let profitRate = 0.85; // Default 85% for buy trades
      
      if (tradeData.direction.toLowerCase() === 'sell') {
        // Sell trades have different profit rates based on duration
        if (tradeData.duration <= 60) {
          profitRate = 0.08; // 8% for short duration (≤60s)
        } else if (tradeData.duration <= 300) {
          profitRate = 0.20; // 20% for medium duration (≤300s)
        } else {
          profitRate = 0.40; // 40% for long duration (>300s)
        }
      }

      const trade = await createBinaryTrade({
        coinId: coin._id,
        symbol: symbol,
        direction: tradeData.direction.toLowerCase() as 'buy' | 'sell',
        amount: tradeData.stake,
        duration: tradeData.duration,
        profitRate: profitRate,
      });

      // Set as active trade
      const activeTrade: ActiveTrade = {
        id: trade.tradeId,
        pair: tradeData.pair,
        direction: tradeData.direction,
        stake: tradeData.stake,
        entryPrice: coin.current_price,
        settlementDuration: tradeData.duration,
        profitPercentage: profitRate * 100,
        commissionPercentage: 1,
        startTime: Date.now(),
      };

      setActiveTrade(activeTrade);
      toast.success(`${tradeData.direction} trade placed for ${tradeData.pair}`);
    } catch (error) {
      console.error('Failed to place trade:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place trade');
      throw error;
    } finally {
      setIsTrading(false);
    }
  }, [isAuthenticated, createBinaryTrade, cryptoCoins]);

  const placeOrder = placeTrade; // Alias for compatibility

  const completeTrade = useCallback(async (tradeId: string): Promise<TradeResultState> => {
    // This is handled automatically by the scheduled settlement
    // Just return a placeholder result
    return {
      outcome: '',
      pnl: 0,
      stake: 0,
      profitPercentage: 0,
    };
  }, []);

  const clearTradeResult = useCallback(() => {
    setTradeResult(null);
    setLastProcessedTradeId(null);
  }, []);

  const getTradeHistory = useCallback(() => {
    return tradeHistory;
  }, [tradeHistory]);

  const value: TradingContextType = {
    // Market data
    chartData: mockData.chartData,
    bids: mockData.bids,
    asks: mockData.asks,
    trades: mockData.trades,
    headerStats: mockData.headerStats,
    
    // Trading functionality
    activeTrades: activeTrades.map(trade => ({
      id: trade._id,
      pair: `${trade.symbol.toUpperCase()}-USDT`,
      direction: trade.direction === 'buy' ? 'Buy' : 'Sell',
      stake: trade.amount,
      entryPrice: trade.entryPrice,
      settlementDuration: trade.duration,
      profitPercentage: trade.profitRate * 100,
      commissionPercentage: 1,
      startTime: trade.startTime,
    })),
    activeTrade,
    tradeResult,
    timeLeft,
    isTrading,
    
    // Actions
    placeTrade,
    placeOrder,
    completeTrade,
    clearTradeResult,
    setActivePair,
    getTradeHistory,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
