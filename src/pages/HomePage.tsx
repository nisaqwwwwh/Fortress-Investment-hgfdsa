import React from 'react';
import nisaLogo from '../assets/nisa-logo.png';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Users, Shield, Zap, ArrowRight, Star, Crown, Gift, CreditCard, Download, User, MessageSquare } from 'lucide-react';
import { useMutation, useAction, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
// import { api } from "../convex/_generated/api";
// import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  // Removed Convex user query
  const [topCoins, setTopCoins] = React.useState<any[] | null>(null);
  const [topCoinsLoading, setTopCoinsLoading] = React.useState(true);
  const [topCoinsError, setTopCoinsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTopCoinsLoading(true);
    setTopCoinsError(null);
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch market data');
        return res.json();
      })
      .then(data => setTopCoins(data))
      .catch(err => setTopCoinsError(err.message || 'Unknown error'))
      .finally(() => setTopCoinsLoading(false));
  }, []);
  // Removed Convex user balance, portfolio, and mutations

  // Removed Convex user initialization effect

  // Removed sample data loader

  // Show loading state while authentication is being determined
  if (isLoading) {
    return (
      <div className="full-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center container-responsive">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, this shouldn't happen due to ProtectedRoute, but just return null
  if (!isAuthenticated) {
    return null;
  }

  // Removed portfolio and balance calculations

  const carouselSlides = [
    {
      bg: 'https://images.unsplash.com/photo-1639755243242-73a67fd7a40b?q=80&w=2070&auto=format&fit=crop',
      title: "SECURE & RELIABLE",
      subtitle: "trade with confidence",
      logos: [
        'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
        'https://s2.coinmarketcap.com/static/img/exchanges/64x64/89.png',
        'https://s2.coinmarketcap.com/static/img/exchanges/64x64/70.png',
        'https://s2.coinmarketcap.com/static/img/exchanges/64x64/24.png',
        'https://s2.coinmarketcap.com/static/img/exchanges/64x64/37.png',
      ]
    }
  ];

  const actionMenuItems = [
    { icon: CreditCard, label: 'Deposit', path: '/profile', state: { view: 'deposit' } },
    { icon: Download, label: 'Withdraw', path: '/profile', state: { view: 'withdraw' } },
    { icon: User, label: 'Profile', path: '/profile', state: { view: 'main' } },
    { icon: MessageSquare, label: 'Support', path: '/support' },
  ];

  return (
    <div className="full-screen bg-gray-900 overflow-y-auto">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-700 p-3 sm:p-4 md:p-6 safe-area-pt">
        <div className="container-responsive">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src={nisaLogo} 
                alt="NISA investment advisor logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">NISA investment advisor</h1>
                <p className="text-xs sm:text-sm text-gray-300">Professional Trading Platform</p>
              </div>
            </div>
  {/* Removed user welcome and balance UI */}
          </div>
        </div>
      </header>

      {/* Carousel Section */}
      <section className="p-3 sm:p-4 md:p-6">
        <div className="container-responsive">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl">
            {carouselSlides.map((slide, index) => (
              <div
                key={index}
                className={`relative h-40 sm:h-48 md:h-56 lg:h-64 bg-cover bg-center rounded-xl sm:rounded-2xl home-carousel-bg`}
                data-bg={slide.bg}
                data-bgimg={slide.bg}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70 rounded-xl sm:rounded-2xl flex flex-col justify-center items-center text-center p-4 sm:p-6">
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-wide">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-200 font-medium uppercase tracking-wider">
                      {slide.subtitle}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 max-w-xs sm:max-w-sm">
                    {slide.logos.map((logo, logoIndex) => (
                      <div key={logoIndex} className="relative group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                          <img
                            src={logo}
                            alt={`Exchange ${logoIndex + 1}`}
                            className="w-full h-full object-contain rounded-md sm:rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.parentElement?.remove();
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 sm:mt-4 flex items-center space-x-1 sm:space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-gray-300 font-medium">Trusted by millions worldwide</span>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="p-3 sm:p-4 md:p-6">
        <div className="container-responsive">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {actionMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path, item.state ? { state: item.state } : undefined)}
                className="bg-gray-800 hover:bg-gray-700 p-3 sm:p-4 rounded-lg transition-colors flex flex-col items-center touch-target"
              >
                <item.icon size={20} className="sm:w-6 sm:h-6 text-yellow-400 mb-1 sm:mb-2" />
                <span className="text-xs sm:text-sm font-semibold text-white text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Promotion */}
      <section className="mx-3 sm:mx-4 md:mx-6 mb-3 sm:mb-4 md:mb-6">
        <div className="container-responsive">
          <div 
            onClick={() => navigate('/vip')}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-3 sm:p-4 rounded-lg cursor-pointer hover:from-yellow-500 hover:to-yellow-400 transition-all touch-target"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Crown size={20} className="sm:w-6 sm:h-6 text-yellow-100" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-yellow-100">VIP Membership</h3>
                  <p className="text-xs sm:text-sm text-yellow-200">Unlock exclusive benefits</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Gift size={16} className="sm:w-5 sm:h-5 text-yellow-100" />
                <ArrowRight size={16} className="sm:w-5 sm:h-5 text-yellow-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="p-3 sm:p-4 md:p-6">
        <div className="container-responsive">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">Market Overview</h2>
            <button
              onClick={() => navigate('/market')}
              className="text-yellow-400 hover:text-yellow-300 flex items-center space-x-1 text-sm sm:text-base touch-target"
            >
              <span>View All</span>
              <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {topCoinsLoading ? (
            <div className="space-y-2 sm:space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 p-3 sm:p-4 rounded-lg animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full"></div>
                      <div>
                        <div className="w-12 h-3 sm:w-16 sm:h-4 bg-gray-700 rounded mb-1"></div>
                        <div className="w-8 h-2 sm:w-12 sm:h-3 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-3 sm:w-20 sm:h-4 bg-gray-700 rounded mb-1"></div>
                      <div className="w-12 h-2 sm:w-16 sm:h-3 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : topCoinsError ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-red-400 mb-3 sm:mb-4 text-sm sm:text-base">{topCoinsError}</p>
            </div>
          ) : topCoins && topCoins.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">No market data available</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {(topCoins ?? []).map((coin) => (
                <div
                  key={coin.id}
                  onClick={() => navigate(`/trading/${coin.symbol}`)}
                  className="bg-gray-800 p-3 sm:p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer touch-target"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://api.dicebear.com/8.x/initials/svg?seed=${coin.symbol}`;
                        }}
                      />
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white">{coin.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-semibold text-white">
                        ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </p>
                      <div className={`flex items-center space-x-1 ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.price_change_percentage_24h >= 0 ? (
                          <TrendingUp size={12} className="sm:w-4 sm:h-4" />
                        ) : (
                          <TrendingDown size={12} className="sm:w-4 sm:h-4" />
                        )}
                        <span className="text-xs sm:text-sm font-medium">
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="p-3 sm:p-4 md:p-6 pb-6 sm:pb-8">
        <div className="container-responsive">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">Why Choose NISA Investment Advisors?</h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <Shield size={20} className="sm:w-6 sm:h-6 text-blue-400" />
                <h3 className="text-sm sm:text-base font-semibold text-white">Bank-Grade Security</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Your funds are protected with industry-leading security measures and cold storage.</p>
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <Zap size={20} className="sm:w-6 sm:h-6 text-yellow-400" />
                <h3 className="text-sm sm:text-base font-semibold text-white">Lightning Fast</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Execute trades instantly with our high-performance trading engine.</p>
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <Users size={20} className="sm:w-6 sm:h-6 text-green-400" />
                <h3 className="text-sm sm:text-base font-semibold text-white">24/7 Support</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Get help whenever you need it from our dedicated support team.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
