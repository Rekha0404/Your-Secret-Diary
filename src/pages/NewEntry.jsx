import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createEntry, getTodayString } from '../services/entries';
import MoodSelector from '../components/MoodSelector';
import MediaUploader from '../components/MediaUploader';

export default function NewEntry() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');
  const [media, setMedia] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await createEntry({
        title: title.trim() || 'A little day',
        content,
        mood,
        date: getTodayString(),
        media,
      });
      navigate('/entries');
    } catch (err) {
      console.error('Save entry failed:', err);
      setError(err.message || 'Could not save this entry. Please try again.');
      setSaving(false);
    }
  }

  return (
    <main className="wrap writing">
      <Link className="back" to="/dashboard">
        ← back to my little space
      </Link>
      <span className="date">{getTodayString()}</span>

      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <form className="diary paper" onSubmit={submit}>
        <b className="corner">✦</b>
        <small className="eyebrow">dear diary,</small>

        <input
          className="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give today a tiny title..."
        />

        <MoodSelector value={mood} onChange={setMood} />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What happened today? What are you thinking? You can write anything here..."
          rows={8}
        />

        <MediaUploader media={media} setMedia={setMedia} />

        <div className="write-actions">
          <Link className="btn ghost" to="/dashboard">
            Back
          </Link>
          <button className="btn primary" disabled={saving}>
            {saving ? 'Keeping memory safe...' : 'Keep this memory safe ♡'}
          </button>
        </div>
      </form>
    </main>
  );
}
