import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const themeCatalog = {
  dreamy: {
    icon: '🌸',
    title: 'Soft & Dreamy',
    desc: 'Blush pink & vintage plum aesthetic',
    dots: ['#fcf6f8', '#bd5e92', '#8c3866'],
  },
  cozy: {
    icon: '🌿',
    title: 'Warm & Cozy',
    desc: 'Botanical sage & matcha forest',
    dots: ['#f3f6f1', '#2e8b57', '#225c38'],
  },
  playful: {
    icon: '🍑',
    title: 'Happy & Playful',
    desc: 'Sunny apricot & coral terracotta',
    dots: ['#fff6ee', '#f25f38', '#c6411d'],
  },
  midnight: {
    icon: '🌙',
    title: 'Midnight Thoughts',
    desc: 'Obsidian velvet & glowing starlight',
    dots: ['#0f0e1a', '#b77bf7', '#854df2'],
  },
};

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    theme: 'dreamy',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSelectTheme = (id) => {
    setForm((prev) => ({ ...prev, theme: id }));
    document.documentElement.dataset.theme = id;
    localStorage.setItem('sd-theme', id);
  };

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password should contain at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const r = await signup(form.name, form.email, form.password, form.theme);
      if (!r.success) {
        setError(r.message || 'Signup failed.');
        setSubmitting(false);
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Could not create account.');
      setSubmitting(false);
    }
  }

  return (
    <main className="auth wrap">
      <div className="auth-card paper">
        <small className="eyebrow">let's make a little space for you</small>
        <h1>Create your diary ♡</h1>
        <p>Choose the atmosphere that feels most like you.</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={submit}>
          <label>
            Your name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="What should your diary call you?"
              required
            />
          </label>
          <label>
            Email
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <div className="form-two">
            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters"
                required
              />
            </label>
            <label>
              Confirm
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat password"
                required
              />
            </label>
          </div>

          <span className="field">Choose your diary mood</span>
          <div className="themes">
            {Object.entries(themeCatalog).map(([id, t]) => {
              const isChosen = form.theme === id;
              return (
                <button
                  type="button"
                  className={isChosen ? 'chosen' : ''}
                  onClick={() => handleSelectTheme(id)}
                  key={id}
                >
                  <span>{t.icon}</span>
                  <div>
                    <b>
                      {t.title} {isChosen ? '✓' : ''}
                    </b>
                    <small style={{ display: 'block' }}>{t.desc}</small>
                    <div className="theme-swatches">
                      {t.dots.map((color, idx) => (
                        <span
                          key={idx}
                          className="theme-dot"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button className="btn primary full" disabled={submitting}>
            {submitting ? 'Creating your space...' : 'Open my little diary →'}
          </button>
        </form>

        <p className="bottom">
          Already have a diary? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
