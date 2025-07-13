// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Products from './components/Products';
import Farmers from './components/Farmers';
import Suppliers from './components/Suppliers';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import Signup from './components/Signup';
import MyProfile from './components/MyProfile';
import Orders from './components/Orders';
import Wishlist from './components/Wishlist';
import PaymentMethods from './components/PaymentMethods';
import Rewards from './components/Rewards';
import Settings from './components/Settings';
import HelpCenter from './components/HelpCenter';
import ProductDetailPage from './components/ProductDetailPage';
import ContactInfoPage from './components/ContactInfoPage';
import AdminDashboard from './components/AdminDashboard';
import Admin from './components/Admin';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


import Chat from './components/Chat';
import CartPage from './components/CartPage';
import { LocationProvider } from './contexts/LocationContext'; // Import LocationProvider

function App() {
  return (
    <LocationProvider> {/* Wrap with LocationProvider */}
      <div className="App">
        <Router>
          <Navigation />


          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/contact" element={<ContactInfoPage />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uidb64/:token/" element={<ResetPassword />} />
            <Route path="/admin" element={<Admin />} />
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
        </Router>
      </div>
    </LocationProvider>
  );
}

export default App;
