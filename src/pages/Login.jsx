import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || "Hmm... those details don't match this diary ♡");
        setSubmitting(false);
        return;
      }
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <main className="auth wrap">
      <div className="auth-card paper center">
        <div className="lock">🔐</div>
        <small className="eyebrow">welcome back, little dreamer</small>
        <h1>Open your diary</h1>
        <p>Your little world is waiting for you.</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={submit}>
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Your secret password"
              required
            />
          </label>
          <button className="btn primary full" disabled={submitting}>
            {submitting ? 'Opening diary...' : 'Unlock diary ♡'}
          </button>
        </form>

        <div className="demo">
          Demo: <b>demo@example.com</b> / <b>demo123</b>
        </div>
        <p className="bottom">
          New here? <Link to="/signup">Create your diary</Link>
        </p>
      </div>
    </main>
  );
}
