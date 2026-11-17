import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEntries } from '../services/entries';
import Loading from '../components/Loading';

export default function Memories() {
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
        console.error('Failed to load memories:', err);
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

  const media = entries.flatMap((e) =>
    (e.media || []).map((m) => ({
      ...m,
      date: e.date,
      id: e.id || e._id,
    }))
  );

  return (
    <main className="wrap">
      <div className="heading">
        <small className="eyebrow">photos, videos & tiny moments</small>
        <h1>Little memories 📸</h1>
        <p>A scrapbook of the moments you decided to keep forever.</p>
      </div>

      {media.length > 0 ? (
        <div className="memorygrid">
          {media.map((m, i) => (
            <Link className="memory" to={`/entries/${m.id}`} key={i}>
              {m.type?.startsWith('video') ? (
                <div>🎞️</div>
              ) : (
                <img src={m.url} alt={m.name || 'memory'} />
              )}
              <b>{m.date}</b>
              <small>tap to open memory ♡</small>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">
          <div>📸</div>
          <h3>Your memory wall is waiting</h3>
          <p>Add photos or videos to any diary page and they will appear right here.</p>
          <Link className="btn primary" to="/entries/new">
            Add a memory
          </Link>
        </div>
      )}
    </main>
  );
}
