// Products.jsx
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import AddProductForm from "./AddProductForm";
import ProductCard from "./ProductCard";
// import "../styles/Products.css"; // Assuming a CSS file might be needed

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // Store category ID or name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // TODO: Add state for pagination

  useEffect(() => {
    // Fetch categories
    axios.get("http://localhost:8000/api/products/categories/")
      .then(response => {
        if (response.data && Array.isArray(response.data.results)) {
            setCategories(response.data.results);
        } else if (Array.isArray(response.data)) { // Non-paginated fallback
            setCategories(response.data);
        }
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
        setError(err.message || "Failed to fetch categories."); // Optionally set error for categories
      });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl = "http://localhost:8000/api/products/";
        const params = new URLSearchParams();
        if (selectedCategory) {
          params.append('category__id', selectedCategory); // Assuming selectedCategory stores ID
        }
        // TODO: Add other filters like search term, pagination params here

        const fullApiUrl = `${apiUrl}?${params.toString()}`;
        const response = await axios.get(fullApiUrl);

        if (response.data && Array.isArray(response.data.results)) {
          setProducts(response.data.results);
          // TODO: set pagination data (next, previous, count)
        } else if (Array.isArray(response.data)) { // Fallback for non-paginated
            setProducts(response.data);
        } else {
            console.warn("Unexpected product data structure:", response.data);
            setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // Re-fetch products when selectedCategory changes

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  if (loading && products.length === 0) { // Show loading only if products aren't already displayed
    return <div className="products-page"><p>Loading products...</p></div>;
  }

  if (error) {
    return <div className="products-page"><p>Error: {error}</p></div>;
  }

  return (
    <div className="products-page">
      <h1>🛒 Available Products</h1>

      <div className="filters-container" style={{ marginBottom: '20px' }}>
        <label htmlFor="category-filter" style={{ marginRight: '10px' }}>Filter by Category:</label>
        <select id="category-filter" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* AddProductForm could be conditionally rendered based on user role later */}
      <AddProductForm setProducts={setProducts} />

      {loading && <p>Loading products...</p>}
      {!loading && error && <p>Error: {error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found for the selected criteria.</p>}

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
