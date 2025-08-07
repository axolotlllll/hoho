// src/App.jsx
import "./App.css";
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
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="hero">
          <h1>Shapi Susej</h1>
          <p>Your minimal, Firebase-powered store.</p>
        </div>
        <div className="user-info">
          <span>{user.email}</span>
          <button onClick={handleSignOut} className="btn btn-sm">
            Sign Out
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="grid-2col">
          <ProductList />
          <Cart />
        </div>
      </main>
    </div>
  );
}

export default App;
