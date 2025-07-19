import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/Header.css';

const CartIcon = () => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return;
            }
            try {
                const response = await axios.get('/products/cart/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCartCount(response.data.total_items);
            } catch (err) {
                console.error('Error fetching cart:', err);
            }
        };

        fetchCart();
    }, []);

    return (
        <Link to="/cart" className="cart-icon">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
    );
};

export default CartIcon;
