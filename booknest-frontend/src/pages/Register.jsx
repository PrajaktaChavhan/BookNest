import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    locality: '',
    whatsappNumber: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs text-ochre uppercase tracking-[0.14em] mb-2">
          Join the shelf
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">Create an account</h1>
        <p className="text-ink-soft mb-8 text-sm">
          Buy, sell, rent, donate, and exchange books nearby.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name', label: 'Full name', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'password', label: 'Password', type: 'password' },
            { key: 'locality', label: 'Locality (e.g. Andheri)', type: 'text' },
            { key: 'whatsappNumber', label: 'WhatsApp number', type: 'text' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">{label}</label>
              <input
                type={type}
                required
                value={form[key]}
                onChange={update(key)}
                className="w-full rounded-xl border border-hairline bg-paper-raised px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition"
              />
            </div>
          ))}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-moss text-paper rounded-sm py-2.5 font-medium hover:bg-moss-deep disabled:opacity-60 transition"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-moss font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
