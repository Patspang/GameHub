// Saved drawings gallery — grid of thumbnails with view and delete

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';

const T = DUTCH_TEXT.tekenen;

export function Gallery({ drawings, onView, onDelete, onBack }) {
  if (drawings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🎨</div>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
          {T.gallery.empty}
        </h2>
        <p className="font-body text-text-secondary mb-8">
          {T.gallery.emptyHint}
        </p>
        <Button variant="ghost" size="lg" onClick={onBack}>
          ← {T.tools.back}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center p-4">
      <h2 className="font-display text-3xl font-bold text-text-primary mb-6 mt-4">
        {T.gallery.title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {drawings.map((drawing, index) => (
          <div key={drawing.id} className="relative group">
            <button
              onClick={() => onView(index)}
              className="w-full rounded-2xl overflow-hidden shadow-md transition-all active:scale-95 bg-white"
            >
              <img
                src={drawing.dataUrl}
                alt={`Tekening ${index + 1}`}
                className="w-full aspect-[4/3] object-cover"
              />
            </button>
            <button
              onClick={() => onDelete(index)}
              className="absolute top-2 right-2 w-11 h-11 rounded-full bg-error-dark text-white flex items-center justify-center text-lg opacity-100 transition-opacity active:scale-90"
              title={T.gallery.delete}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button variant="ghost" size="lg" onClick={onBack}>
          ← {T.tools.back}
        </Button>
      </div>
    </div>
  );
}
