import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Protect from './components/Protect';
import CookieBanner from './components/CookieBanner';
import Chatbot from './components/Chatbot';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

// Safe Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerificationPending from './pages/VerificationPending';

// Restoring Pages
import Search from './pages/Search';
import DoctorProfile from './pages/DoctorProfile';
import Concept from './pages/Concept';
import Contact from './pages/ContactPage'; // Using the copy to be safe

import SOSPage from './pages/SOS';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminGuard from './components/AdminGuard';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-[var(--bg-color)] relative w-full max-w-[100vw] overflow-x-hidden">
          <Protect />
          <CookieBanner />
          <Chatbot />
          <div className="noise-overlay" />
          <Navbar />
          <main className="flex-grow z-10">
            <div className="relative w-full max-w-[100vw] overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/search" element={<Search />} />
                <Route path="/doctor/:id" element={<DoctorProfile />} />
                <Route path="/concept" element={<Concept />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/sos" element={<SOSPage />} />
                <Route
                  path="/admin"
                  element={
                    <AdminGuard>
                      <AdminDashboard />
                    </AdminGuard>
                  }
                />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
