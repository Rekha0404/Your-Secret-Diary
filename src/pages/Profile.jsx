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

export default function Profile() {
  const { user, theme, changeTheme } = useAuth();
  const activeTheme = theme || user?.theme || 'dreamy';

  return (
    <main className="wrap profile">
      <div className="heading">
        <small className="eyebrow">your little profile</small>
        <h1>Make it feel like you ♡</h1>
        <p>Choose an atmosphere that inspires your journaling today.</p>
      </div>

      <section className="paper profilecard">
        <div className="avatar">🌷</div>
        <h2>{user?.name || 'Dreamer'}</h2>
        <p>{user?.email || 'my-diary@local'}</p>

        <hr />

        <span className="field">Choose diary atmosphere</span>
        <div className="themes" style={{ marginTop: '16px' }}>
          {Object.entries(themeCatalog).map(([id, t]) => {
            const isChosen = activeTheme === id;
            return (
              <button
                type="button"
                className={isChosen ? 'chosen' : ''}
                key={id}
                onClick={() => changeTheme(id)}
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
      </section>
    </main>
  );
}
