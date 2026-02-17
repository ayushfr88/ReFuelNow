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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/orders" element={<MyOrdersPage />} />
        <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
        <Route path="/add-station" element={<AddStationPage />} />
        <Route path="/seller/station/:stationId/orders" element={<StationOrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
