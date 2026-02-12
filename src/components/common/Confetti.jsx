// Lightweight confetti animation for win celebrations
// Renders colored particles that fall and fade out using CSS animations
// Particles are generated once via useState lazy initializer (React 19 safe)

import { useState } from 'react';

const COLORS = ['#F4D35E', '#7FBF7F', '#F19C79', '#6B9BD1', '#A78BFA', '#F472B6', '#34D399'];
const PARTICLE_COUNT = 40;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    color: COLORS[i % COLORS.length],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    isRound: i % 2 === 0,
  }));
}

export function Confetti() {
  const [particles] = useState(generateParticles);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isRound ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
