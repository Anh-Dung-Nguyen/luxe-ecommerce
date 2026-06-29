import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ToastProvider from './components/shared/ToastProvider';
import RootLayout from './components/layout/RootLayout';

import HomePage from './pages/public/HomePage';
import ProductsPage from './pages/public/ProductsPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import SellerDashboard from './pages/seller/SellerDashboard';
import ProfilePage from './pages/customer/ProfilePage';
import AddressesPage from './pages/customer/AddressesPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerCategoriesPage from './pages/seller/SellerCategoriesPage';
import SellerCouponsPage from './pages/seller/SellerCouponsPage';
import NotFound from './pages/public/NotFoundPage';

import SQLiDemoPage from './pages/public/SQLiDemoPage';
import XSSDemoProductDetailPage from './pages/public/XSSDemoProductDetailPage';
import AdminPingPage from './pages/admin/AdminPingPage';
import PingPage from './pages/public/PingPage';
import UploadVulnPage from './pages/public/UploadVulnPage';
import UploadPage from './pages/public/UploadPage';
import PathTraversalVulnPage from './pages/public/PathTraversalVulnPage';
import PathTraversalPage from './pages/public/PathTraversalPage';
import NewsViewer from './pages/public/NewsViewer';

export default function App() {
    return (
        <Provider store = {store}>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element = {<RootLayout />}>
                        
                            {/* Routes Publiques */}
                            <Route path = "/" element = {<HomePage />} />
                            <Route path = "/products" element = {<ProductsPage />} />
                            <Route path = "/product/:id" element = {<ProductDetailPage />} />
                            <Route path = "/vulnerable-SQLi" element = {<SQLiDemoPage />} />
                            <Route path = "/vulnerable-XSS/:id" element = {<XSSDemoProductDetailPage />} />
                            <Route path = "/ping/ping-vuln" element = {<PingPage />} />
                            <Route path = "/upload/uploadVuln" element = {<UploadVulnPage />} />
                            <Route path = "/upload/upload" element = {<UploadPage />} />
                            <Route path = "/path/pathVuln" element = {<PathTraversalVulnPage />} />
                            <Route path = "/path/pathOK" element = {<PathTraversalPage />} />
                            <Route path = "/path/newsViewer" element = {<NewsViewer />} />

                            <Route path = "*" element = {<NotFound />} />
                            
                            {/* Routes d'Authentification */}
                            <Route path = "/login" element = {<LoginPage />} />
                            <Route path = "/register" element = {<RegisterPage />} />
                            
                            {/* Routes Clients */}
                            <Route path = "/cart" element = {<CartPage />} />
                            <Route path = "/checkout" element = {<CheckoutPage />} />
                            <Route path = "/my-orders" element = {<MyOrdersPage />} />
                            <Route path = "/profile" element = {<ProfilePage />} />
                            <Route path = "/addresses" element = {<AddressesPage />} />

                            {/* Admin */}
                            <Route path = "/admin-dashboard" element = {<AdminDashboard />} />
                            <Route path = "/admin/products" element = {<AdminProductsPage />} />
                            <Route path = "/admin/orders" element = {<AdminOrdersPage />} />
                            <Route path = "/admin/users" element = {<AdminUsersPage />} />
                            <Route path = "/admin/categories" element = {<AdminCategoriesPage />} />
                            <Route path = "/admin/coupons" element = {<AdminCouponsPage />} />
                            <Route path = "/admin/reviews" element = {<AdminReviewsPage />} />
                            <Route path = "/admin/ping/ping-ok" element = {<AdminPingPage />} />

                            {/* Seller */}
                            <Route path = "/seller-dashboard" element = {<SellerDashboard />} />
                            <Route path = "/seller/orders" element = {<SellerOrdersPage />} />
                            <Route path = "/seller/categories" element = {<SellerCategoriesPage />} />
                            <Route path = "/seller/coupons" element = {<SellerCouponsPage />} />

                        </Route>
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </Provider>
    );
}