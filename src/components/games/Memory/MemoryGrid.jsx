// Responsive CSS grid of memory cards
// Computes card size from viewport width, clamped 56–90px

import { MemoryCard } from './MemoryCard';

const MAX_CARD_SIZE = 90;
const MIN_CARD_SIZE = 56;
const GRID_GAP = 8;
const SIDE_PADDING = 32;

function computeCardSize(cols) {
  const totalGaps = (cols - 1) * GRID_GAP;
  const available = Math.min(window.innerWidth, 672) - SIDE_PADDING - totalGaps;
  return Math.max(MIN_CARD_SIZE, Math.min(MAX_CARD_SIZE, Math.floor(available / cols)));
}

export function MemoryGrid({ cards, cols, onCardClick }) {
  const cardSize = computeCardSize(cols);

  return (
    <div
      className="inline-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cardSize}px)`,
        gap: `${GRID_GAP}px`,
      }}
    >
      {cards.map((card) => (
        <MemoryCard
          key={card.id}
          emoji={card.emoji}
          isFlipped={card.isFlipped}
          isMatched={card.isMatched}
          onClick={() => onCardClick(card.id)}
          cardSize={cardSize}
        />
      ))}
    </div>
  );
}
