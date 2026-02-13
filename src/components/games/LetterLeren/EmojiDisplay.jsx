// Large emoji display with letter reveal on celebration

export function EmojiDisplay({ emoji, word, showCompleted }) {
  return (
    <div className="flex flex-col items-center">
      {/* Large emoji */}
      <div className="text-[8rem] leading-none mb-4 animate-bounce">
        {emoji}
      </div>

      {/* Letter slots: revealed during celebration */}
      {showCompleted && (
        <div className="flex items-center justify-center gap-2 mt-2">
          {word.split('').map((letter, i) => (
            <span
              key={i}
              className="font-display font-bold text-3xl w-14 h-14 flex items-center justify-center rounded-xl bg-success-dark text-white scale-110 transition-all duration-200"
            >
              {letter}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
