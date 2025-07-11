// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Products from './components/Products';
import Farmers from './components/Farmers';
import Supplies from './components/Supplies';
import Signup from './components/Signup';

function App() {
  return (
    <div className="App">
      
      <Router>
        <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/supplies" element={<Supplies />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
