import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";

export function Cart() {
  const { items, total, isLoading, error, removeFromCart, updateQuantity, checkout, clearError } = useCart();
  const [qty, setQty] = useState({});
  const [checkingOut, setCheckingOut] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const q = {};
    items.forEach(i => { q[i.productId] = i.quantity; });
    setQty(q);
  }, [items]);

  const handleCheckout = async () => {
    setMsg("");
    setCheckingOut(true);
    try {
      const res = await checkout();
      if (!res.success) setMsg(res.error);
      else setMsg("Order complete!");
    } catch {
      setMsg("Checkout failed.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (isLoading && items.length === 0) return <p>Loading cart...</p>;
  if (items.length === 0) return <p className="empty-cart">🛒 Cart is empty</p>;

  return (
    <aside className="cart">
      <h2>Your Cart</h2>

      {(error || msg) && (
        <div className="error-message">
          {error || msg}
          <button onClick={() => { clearError(); setMsg(""); }} className="btn btn-sm" style={{ marginLeft: 8 }}>×</button>
        </div>
      )}

      <div className="cart-items">
        {items.map(i => (
          <div key={i.productId} className="cart-item">
            <div className="cart-info">
              <h3>{i.name}</h3>
              <p className="item-price">${i.price.toFixed(2)}</p>
            </div>

            <input
              type="number"
              className="quantity-input"
              value={qty[i.productId] ?? 1}
              min="1"
              onChange={(e) => setQty({ ...qty, [i.productId]: parseInt(e.target.value) || 1 })}
              onBlur={() => updateQuantity(i.productId, qty[i.productId] || 1)}
            />

            <strong>${(i.price * i.quantity).toFixed(2)}</strong>
            <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(i.productId)}>×</button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Total</span>
        <strong>${total.toFixed(2)}</strong>
      </div>

      <div className="checkout-section">
        <button className="btn btn-primary full-width" onClick={handleCheckout} disabled={checkingOut}>
          {checkingOut ? "Processing..." : "Checkout"}
        </button>
      </div>
    </aside>
  );
}
