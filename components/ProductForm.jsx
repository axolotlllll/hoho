import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../services/productService";

export function ProductForm({ existing, onSaved }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", details: "", stock: "" });

  useEffect(() => { if (existing) setForm({ ...existing, price: existing.price ?? "", stock: existing.stock ?? "" }); }, [existing]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: form.name.trim(),
      description: form.description || "",
      details: form.details || "",
      price: Number(form.price),
      stock: form.stock === "" ? 0 : Number(form.stock),
    };
    if (!data.name) return alert("Name is required.");
    if (Number.isNaN(data.price)) return alert("Price must be a number.");
    if (Number.isNaN(data.stock)) return alert("Stock must be a number.");

    if (existing?.id) await updateProduct(existing.id, data);
    else await createProduct(data);

    onSaved();
    setForm({ name: "", description: "", price: "", details: "", stock: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-row">
        <label>Product Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="" required />
      </div>

      <div className="form-row">
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="" />
      </div>

      <div className="form-row">
        <label>Price (PHP)</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" required />
      </div>

      <div className="form-row">
        <label>Stock</label>
        <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" />
      </div>

      <div className="form-row">
        <label>Details</label>
        <textarea name="details" value={form.details} onChange={handleChange} placeholder="" />
      </div>

      <button type="submit" className="btn btn-primary">{existing?.id ? "Update" : "Create"}</button>
    </form>
  );
}
