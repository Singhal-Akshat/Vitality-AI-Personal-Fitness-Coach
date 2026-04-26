import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Logs', path: '/logs', icon: 'fitness_center' },
    { label: 'Advice', path: '/advice', icon: 'psychology' },
    { label: 'Trends', path: '/trends', icon: 'insights' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-6 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 shadow-[0px_-4px_24px_rgba(0,0,0,0.04)] md:hidden rounded-t-[24px]">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center px-3 py-1 scale-95 active:scale-90 transition-all duration-200 ${
            location.pathname === item.path
              ? 'text-[#50A684] dark:text-emerald-400 font-bold bg-[#50A684]/10 rounded-xl'
              : 'text-slate-400 dark:text-slate-500 hover:text-[#50A684]'
          }`}
        >
          <span className={`material-symbols-outlined mb-1 ${location.pathname === item.path ? 'fill' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[11px] font-medium">{item.label}</span>
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center px-3 py-1 scale-95 active:scale-90 transition-all duration-200 text-slate-400"
      >
        <span className="material-symbols-outlined mb-1 text-red-400">logout</span>
        <span className="text-[11px] font-medium text-red-400">Logout</span>
      </button>
    </nav>
  );
};

export default BottomNav;
