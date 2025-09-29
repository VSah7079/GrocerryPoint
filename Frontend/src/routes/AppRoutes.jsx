import React from 'react';
import { createBrowserRouter, Link } from 'react-router-dom';

// Core App Components
import App from '../App.jsx';
import { CartProvider } from '../contexts/CartContext';


// Layouts
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

// User Pages
import HomePage from '../pages/HomePage.jsx';
import CategoriesPage from '../pages/CategoriesPage.jsx';
import ProductListPage from '../pages/ProductListPage.jsx';
import ProductDetailsPage from '../pages/ProductDetailsPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import OrderConfirmationPage from '../pages/OrderConfirmationPage.jsx';
import UserDashboardPage from '../pages/UserDashboardPage.jsx';
import InvoicePage from '../pages/InvoicePage';
import AuthCallbackPage from '../pages/AuthCallbackPage.jsx';
import EmailVerificationPage from '../pages/EmailVerificationPage.jsx';

// User Dashboard Components
import OrderHistory from '../components/OrderHistory.jsx';
import ProfileSettings from '../components/ProfileSettings.jsx';
import SavedAddresses from '../components/SavedAddresses.jsx';
import Wishlist from '../components/Wishlist.jsx';
import DashboardWelcome from '../components/DashboardWelcome';

// Extra Pages
import OrderTrackingPage from '../pages/OrderTrackingPage.jsx';
import WishlistPage from '../pages/WishlistPage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import FAQPage from '../pages/FAQPage.jsx';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage.jsx';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage.jsx';
import DynamicAdminDashboard from '../pages/admin/DynamicAdminDashboard.jsx';
import ProductManagementPage from '../pages/admin/ProductManagementPage.jsx';
import OrderManagementPage from '../pages/admin/OrderManagementPage.jsx';
import EnhancedOrderManagement from '../pages/admin/EnhancedOrderManagement.jsx';
import CustomerManagementPage from '../pages/admin/CustomerManagementPage.jsx';
import CustomerDetailsPage from '../pages/admin/CustomerDetailsPage.jsx';
import OrderDetailsPage from '../pages/admin/OrderDetailsPage.jsx';
import SettingsPage from '../pages/admin/SettingsPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'products', element: <ProductListPage /> },
          { path: 'product/:productId', element: <ProductDetailsPage /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'track-order', element: <OrderTrackingPage /> },
          { path: 'wishlist', element: <WishlistPage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'contact', element: <ContactPage /> },
          { path: 'faq', element: <FAQPage /> },
          { path: 'privacy', element: <PrivacyPolicyPage /> },
          { path: 'invoice', element: <InvoicePage /> },
        ],
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password/:token', element: <ResetPasswordPage /> },
      { path: 'verify-email/:token', element: <EmailVerificationPage /> },
      { path: 'order-confirmation', element: <OrderConfirmationPage /> },
      { path: 'auth/callback', element: <AuthCallbackPage /> },
      // Dashboard routes - separate from MainLayout
      { path: 'account', element: <UserDashboardPage />, children: [
        { index: true, element: <DashboardWelcome /> },
        { path: 'orders', element: <OrderHistory /> },
        { path: 'profile', element: <ProfileSettings /> },
        { path: 'addresses', element: <SavedAddresses /> },
        { path: 'wishlist', element: <Wishlist /> },
      ] },
      // Admin routes
      {
        path: 'admin',
        children: [
          { index: true, element: <AdminLoginPage /> },
          { path: 'login', element: <AdminLoginPage /> },
          {
            element: <AdminLayout />,
            children: [
              { path: 'dashboard', element: <DynamicAdminDashboard /> },
              { path: 'products', element: <ProductManagementPage /> },
              { path: 'orders', element: <EnhancedOrderManagement /> },
              { path: 'orders/:orderId', element: <OrderDetailsPage /> },
              { path: 'customers', element: <CustomerManagementPage /> },
              { path: 'customers/:customerId', element: <CustomerDetailsPage /> },
              { path: 'settings', element: <SettingsPage /> },
            ]
          }
        ]
      },
    ],
  },
]); 