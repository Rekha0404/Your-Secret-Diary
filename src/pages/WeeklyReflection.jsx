import { useEffect, useState } from 'react';
import { getWeeklySummary } from '../services/entries';
import Loading from '../components/Loading';

export default function WeeklyReflection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getWeeklySummary()
      .then((res) => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load weekly reflection:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="wrap reflection">
        <Loading />
      </main>
    );
  }

  const stats = data?.stats || {
    recentCount: 0,
    dominantMood: '🌷',
    moodCounts: {},
    totalMedia: 0,
  };

  const reflection = data?.reflection || {
    headline: 'Your week is still a blank canvas.',
    summary: 'Write a few diary pages first, then come back here to see your week come together.',
    suggestion: 'Take time to pause and reflect on your days.',
  };

  return (
    <main className="wrap reflection">
      <div className="heading">
        <small className="eyebrow">a gentle look back</small>
        <h1>Your week in little words ✨</h1>
        <p>Live intelligent analysis of your emotions, moods and reflections.</p>
      </div>

      <section className="diary paper">
        <div className="sun">☀️</div>
        <small className="eyebrow">this week's tiny reflection</small>

        <h2>{reflection.headline}</h2>
        <p>{reflection.summary}</p>

        <div className="reflectstats">
          <div>
            <b>{stats.recentCount}</b>
            <small>pages written</small>
          </div>
          <div>
            <b>{Object.keys(stats.moodCounts).length}</b>
            <small>moods felt</small>
          </div>
          <div>
            <b style={{ fontSize: '1.8rem' }}>{stats.dominantMood}</b>
            <small>common mood</small>
          </div>
          <div>
            <b>{stats.totalMedia}</b>
            <small>photos saved</small>
          </div>
        </div>

        <div className="future">
          💌 <b>Gentle Reminder:</b> {reflection.suggestion}
        </div>
      </section>
    </main>
  );
}
