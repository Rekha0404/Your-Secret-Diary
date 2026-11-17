import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEntries } from '../services/entries';
import EntryCard from '../components/EntryCard';
import Loading from '../components/Loading';

export default function AllEntries() {
  const [q, setQ] = useState('');
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
        console.error('Failed to load all entries:', err);
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

  const list = entries.filter(
    (e) =>
      (e.title || '').toLowerCase().includes(q.toLowerCase()) ||
      (e.content || '').toLowerCase().includes(q.toLowerCase()) ||
      (e.date || '').includes(q)
  );

  return (
    <main className="wrap">
      <div className="heading">
        <small className="eyebrow">all your little stories</small>
        <h1>My diary pages 📖</h1>
        <p>Search by date, title or a tiny piece of a memory.</p>
      </div>

      <div className="search">
        ⌕
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search your diary by title, text, or date..."
        />
      </div>

      {list.length > 0 ? (
        <div className="cards three">
          {list.map((e) => (
            <EntryCard entry={e} key={e.id || e._id} />
          ))}
        </div>
      ) : entries.length > 0 ? (
        <div className="empty">
          🔎
          <h3>No little story found</h3>
          <p>Try searching with another keyword or date.</p>
        </div>
      ) : (
        <div className="empty">
          <div>📖</div>
          <h3>Your diary is waiting for its first story ♡</h3>
          <p>Write something small and keep it here forever.</p>
          <Link className="btn primary" to="/entries/new">
            Write my first entry
          </Link>
        </div>
      )}
    </main>
  );
}
