import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useConvexAuth, useMutation, useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";

import BottomNavBar from './components/BottomNavBar';
import ProtectedRoute from './components/ProtectedRoute';
import { TradingProvider } from './contexts/TradingContext';

// Pages
import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import TradingPage from './pages/TradingPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import VIPPage from './pages/VIPPage';
import SupportPage from './pages/SupportPage';
import SignInPage from './pages/SignInPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import TransactionsPage from './components/TransactionsPage';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useConvexAuth();
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
  
  // Initialize user and load crypto data
  const ensureUserInitialized = useMutation(api.users.ensureUserInitialized);
  const loadSampleData = useAction(api.crypto.loadSampleData);
  const cryptoCoins = useQuery(api.crypto.getTopCoins, { limit: 1 });
  
  // Initialize user when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      ensureUserInitialized().catch(console.error);
    }
  }, [isAuthenticated, ensureUserInitialized]);
  
  // Load crypto data if none exists
  useEffect(() => {
    if (cryptoCoins !== undefined && cryptoCoins.length === 0) {
      loadSampleData().catch(console.error);
    }
  }, [cryptoCoins, loadSampleData]);

  return (
    <TradingProvider>
      <div className="full-screen bg-gray-900 text-white flex flex-col">
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#ffffff',
              border: '1px solid #374151',
              fontSize: '0.875rem'
            }
          }}
        />
        
        <main className={`flex-1 ${isAuthPage ? '' : 'pb-16 sm:pb-20'} overflow-x-hidden`}>
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/market" element={
              <ProtectedRoute>
                <MarketPage />
              </ProtectedRoute>
            } />
            <Route path="/trading/:symbol?" element={
              <ProtectedRoute>
                <TradingPage />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/vip" element={
              <ProtectedRoute>
                <VIPPage />
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            } />

            {/* Redirect all other routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {!isAuthPage && isAuthenticated && <BottomNavBar />}
      </div>
    </TradingProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
