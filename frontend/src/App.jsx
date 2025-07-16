// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import { Products, ProductDetailPage, AddProduct } from './components/Product';
import Farmers from './components/Farmers';
import Suppliers from './components/Suppliers';
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
import AdminLayout from './components/AdminLayout';
import Admin from './components/Admin';
import AdminProductList from './components/AdminProductList';
import AddProductForm from './components/AddProductForm';
import UserList from './components/UserList';
import OrderList from './components/OrderList';
import EditProduct from './components/EditProduct';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import DashboardProductList from './components/DashboardProductList';
import Categories from './components/Categories';
import Inventory from './components/Inventory';
import Buyers from './components/Buyers';
import Analytics from './components/Analytics';
import TopSellingCrops from './components/TopSellingCrops';
import CropDemandTrends from './components/CropDemandTrends';
import Transactions from './components/Transactions';
import Discounts from './components/Discounts';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


import Chat from './components/Chat';
import CartPage from './components/CartPage';
import { LocationProvider } from './contexts/LocationContext'; // Import LocationProvider

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (!user || (user.role !== 'farmer' && user.role !== 'supplier')) {
    return <Navigate to="/login" />;
  }
  return children;
};

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
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<MyProfile />}>
          <Route path="orders" element={<Orders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="payment-methods" element={<PaymentMethods />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help-center" element={<HelpCenter />} />
        </Route>
        <Route path="/reset-password/:uidb64/:token/" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/add" element={<AddProductForm />} />
          <Route path="users" element={<UserList />} />
          <Route path="orders" element={<OrderList />} />
        </Route>
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<DashboardProductList />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="buyers" element={<Buyers />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="farmers" element={<Farmers />} />
          <Route path="chat" element={<Chat />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="top-selling" element={<TopSellingCrops />} />
          <Route path="crop-demand" element={<CropDemandTrends />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="discounts" element={<Discounts />} />
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
