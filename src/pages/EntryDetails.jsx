import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteEntry, getEntry } from '../services/entries';
import Loading from '../components/Loading';

export default function EntryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    getEntry(id)
      .then((data) => {
        if (mounted) {
          setEntry(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to get entry details:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="wrap">
        <Loading />
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="wrap empty">
        ☁️
        <h3>This page wandered away</h3>
        <Link className="btn primary" to="/entries">
          Back to diary
        </Link>
      </main>
    );
  }

  async function remove() {
    if (window.confirm('Remove this diary page?')) {
      setDeleting(true);
      try {
        await deleteEntry(id);
        navigate('/entries');
      } catch (err) {
        alert(err.message || 'Could not delete entry.');
        setDeleting(false);
      }
    }
  }

  return (
    <main className="wrap detail">
      <Link className="back" to="/entries">
        ← all diary pages
      </Link>

      <article className="diary paper">
        <div className="detailtop">
          <span>{entry.date}</span>
          <span style={{ fontSize: '1.5rem' }}>{entry.mood}</span>
        </div>

        <small className="eyebrow">dear diary,</small>
        <h1>{entry.title}</h1>

        <p className="content" style={{ whiteSpace: 'pre-wrap' }}>
          {entry.content || 'This page is full of quiet thoughts. ♡'}
        </p>

        {entry.media?.length > 0 && (
          <div className="media">
            {entry.media.map((m, i) =>
              m.type?.startsWith('video') ? (
                <video key={i} src={m.url} controls />
              ) : (
                <img key={i} src={m.url} alt={m.name || 'memory'} />
              )
            )}
          </div>
        )}

        <div className="write-actions">
          <Link className="btn secondary" to={`/entries/${id}/edit`}>
            Edit page
          </Link>
          <button className="btn danger" onClick={remove} disabled={deleting}>
            {deleting ? 'Removing...' : 'Delete'}
          </button>
        </div>
      </article>
    </main>
  );
}
