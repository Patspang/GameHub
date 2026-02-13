// Brush size selector — 3 sizes shown as filled circles

import { TEKENEN_CONFIG } from '../../../constants/gameConfig';

export function BrushSizePicker({ brushSize, onBrushSizeChange }) {
  return (
    <div className="flex items-center gap-2">
      {TEKENEN_CONFIG.BRUSH_SIZES.map((size) => (
        <button
          key={size}
          onClick={() => onBrushSizeChange(size)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            brushSize === size
              ? 'bg-primary-blue/20 ring-2 ring-primary-blue'
              : 'bg-white/50 active:bg-white/80'
          }`}
          aria-label={`Penseel ${size}px`}
        >
          <div
            className="rounded-full bg-text-primary"
            style={{ width: size * 2, height: size * 2 }}
          />
        </button>
      ))}
    </div>
  );
}
