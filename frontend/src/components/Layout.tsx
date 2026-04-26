import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-8 w-full pb-24 md:pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
