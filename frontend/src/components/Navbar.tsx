import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SettingsModal from './SettingsModal';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const navItems = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Logs', path: '/logs', icon: 'fitness_center' },
    { label: 'Advice', path: '/advice', icon: 'psychology' },
    { label: 'Trends', path: '/trends', icon: 'insights' },
  ];

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Drink Water!', message: 'You are 2 glasses away from your goal.', icon: 'water_drop', color: 'text-blue-500', read: false },
    { id: 2, title: 'Keep it up!', message: 'You started a 1-day streak! Don\'t stop now.', icon: 'local_fire_department', color: 'text-orange-500', read: false },
    { id: 3, title: 'AI Insight', message: 'Gemini suggests a light jog based on your recovery.', icon: 'psychology', color: 'text-primary', read: false }
  ]);

  const hasUnread = notifications.some(n => !n.read);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/'; 
  };

  return (
    <>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <header className="bg-[#F7F9F9] dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 shadow-premium hidden md:block sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined fill">auto_awesome</span>
            </div>
            <span className="text-xl font-bold text-[#50A684] dark:text-emerald-500 tracking-tight">Vitality AI</span>
          </div>
          <nav className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  location.pathname === item.path
                    ? 'text-[#50A684] font-bold'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`material-symbols-outlined ${location.pathname === item.path ? 'fill' : ''}`}>
                  {item.icon}
                </span>
                <span className="uppercase text-xs font-bold tracking-wider">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              className="text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all p-2 rounded-full"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button 
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all p-2 rounded-full"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
            <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
            
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`text-[#50A684] dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors p-2 rounded-full relative ${isNotificationsOpen ? 'bg-slate-100' : ''}`}
            >
              <span className="material-symbols-outlined">notifications</span>
              {hasUnread && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F7F9F9]"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute top-14 right-0 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h4 className="text-sm font-black uppercase tracking-widest text-on-surface">Notifications</h4>
                  {hasUnread && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                      {notifications.filter(n => !n.read).length} NEW
                    </span>
                  )}
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 rounded-2xl transition-all cursor-pointer border group ${
                        n.read 
                          ? 'bg-surface-container-low hover:border-slate-100' 
                          : 'bg-primary/5 border-primary/10 shadow-sm'
                      } hover:bg-surface-container-low hover:border-slate-100 active:scale-[0.98]`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 shadow-sm ${n.color.replace('text-', 'bg-')}/10`}>
                          <span className={`material-symbols-outlined text-xl fill ${n.color}`}>{n.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm font-bold text-on-surface mb-0.5 ${n.read ? 'opacity-80' : ''}`}>{n.title}</p>
                            {!n.read && <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shadow-sm shadow-primary/40 animate-pulse"></div>}
                          </div>
                          <p className={`text-xs text-outline leading-tight ${n.read ? 'opacity-70' : ''}`}>{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={markAllAsRead}
                  className="w-full mt-4 py-3 text-xs font-bold text-outline hover:text-on-surface transition-colors border-t border-slate-50 dark:border-slate-800 pt-4"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
