// Intro screen: player enters their name and reads the opening story

import { useState } from 'react';

export function IntroScreen({ onStart, onExit }) {
  const [name, setName] = useState('');
  const [step, setStep] = useState('name'); // 'name' | 'story1' | 'story2'

  const storyLines = [
    {
      icon: '📬',
      text: 'Je krijgt een brief. Hij is van Boswachter Freek.',
    },
    {
      icon: '🌲',
      text: 'Freek kent het bos heel goed. Hij zoekt jouw hulp.',
    },
    {
      icon: '✨',
      text: 'Er is iets magisch verstopt in het bos: de Gouden Dennenpappel.',
    },
    {
      icon: '🌨️',
      text: 'Vind hem vóór de sneeuw valt. Dan is het voor honderd jaar te laat!',
    },
  ];

  const [storyIndex, setStoryIndex] = useState(0);

  if (step === 'name') {
    return (
      <div style={styles.fullscreen}>
        <div style={styles.card}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌲</div>
          <h1 style={styles.title}>De Gouden Dennenpappel</h1>
          <p style={styles.subtitle}>Wat is jouw naam?</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep('story')}
            placeholder="Typ je naam..."
            maxLength={16}
            style={styles.input}
            autoFocus
          />
          <button
            onClick={() => name.trim() && setStep('story')}
            disabled={!name.trim()}
            style={{
              ...styles.primaryBtn,
              opacity: name.trim() ? 1 : 0.4,
            }}
          >
            Ga verder →
          </button>
          <button onClick={onExit} style={styles.ghostBtn}>
            ← Terug
          </button>
        </div>
      </div>
    );
  }

  // Story slides
  const slide = storyLines[storyIndex];
  const isLast = storyIndex === storyLines.length - 1;

  return (
    <div style={styles.fullscreen}>
      <div style={styles.card}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>{slide.icon}</div>
        <p style={{ color: '#fff', fontSize: 20, lineHeight: 1.6, textAlign: 'center', maxWidth: 340 }}>
          {slide.text}
        </p>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8, marginTop: 28, marginBottom: 24 }}>
          {storyLines.map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: i === storyIndex ? '#7ccc5c' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (isLast) {
              onStart(name.trim());
            } else {
              setStoryIndex((i) => i + 1);
            }
          }}
          style={styles.primaryBtn}
        >
          {isLast ? `Ik ga op zoek, ${name}! 🌲` : 'Volgende →'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  fullscreen: {
    minHeight: '100dvh',
    background: 'linear-gradient(160deg, #0d2208 0%, #1a3d0f 60%, #2d5a1b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 420,
    width: '100%',
  },
  title: {
    color: '#f0d060',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0 0 8px',
  },
  subtitle: {
    color: '#a8e080',
    fontSize: 17,
    margin: '0 0 20px',
  },
  input: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    border: '2px solid #7ccc5c',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    outline: 'none',
    marginBottom: 16,
    boxSizing: 'border-box',
  },
  primaryBtn: {
    background: '#7ccc5c',
    color: '#0a1a05',
    border: 'none',
    borderRadius: 12,
    padding: '14px 32px',
    fontSize: 18,
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginBottom: 12,
  },
  ghostBtn: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.5)',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: '10px 28px',
    fontSize: 15,
    cursor: 'pointer',
    width: '100%',
  },
};
