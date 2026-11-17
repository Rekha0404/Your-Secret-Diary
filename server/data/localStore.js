const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname);
const DB_FILE = path.join(DATA_DIR, 'diary_db.json');

const ensureFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const demoHashedPassword = bcrypt.hashSync('demo123', 10);
    const initialData = {
      users: [
        {
          _id: 'demo-user-1',
          name: 'Dreamer',
          email: 'demo@example.com',
          password: demoHashedPassword,
          theme: 'dreamy',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      entries: [
        {
          _id: 'demo-entry-1',
          user: 'demo-user-1',
          title: 'A gentle beginning',
          content: 'Started my secret diary today. The air feels crisp and full of little quiet possibilities. Keep believing in the small things ♡',
          mood: '🌷',
          date: new Date().toISOString().slice(0, 10),
          media: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
};

const readDB = () => {
  try {
    ensureFile();
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local DB:', err.message);
    return { users: [], entries: [] };
  }
};

const writeDB = (data) => {
  try {
    ensureFile();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing local DB:', err.message);
    return false;
  }
};

module.exports = {
  readDB,
  writeDB,
  ensureFile,
};
