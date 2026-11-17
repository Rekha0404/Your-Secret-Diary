import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEntry, updateEntry } from '../services/entries';
import MoodSelector from '../components/MoodSelector';
import MediaUploader from '../components/MediaUploader';
import Loading from '../components/Loading';

export default function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [entry, setEntry] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');
  const [media, setMedia] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getEntry(id)
      .then((data) => {
        if (mounted) {
          if (data) {
            setEntry(data);
            setTitle(data.title || '');
            setContent(data.content || '');
            setMood(data.mood || '😊');
            setMedia(data.media || []);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to get entry:', err);
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

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await updateEntry(id, {
        title: title.trim() || 'A little day',
        content,
        mood,
        media,
      });
      navigate(`/entries/${id}`);
    } catch (err) {
      console.error('Update entry failed:', err);
      setError(err.message || 'Could not save changes.');
      setSaving(false);
    }
  }

  return (
    <main className="wrap writing">
      <Link className="back" to={`/entries/${id}`}>
        ← back to memory
      </Link>
      <span className="date">{entry.date}</span>

      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <form className="diary paper" onSubmit={submit}>
        <small className="eyebrow">edit your memory,</small>

        <input
          className="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <MoodSelector value={mood} onChange={setMood} />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
        />

        <MediaUploader media={media} setMedia={setMedia} />

        <div className="write-actions">
          <Link className="btn ghost" to={`/entries/${id}`}>
            Back
          </Link>
          <button className="btn primary" disabled={saving}>
            {saving ? 'Saving changes...' : 'Save changes ♡'}
          </button>
        </div>
      </form>
    </main>
  );
}
