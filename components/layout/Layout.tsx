import React from 'react';
import Navbar from '../navbar';

type LayoutProps = {
  children: React.ReactNode; // 👈️ added type for children
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
