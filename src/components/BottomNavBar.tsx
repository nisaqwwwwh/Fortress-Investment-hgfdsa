import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, CandlestickChart, User, LifeBuoy, History } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/market', label: 'Market', icon: BarChart2 },
  { path: '/trading', label: 'Trading', icon: CandlestickChart },
  { path: '/history', label: 'History', icon: History },
  { path: '/support', label: 'Support', icon: LifeBuoy },
  { path: '/profile', label: 'Profile', icon: User },
];

const BottomNavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 z-50 safe-area-pb">
      <div className="flex justify-around max-w-6xl mx-auto px-1 sm:px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 py-2 sm:py-3 px-1 sm:px-2 md:px-3 text-center transition-all duration-200 min-w-0 flex-1 touch-target ${
                isActive
                  ? 'text-yellow-400 scale-105'
                  : 'text-gray-400 hover:text-white hover:scale-105'
              }`
            }
          >
            <item.icon size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-xs font-medium truncate w-full">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
