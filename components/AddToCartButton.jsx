import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export function AddToCartButton({ product, className = '', disabled = false }) {
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!product?.id) return setError('Invalid product');
    setIsAdding(true); setError('');
    try {
      await addToCart({
        productId: product.id, 
        name: product.name,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
      });
    } catch (err) {
      setError(err.message || 'Add to cart failed');
    } finally {
      setIsAdding(false);
    }
  };

  const disabledBtn = disabled || isLoading || isAdding;

  return (
    <div>
      <button onClick={handleAdd} className={`btn ${className}`} disabled={disabledBtn}>
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
      {error && <p className="error-message" style={{ marginTop: 8 }}>{error}</p>}
    </div>
  );
}
