import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '@/sections/landing';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-sipheron-base flex flex-col">
      <Navbar />
      <main className="flex-grow pt-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
