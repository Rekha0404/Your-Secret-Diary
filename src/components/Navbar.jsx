import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const themeOrder = ['dreamy', 'cozy', 'playful', 'midnight'];
const themeMeta = {
  dreamy: { icon: '🌸', name: 'Dreamy' },
  cozy: { icon: '🌿', name: 'Cozy' },
  playful: { icon: '🍑', name: 'Playful' },
  midnight: { icon: '🌙', name: 'Midnight' },
};

export default function Navbar() {
  const { user, logout, theme, changeTheme } = useAuth();
  const navigate = useNavigate();

  const currentTheme = theme || user?.theme || 'dreamy';
  const meta = themeMeta[currentTheme] || themeMeta.dreamy;

  const handleCycleTheme = () => {
    const idx = themeOrder.indexOf(currentTheme);
    const nextTheme = themeOrder[(idx + 1) % themeOrder.length];
    changeTheme(nextTheme);
  };

  return (
    <header className="nav">
      <Link className="logo" to={user ? '/dashboard' : '/'}>
        <b>♡</b> Secret Diary
      </Link>
      <nav>
        <button
          type="button"
          className="theme-pill-btn"
          onClick={handleCycleTheme}
          title={`Theme: ${meta.name}. Click to switch theme.`}
        >
          <span>{meta.icon}</span>
          <i>{meta.name}</i>
        </button>
        {user ? (
          <>
            <Link to="/dashboard">Home</Link>
            <Link to="/entries">Pages</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/memories">Memories</Link>
            <Link to="/weekly-reflection">Weekly</Link>
            <Link to="/profile">Profile</Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link className="pill" to="/signup">
              Create diary
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
