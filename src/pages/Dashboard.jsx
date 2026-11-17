import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEntries } from '../services/entries';
import EntryCard from '../components/EntryCard';
import Loading from '../components/Loading';

export default function Dashboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getEntries()
      .then((data) => {
        if (mounted) {
          setEntries(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load entries:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="wrap">
        <Loading />
      </main>
    );
  }

  const momentsFelt = entries.filter((e) => e.mood).length;
  const memoriesSaved = entries.reduce((n, e) => n + (e.media?.length || 0), 0);

  return (
    <main className="wrap">
      <section className="welcome paper">
        <div>
          <small className="eyebrow">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </small>
          <h1>
            Welcome back, {user?.name || 'Dreamer'} <i>♡</i>
          </h1>
          <p>“The little things become the stories we remember.”</p>
          <Link className="btn primary" to="/entries/new">
            ✍ Write today's story
          </Link>
        </div>
        <div className="mascot">
          🧸<small>your safe<br />little corner</small>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <span>📖</span>
          <b>{entries.length}</b>
          <small>Total entries</small>
        </div>
        <div className="stat">
          <span>🌷</span>
          <b>{momentsFelt}</b>
          <small>Moments felt</small>
        </div>
        <div className="stat">
          <span>📸</span>
          <b>{memoriesSaved}</b>
          <small>Memories saved</small>
        </div>
        <div className="stat">
          <span>✨</span>
          <b>{entries.length ? '♡' : 0}</b>
          <small>Little stories</small>
        </div>
      </section>

      <div className="dash-grid">
        <section className="panel">
          <div className="head">
            <div>
              <small className="eyebrow">from your pages</small>
              <h2>Recent memories</h2>
            </div>
            <Link to="/entries">See all →</Link>
          </div>

          {entries.length > 0 ? (
            <div className="cards">
              {entries.slice(0, 3).map((e) => (
                <EntryCard entry={e} key={e.id || e._id} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <div>📖</div>
              <h3>Your diary is waiting for its first story ♡</h3>
              <p>Write something small. A thought, a memory, a silly moment — it all belongs here.</p>
              <Link className="btn primary" to="/entries/new">
                Write my first entry
              </Link>
            </div>
          )}
        </section>

        <aside>
          <div className="side weekly">
            <b>✨</b>
            <small className="eyebrow">your week</small>
            <h2>How did life feel lately?</h2>
            <p>Turn your little entries into a gentle weekly reflection.</p>
            <Link className="btn secondary" to="/weekly-reflection">
              View reflection →
            </Link>
          </div>
          <div className="side note">
            <small className="eyebrow">tiny reminder</small>
            <p>“You don't need a perfect day to have a beautiful memory.”</p>
            <span>♡</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
