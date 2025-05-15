import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import ChatBot from '../components/common/ChatBot';

const MainLayout = () => {
  useEffect(() => {
    console.log('MainLayout rendered with ChatBot');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main>
        <Outlet />
      </main>
      <div className="relative">
        <ChatBot />
      </div>
    </div>
  );
};

export default MainLayout; 