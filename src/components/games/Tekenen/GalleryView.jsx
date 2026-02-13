// Full-size view of a saved drawing with delete and back buttons

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';

const T = DUTCH_TEXT.tekenen;

export function GalleryView({ drawing, onDelete, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <img
          src={drawing.dataUrl}
          alt="Tekening"
          className="w-full rounded-2xl shadow-lg bg-white"
        />
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="ghost" size="lg" onClick={onBack}>
          ← {T.tools.back}
        </Button>
        <Button variant="warning" size="lg" onClick={onDelete}>
          🗑️ {T.gallery.delete}
        </Button>
      </div>
    </div>
  );
}
