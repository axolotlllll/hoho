// src/App.jsx
import "./index.css";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./contexts/FirebaseAuthContext";
import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";
import { useCart } from "./contexts/CartContext";

function App() {
  const { user } = useAuth();
  const { clearError } = useCart();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      clearError();
    } catch {
      setError("Error signing out.");
    }
  };

  if (!user) {
    return (
      <div className="signin-wrapper">
        <form onSubmit={handleLogin} className="signin-form">
          <h2>Sign In</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Store</h1>
        <div className="user-info">
          <span>{user.email}</span>
          <button onClick={handleSignOut} className="btn btn-sm">Sign Out</button>
        </div>
      </header>

      <main className="main-content">
        <ProductList />
        <Cart />
      </main>
    </div>
  );
}

export default App;
