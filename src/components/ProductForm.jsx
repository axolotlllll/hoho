// src/components/ProductForm.jsx
import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../services/productService";

export function ProductForm({ existing, onSaved }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (existing?.id) {
      setForm({ ...existing });
    }
  }, [existing]);

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      };
      const result = existing?.id
        ? await updateProduct(existing.id, data)
        : await createProduct(data);
      onSaved(result);
    } catch {
      setMsg("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {msg && <p className="error-message">{msg}</p>}

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
      <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

      <div className="form-actions">
        {existing?.id && <button type="button" onClick={() => onSaved(null)} className="btn">Cancel</button>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : existing?.id ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
