// Products.jsx
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import AddProductForm from "./AddProductForm";
import ProductCard from "./ProductCard";
// import "../styles/Products.css"; // Assuming a CSS file might be needed

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // TODO: Add state for pagination if implementing (nextPageUrl, etc.)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API URL from environment variable or config
        const response = await axios.get("http://localhost:8000/api/products/");
        if (response.data && Array.isArray(response.data.results)) { // DRF pagination structure
          setProducts(response.data.results);
        } else if (Array.isArray(response.data)) { // Handle non-paginated response for now
            setProducts(response.data);
        } else {
            console.warn("Unexpected product data structure:", response.data);
            setProducts([]); // Default to empty if structure is not recognized
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="products-page"><p>Loading products...</p></div>;
  }

  if (error) {
    return <div className="products-page"><p>Error: {error}</p></div>;
  }

  return (
    <div className="products-page">
      <h1>🛒 Available Products</h1>

      {/* AddProductForm could be conditionally rendered based on user role later */}
      <AddProductForm setProducts={setProducts} />

      {products.length === 0 && !loading && <p>No products found.</p>}

      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* TODO: Add pagination controls here if implementing */}
    </div>
  );
}

export default Products;
