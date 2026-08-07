import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs text-ochre uppercase tracking-[0.14em] mb-2">
          Welcome back
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-8">Log in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-hairline bg-paper-raised px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-hairline bg-paper-raised px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-moss text-paper rounded-sm py-2.5 font-medium hover:bg-moss-deep disabled:opacity-60 transition"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-moss font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
