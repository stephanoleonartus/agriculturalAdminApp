// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import { Products, ProductDetailPage, AddProduct } from './components/Product';
import Farmers from './components/Farmers';
import Suppliers from './components/Suppliers';
import Login from './components/Login';
import Auth from './components/Auth';
import MyProfile from './components/MyProfile';
import Orders from './components/Orders';
import Wishlist from './components/Wishlist';
import PaymentMethods from './components/PaymentMethods';
import Rewards from './components/Rewards';
import Settings from './components/Settings';
import HelpCenter from './components/HelpCenter';
import ContactInfoPage from './components/ContactInfoPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import Admin from './components/Admin';
import AdminProductList from './components/AdminProductList';
import UserList from './components/UserList';
import OrderList from './components/OrderList';
import EditProduct from './components/EditProduct';
import Dashboard from './components/Dashboard';
import ManageProducts from './components/ManageProducts';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


import Chat from './components/Chat';
import CartPage from './components/CartPage';
import { LocationProvider } from './contexts/LocationContext'; // Import LocationProvider

function AppContent() {
  const location = useLocation();
  const showHome = location.pathname === '/';

  return (
    <>
      {showHome && <Home />}
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/products/:id/contact" element={<ContactInfoPage />} />
        <Route path="/farmers" element={<Farmers />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uidb64/:token/" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="users" element={<UserList />} />
          <Route path="orders" element={<OrderList />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/products" element={<ManageProducts />} />
        <Route path="/profile" element={<ProfilePage />}>
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="payment-methods" element={<PaymentMethods />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help-center" element={<HelpCenter />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <LocationProvider> {/* Wrap with LocationProvider */}
      <div className="App">
        <Router>
          <Header />
          <AppContent />
        </Router>
      </div>
    </LocationProvider>
  );
}

export default App;
