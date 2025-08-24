
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// import { mockCryptoData } from '../data/mockData';
import type { CryptoCoin, SortKey, SortOrder } from '../types';
import CoinRow from '../components/CoinRow';
import SortButton from '../components/SortButton';
import { Search, RefreshCw, AlertCircle } from '../components/Icons';

const Markets: React.FC = () => {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch real-time data from CoinGecko
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
        );
        if (!res.ok) throw new Error('Failed to fetch market data');
        const data = await res.json();
        // Map API data to CryptoCoin type
        setCoins(
          data.map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            image: coin.image,
            current_price: coin.current_price,
            market_cap: coin.market_cap,
            market_cap_rank: coin.market_cap_rank,
            price_change_24h: coin.price_change_24h ?? 0,
            price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
            last_updated: coin.last_updated,
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshData = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Fetch real-time data again
    fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
    )
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch market data');
        return res.json();
      })
      .then(data => {
        setCoins(
          data.map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            image: coin.image,
            current_price: coin.current_price,
            market_cap: coin.market_cap,
            market_cap_rank: coin.market_cap_rank,
            price_change_24h: coin.price_change_24h ?? 0,
            price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
            last_updated: coin.last_updated,
          }))
        );
        setError(null);
      })
      .catch(err => setError(err.message || 'Unknown error'))
      .finally(() => setIsRefreshing(false));
  }, [isRefreshing]);

  const sortedAndFilteredCoins = useMemo(() => {
    return coins
      .filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === null) return 1;
        if (valB === null) return -1;
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [coins, searchTerm, sortKey, sortOrder]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="p-4 border-b border-slate-800 md:border-b-0">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Markets</h1>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="bg-slate-900 border border-slate-800 rounded-lg p-3 disabled:opacity-50 hover:bg-slate-700 transition-colors"
            title="Refresh market data"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Tab */}
      <div className="px-4 pt-4">
        <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          USDT Pairs
        </div>
      </div>

      {/* Search */}
      <div className="px-4 my-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Market Data */}
      <main className="bg-slate-900 mx-4 rounded-lg shadow-lg overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 items-center p-4 border-b border-slate-700">
          <div className="col-span-4">
            <SortButton columnKey="name" label="Name / 24H Vol" currentSortKey={sortKey} currentSortOrder={sortOrder} setSortKey={setSortKey} setSortOrder={setSortOrder}/>
          </div>
          <div className="col-span-4 flex justify-end">
            <SortButton columnKey="current_price" label="Last price" currentSortKey={sortKey} currentSortOrder={sortOrder} setSortKey={setSortKey} setSortOrder={setSortOrder}/>
          </div>
          <div className="col-span-4 flex justify-end">
            <SortButton columnKey="price_change_percentage_24h" label="24H Chg%" currentSortKey={sortKey} currentSortOrder={sortOrder} setSortKey={setSortKey} setSortOrder={setSortOrder}/>
          </div>
        </div>

        {/* Data Rows */}
        <div>
          {loading ? (
            <div className="text-center py-10 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
              <p className="mt-2">Loading Markets...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <AlertCircle size={48} className="mx-auto mb-4" />
              <p>{error}</p>
            </div>
          ) : sortedAndFilteredCoins.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No coins found for '{searchTerm}'</p>
          ) : (
            sortedAndFilteredCoins.map(coin => (
              <CoinRow
                key={coin.id}
                coin={coin}
                navigate={navigate}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Markets;