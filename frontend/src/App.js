// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Products from './components/Products';
import Farmers from './components/Farmers';
import Supplies from './components/Supplies';

import Signup from './components/Signup';


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
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/supplies" element={<Supplies />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Router>
      </div>
    </LocationProvider>
  );
}

export default App;
