import { useEffect, useState } from 'react';
import { getEntries } from '../services/entries';
import Calendar from '../components/Calendar';
import Loading from '../components/Loading';

export default function CalendarPage() {
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
        console.error('Failed to load calendar entries:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="wrap">
      <div className="heading">
        <small className="eyebrow">your little timeline</small>
        <h1>Memory calendar 🗓️</h1>
        <p>Every written day becomes a tiny dot on your story.</p>
      </div>

      {loading ? <Loading /> : <Calendar entries={entries} />}
    </main>
  );
}
