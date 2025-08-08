import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../services/productService";
import { ProductForm } from "./ProductForm";
import { AddToCartButton } from "./AddToCartButton";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const items = await getAllProducts();
    setProducts(items);
    setEditing(null);
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="product-section">
      <h2 className="section-title">{editing ? "Edit Product" : "Add Product"}</h2>
      <ProductForm existing={editing} onSaved={load} />

      <h2 className="section-title">Available Products</h2>
      <div className="product-grid">
        {products.map((p) => (
          <article key={p.id} className="product-card">
            <header className="product-header">
              <h3 className="product-name">{p.name}</h3>
              <div className="product-price">${Number(p.price).toFixed(2)}</div>
            </header>

            <div className="product-details">
              {typeof p.stock === "number" && (
                <div className="stock-badge">
                  {p.stock > 0 ? <span className="in-stock">In Stock: {p.stock}</span> : <span className="out-of-stock">Out of Stock</span>}
                </div>
              )}
              {p.description && <p>{p.description}</p>}
              {p.details && <p style={{ color: "#888" }}>{p.details}</p>}
            </div>

            <footer className="product-footer">
              <AddToCartButton product={p} className="btn-sm" disabled={p.stock <= 0} />
              <div className="admin-actions">
                <button className="btn btn-edit btn-sm" onClick={() => setEditing(p)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={async () => { await deleteProduct(p.id); load(); }}>Delete</button>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
