// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import { Products, ProductDetailPage, AddProduct } from './components/Product';
import Farmers from './components/Farmers';
import Auth from './components/Auth';
import Login from './components/Login';
import MyProfile from './components/MyProfile';
import Orders from './components/Orders';
import Wishlist from './components/Wishlist';
import PaymentMethods from './components/PaymentMethods';
import Rewards from './components/Rewards';
import Settings from './components/Settings';
import HelpCenter from './components/HelpCenter';
import ContactInfoPage from './components/ContactInfoPage';
import UserDashboardLayout from './components/UserDashboardLayout';
import UserDashboard from './components/UserDashboard';
import UserDashboardProductList from './components/UserDashboardProductList';
import AddProductForm from './components/AddProductForm';
import UserList from './components/UserList';
import OrderList from './components/OrderList';
import EditProduct from './components/EditProduct';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './components/DashboardPage';
import FarmerDashboard from './components/FarmerDashboard';


import Chat from './components/Chat';
import CartPage from './components/CartPage';
import { LocationProvider } from './contexts/LocationContext'; // Import LocationProvider


function AppContent() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <>
      <Routes>
        {(user?.role === 'farmer') ? (
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="products/:id/contact" element={<ContactInfoPage />} />
            <Route path="farmers" element={<Farmers />} />
            <Route path="chat" element={<Chat />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="profile" element={<MyProfile />}>
              <Route path="orders" element={<Orders />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="payment-methods" element={<PaymentMethods />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help-center" element={<HelpCenter />} />
            </Route>
          </Route>
        ) : (
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="products/:id/contact" element={<ContactInfoPage />} />
            <Route path="farmers" element={<Farmers />} />
            <Route path="chat" element={<Chat />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="profile" element={<MyProfile />}>
              <Route path="orders" element={<Orders />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="payment-methods" element={<PaymentMethods />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help-center" element={<HelpCenter />} />
            </Route>
          </Route>
        )}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uidb64/:token/" element={<ResetPassword />} />
        <Route path="/user-dashboard" element={<UserDashboardLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="products" element={<UserDashboardProductList />} />
          <Route path="products/add" element={<AddProductForm />} />
          <Route path="users" element={<UserList />} />
          <Route path="orders" element={<OrderList />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={user?.role === 'farmer' ? <FarmerDashboard /> : <DashboardPage />} />
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
          <AppContent />
        </Router>
      </div>
    </LocationProvider>
  );
}

export default App;
