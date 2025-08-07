// src/components/ProductList.jsx
import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../services/productService";
import { ProductForm } from "./ProductForm";
import { AddToCartButton } from "./AddToCartButton";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const items = await getAllProducts();
      setProducts(items);
    } catch (err) {
      setError("Failed to load products.");
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  };

  const handleSave = (data) => {
    if (!data) return load();
    if (editing?.id) {
      setProducts(p => p.map(x => x.id === data.id ? data : x));
    } else {
      setProducts(p => [data, ...p]);
    }
    setEditing(null);
  };

  return (
    <div className="product-list-container">
      {error && <p className="error-message">{error}</p>}

      {editing ? (
        <ProductForm existing={editing} onSaved={handleSave} />
      ) : (
        <button onClick={() => setEditing({})} className="btn btn-primary">Add Product</button>
      )}

      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-details">
              <h3>{p.name}</h3>
              <p className="price">${p.price.toFixed(2)}</p>
              <p className={`stock-badge ${p.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {p.stock > 0 ? `In Stock: ${p.stock}` : "Out of Stock"}
              </p>
              <p className="description">{p.description}</p>
            </div>

            <div className="product-actions">
              <AddToCartButton product={p} disabled={p.stock <= 0} />
              <div className="admin-actions">
                <button onClick={() => setEditing(p)} className="btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
