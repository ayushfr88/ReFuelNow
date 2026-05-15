import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VideoSection from './components/VideoSection';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import AppPreview from './components/AppPreview';
import WhyChooseUs from './components/WhyChooseUs';
import BusinessSolutions from './components/BusinessSolutions';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import FinalCTA from './components/FinalCTA';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import AddStationPage from './pages/AddStationPage';
import StationOrdersPage from './pages/StationOrdersPage';
import SellerProfilePage from './pages/SellerProfilePage';
import WalletPage from './pages/WalletPage';
import SellerWalletPage from './pages/SellerWalletPage';
import DeliveryMenPage from './pages/DeliveryMenPage';
import DeliveryManDashboard from './pages/DeliveryManDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const LandingPage = () => (
  <>
    <Navbar />
    <Hero />
    <VideoSection />
    <Stats />
    <HowItWorks />
    <Services />
    <AppPreview />
    <WhyChooseUs />
    <BusinessSolutions />
    <Testimonials />
    <FAQ />
    <FinalCTA />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute allowedRoles={['customer']}><ProfilePage /></ProtectedRoute>} />
        <Route path="/dashboard/wallet" element={<ProtectedRoute allowedRoles={['customer']}><WalletPage /></ProtectedRoute>} />
        <Route path="/dashboard/orders" element={<ProtectedRoute allowedRoles={['customer']}><MyOrdersPage /></ProtectedRoute>} />
        <Route path="/seller-dashboard" element={<ProtectedRoute allowedRoles={['seller']}><SellerDashboardPage /></ProtectedRoute>} />
        <Route path="/seller-dashboard/profile" element={<ProtectedRoute allowedRoles={['seller']}><SellerProfilePage /></ProtectedRoute>} />
        <Route path="/seller-dashboard/wallet" element={<ProtectedRoute allowedRoles={['seller']}><SellerWalletPage /></ProtectedRoute>} />
        <Route path="/seller-dashboard/delivery-men" element={<ProtectedRoute allowedRoles={['seller']}><DeliveryMenPage /></ProtectedRoute>} />
        <Route path="/add-station" element={<ProtectedRoute allowedRoles={['seller']}><AddStationPage /></ProtectedRoute>} />
        <Route path="/seller/station/:stationId/orders" element={<ProtectedRoute allowedRoles={['seller']}><StationOrdersPage /></ProtectedRoute>} />
        <Route path="/delivery-dashboard" element={<ProtectedRoute allowedRoles={['delivery_man']}><DeliveryManDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
