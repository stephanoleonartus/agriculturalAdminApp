// Products.jsx
import React, { useState, useEffect } from "react";
import AddProductForm from "./AddProductForm";
import ProductCard from "./ProductCard";

function Products() {
  const [products, setProducts] = useState([]);

  // Fetch products from backend (later Django API)
  useEffect(() => {
    // Placeholder - update with Django API URL later
    fetch("http://localhost:8000/api/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="products-page">
      <h1>🛒 Available Products</h1>

      <AddProductForm setProducts={setProducts} />

      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
