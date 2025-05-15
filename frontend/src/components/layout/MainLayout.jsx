import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import ChatBot from '../common/ChatBot';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <ChatBot />
    </div>
  );
};

export default MainLayout; 