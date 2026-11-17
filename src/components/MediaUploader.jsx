import { useState } from 'react';

export default function MediaUploader({ media = [], setMedia }) {
  const [reading, setReading] = useState(false);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setReading(true);

    try {
      const convertedFiles = await Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                type: file.type,
                url: reader.result, // base64 Data URL
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      setMedia((prev) => [...prev, ...convertedFiles]);
    } catch (err) {
      console.error('Error processing media:', err);
    } finally {
      setReading(false);
      event.target.value = '';
    }
  };

  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <label className="upload" style={{ cursor: reading ? 'wait' : 'pointer' }}>
        <span>{reading ? '⏳' : '📸'}</span>
        <b>{reading ? 'Adding photos...' : 'Add little memories'}</b>
        <small>Photos or moments from today (saved permanently ♡)</small>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          disabled={reading}
          onChange={handleFileChange}
        />
      </label>

      {media.length > 0 && (
        <div className="previews">
          {media.map((m, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {m.type?.startsWith('video') ? (
                <video src={m.url} controls />
              ) : (
                <img src={m.url} alt={m.name || 'memory'} />
              )}
              <button
                type="button"
                onClick={() => removeMedia(i)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  lineHeight: 1,
                }}
                title="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
