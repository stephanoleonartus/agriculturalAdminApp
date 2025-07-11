// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Products from './components/Products';
import Farmers from './components/Farmers';
import Supplies from './components/Supplies';
<<<<<<< HEAD
import Signup from './components/Signup';

function App() {
  return (
    <div className="App">
      
      <Router>
        <Navigation />
=======
import Chat from './components/Chat';
import CartPage from './components/CartPage';
import { LocationProvider } from './contexts/LocationContext'; // Import LocationProvider

function App() {
  return (
    <LocationProvider> {/* Wrap with LocationProvider */}
      <div className="App">
        <Router>
          <Navigation />
>>>>>>> a7b1e01a2a6fddc32d7a4eeff7173f25d609b85e

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/supplies" element={<Supplies />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Router>
      </div>
    </LocationProvider>
  );
}

export default App;
