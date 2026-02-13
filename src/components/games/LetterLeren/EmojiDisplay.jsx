// Large emoji display with letter progress slots
// Shows the emoji prominently, and for Hard mode, letter slots below

export function EmojiDisplay({ emoji, word, selectedLetters, difficulty, showCompleted }) {
  const isHard = difficulty === 'moeilijk';
  const showSlots = isHard || showCompleted;

  return (
    <div className="flex flex-col items-center">
      {/* Large emoji */}
      <div className="text-[8rem] leading-none mb-4 animate-bounce">
        {emoji}
      </div>

      {/* Letter slots: always for Normal/Hard, only during celebration for Easy */}
      {showSlots && (
        <div className="flex items-center justify-center gap-2 mt-2">
          {word.split('').map((letter, i) => {
            const isRevealed = showCompleted || i < selectedLetters.length;
            return (
              <span
                key={i}
                className={`
                  font-display font-bold text-3xl w-14 h-14 flex items-center justify-center
                  rounded-xl transition-all duration-200
                  ${isRevealed
                    ? 'bg-success text-white scale-110'
                    : 'bg-bg-secondary text-text-secondary'}
                `}
              >
                {isRevealed ? letter : '_'}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
