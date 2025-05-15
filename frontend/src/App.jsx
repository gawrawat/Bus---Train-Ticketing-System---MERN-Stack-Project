import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import UserLayout from './components/layout/UserLayout';
import Bus from './pages/Bus';
import Train from './pages/Train';
import BusBooking from './pages/BusBooking';
import TrainBooking from './pages/TrainBooking';
import TrainConfirmation from './pages/TrainConfirmation';
import Profile from './pages/Profile';
import ViewTicket from './pages/ViewTicket';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page with UserLayout */}
        <Route path="/" element={<UserLayout />} />
        
        {/* Other routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/bus" element={<Bus />} />
          <Route path="/bus/booking" element={<BusBooking />} />
          <Route path="/bus/booking/:id" element={<ViewTicket />} />
          <Route path="/train" element={<Train />} />
          <Route path="/trainbooking" element={<TrainBooking />} />
          <Route path="/train/confirmation" element={<TrainConfirmation />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;