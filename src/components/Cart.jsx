// src/components/Cart.jsx
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";

export function Cart() {
  const {
    items, total, isLoading, error,
    removeFromCart, updateQuantity, checkout, clearError
  } = useCart();

  const [qty, setQty] = useState({});
  const [checkingOut, setCheckingOut] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const initial = {};
    items.forEach(i => { initial[i.productId] = i.quantity });
    setQty(initial);
  }, [items]);

  const handleCheckout = async () => {
    setMsg("");
    setCheckingOut(true);
    try {
      const res = await checkout();
      if (!res.success) setMsg(res.error);
      else alert("Order complete!");
    } catch {
      setMsg("Checkout failed.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (isLoading && items.length === 0) return <p>Loading cart...</p>;
  if (items.length === 0) return <p className="empty-cart">Cart is empty</p>;

  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {(error || msg) && (
        <div className="error-message">
          {error || msg}
          <button onClick={() => { clearError(); setMsg(""); }}>×</button>
        </div>
      )}

      {items.map(i => (
        <div key={i.productId} className="cart-item">
          <div className="cart-info">
            <h3>{i.name}</h3>
            <p className="price">${i.price.toFixed(2)}</p>
          </div>
          <input
            type="number"
            value={qty[i.productId] || 1}
            onChange={(e) => setQty({ ...qty, [i.productId]: parseInt(e.target.value) })}
            onBlur={() => updateQuantity(i.productId, qty[i.productId])}
            min="1"
            className="quantity-input"
          />
          <strong>${(i.price * i.quantity).toFixed(2)}</strong>
          <button onClick={() => removeFromCart(i.productId)} className="btn btn-danger">×</button>
        </div>
      ))}

      <div className="cart-total">
        <span>Total:</span>
        <strong>${total.toFixed(2)}</strong>
      </div>

      <div className="checkout-section">
        <button
          onClick={handleCheckout}
          className="btn btn-primary"
          disabled={checkingOut}
        >
          {checkingOut ? "Processing..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
