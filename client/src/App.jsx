import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import MenuPage from './pages/MenuPage';
import AuthPage from './features/auth/AuthPage';
import ProfilePage from './features/user/ProfilePage';
import CartPage from './features/cart/CartPage';
import HistoryPage from './features/user/HistoryPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MenuPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/history" element={<HistoryPage />} />


        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        
        <Route path="/admin" element={<AdminOrdersPage />} />
        <Route path="/admin/menu" element={<AdminMenuPage />} />
      </Route>

      <Route path="/login" element={<AuthPage />} />

      <Route path="*" element={<div className="text-center py-20">404: Сторінку не знайдено</div>} />
    </Routes>
  );
}

export default App;