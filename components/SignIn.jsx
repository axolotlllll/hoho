import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try { await signInWithEmailAndPassword(auth, email, pass); }
    catch (err) { setError(err.message || "Sign in failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="signin-wrapper">
      <form onSubmit={handleSubmit} className="signin-form">
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} required />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
