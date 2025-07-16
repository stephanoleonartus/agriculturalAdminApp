// import React from "react";
// import { Link } from "react-router-dom";
// import '../styles/navigation.css';
// import '../styles/Auth.css';
// import Notification from "./Notification";
// import Profile from "./Profile";
// import { useLocation } from '../contexts/LocationContext';

// function Navigation() {
//   // Placeholder for message count, to be fetched later
//   const messageCount = 0; // Example: replace with actual count from state/context
//   const [searchTerm, setSearchTerm] = React.useState('');
//   const { location, locationError, locationLoading, permissionStatus, fetchLocation } = useLocation();
//   const [isAuthenticated, setIsAuthenticated] = React.useState(false);

//   React.useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('authToken');
//       setIsAuthenticated(!!token);
//     };

//     checkAuth();
//     fetchLocation();

//     window.addEventListener('authChange', checkAuth);

//     return () => {
//       window.removeEventListener('authChange', checkAuth);
//     };
//   }, [fetchLocation]);


//   const handleSearch = () => {
//     // Handle search functionality
//   };

//   return (
//     <div className="navbar">
//       {/* Geolocation Status */}
//       <div className="location-info-section" onClick={fetchLocation}>
//         Deliver to: {location ? location.region : '...'}
//       </div>
//       {/* Logo Section */}
//       <div className="logo">
//         <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
//           🌾 AgriLink.com
//         </Link>
//       </div>


//       {/* Menu navigation */}
//       <div className="menu">
//         <Link to="/products" className="nav-item">Products</Link>
//         <Link to="/farmers" className="nav-item">Farmers</Link>
//         <Link to="/suppliers" className="nav-item">Region Supplier</Link>

//         {/* Message Icon */}
//         <Link to="/chat" className="nav-item icon-link notification-container">
//           💬
//           {messageCount > 0 && <span className="dot message-dot">{messageCount > 9 ? '9+' : messageCount}</span>}
//         </Link>

//         {/* Cart Icon */}
//         <Link to="/cart" className="nav-item icon-link notification-container">
//           🛒
//           {/* Placeholder for cart item count - to be fetched later */}
//           {/* {cartItemCount > 0 && <span className="dot cart-dot">{cartItemCount > 9 ? '9+' : cartItemCount}</span>} */}
//         </Link>

//         <Notification /> {/* This is for general notifications */}

//         {isAuthenticated ? (
//           <Profile />
//         ) : (
//           <div className="auth-links">
//             <Link to="/login" className="nav-item">
//               Login
//             </Link>
//             <Link to="/auth" className="nav-item create-account-btn">
//               Create Account
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Navigation;