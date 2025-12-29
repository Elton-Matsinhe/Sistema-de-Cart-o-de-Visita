import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Alterado para true por padrão

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
      }`}>
        <Header onToggleMenu={toggleSidebar} isMenuOpen={sidebarOpen} />
        
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;