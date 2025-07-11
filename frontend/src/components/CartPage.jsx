import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import '../styles/CartPage.css'; // Create this CSS file later

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken"); // Placeholder for auth
      if (!token) {
        setError("Please log in to view your cart.");
        setLoading(false);
        // TODO: Redirect to login or show login prompt
        return;
      }

      try {
        // The CartViewSet is registered under /api/products/cart/
        // A GET request to this base for a ModelViewSet usually lists all carts (admin)
        // or creates one (if POST).
        // For a user's specific cart, it's often a detail route /api/products/cart/{cart_id}/
        // or a custom action like /api/products/cart/mine/
        // The current CartViewSet get_queryset filters by user, so GET /api/products/cart/
        // might return a list containing the user's cart (or create one if not existing via perform_create).
        // Let's assume it returns a list and we take the first one, or it's an endpoint that directly gives the user's cart.
        // The backend CartViewSet needs to be clear on how a user fetches *their* cart.
        // For now, assuming /api/products/cart/ will fetch the current user's cart details (list of one).

        const response = await axios.get("http://localhost:8000/api/products/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // CartViewSet list action will return a paginated list of carts.
        // We expect the user to have at most one cart.
        if (response.data && response.data.results && response.data.results.length > 0) {
          setCart(response.data.results[0]); // Assuming the first cart in the list is the user's
        } else if (response.data && !Array.isArray(response.data) && response.data.items) {
          // If the endpoint directly returns the cart object (e.g. from a retrieve action if cart_id known)
          setCart(response.data);
        } else {
          // No cart found, or create one implicitly on backend if designed that way.
          // For now, show as empty or allow creation.
          setCart({ items: [], total_price: "0.00", total_items: 0 }); // Default empty cart structure
        }
      } catch (err) {
        console.error("Error fetching cart:", err.response?.data || err.message);
        setError(err.response?.data?.detail || err.message || "Failed to fetch cart.");
        if (err.response?.status === 404) { // If cart not found
            setCart({ items: [], total_price: "0.00", total_items: 0 }); // Treat as empty cart
            setError(null); // Clear error if 404 means empty cart
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    const token = localStorage.getItem("accessToken");
    if (newQuantity < 1) { // Remove item if quantity is less than 1
      handleRemoveItem(itemId);
      return;
    }
    try {
      await axios.patch(`http://localhost:8000/api/products/cart-items/${itemId}/`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refetch cart to update totals and item details
      const response = await axios.get("http://localhost:8000/api/products/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.results && response.data.results.length > 0) {
        setCart(response.data.results[0]);
      } else {
         setCart({ items: [], total_price: "0.00", total_items: 0 });
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      // setError("Failed to update item quantity.");
      alert("Failed to update item quantity.");
    }
  };

  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://localhost:8000/api/products/cart-items/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refetch cart
      const response = await axios.get("http://localhost:8000/api/products/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.results && response.data.results.length > 0) {
        setCart(response.data.results[0]);
      } else {
         setCart({ items: [], total_price: "0.00", total_items: 0 });
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      // setError("Failed to remove item from cart.");
      alert("Failed to remove item from cart.");
    }
  };


  if (loading) return <div className="cart-page"><p>Loading cart...</p></div>;
  if (error) return <div className="cart-page"><p>Error: {error}</p></div>;
  if (!cart || cart.items.length === 0) return <div className="cart-page"><h2>Your Cart</h2><p>Your cart is empty.</p><Link to="/products">Continue Shopping</Link></div>;

  return (
    <div className="cart-page" style={{padding: '20px'}}>
      <h2>Your Shopping Cart</h2>
      <div className="cart-items-list">
        {cart.items.map(item => (
          <div key={item.id} className="cart-item" style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0'}}>
            <div style={{flex: 1}}>
              <h4>{item.product?.name || 'Product Name Missing'}</h4>
              <p>Price: TZS {parseFloat(item.product?.price || 0).toFixed(2)}</p>
              <p>Unit: {item.product?.unit || 'N/A'}</p>
            </div>
            <div style={{flex: 1, textAlign: 'center'}}>
              <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${item.id}`}
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                min="1"
                style={{width: '60px', marginLeft: '10px', marginRight: '10px', textAlign: 'center'}}
              />
            </div>
            <div style={{flex: 1, textAlign: 'right'}}>
              <p>Subtotal: TZS {parseFloat(item.total_price || 0).toFixed(2)}</p>
              <button onClick={() => handleRemoveItem(item.id)} style={{color: 'red', background: 'none', border: 'none', cursor: 'pointer'}}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary" style={{marginTop: '20px', textAlign: 'right'}}>
        <h3>Total Items: {cart.total_items || 0}</h3>
        <h3>Total Price: TZS {parseFloat(cart.total_price || 0).toFixed(2)}</h3>
        <button style={{padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px'}}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
